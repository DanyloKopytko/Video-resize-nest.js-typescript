import { Job } from 'bull'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { Processor, Process } from '@nestjs/bull'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Video, VideoDocument, videoStatuses } from '../schemas/video.schema'

@Processor('videos')
export class VideosConsumer {
  constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>) {}

  @Process('video-resizing')
  async resize(job: Job<{ id: string }>): Promise<void> {
    const video = await this.videoModel.findById(job.data.id)

    const [baseVideoPath, fileExt] = video.path.split('.')

    const processedVideoPath = `${baseVideoPath}-1920x1080.${fileExt}`

    console.log(`Starting video resizing event for video ${video.id}`)
    ffmpeg(video.path)
      .output(processedVideoPath)
      .size('1920x1080')
      .on('error', async (err) => {
        console.log(`Error on processing video ${video.id}` + err.message)

        fs.unlinkSync(video.path)

        video.progress = 100
        video.status = videoStatuses.FAILED
        video.path = null
        await video.save()
      })
      .on('progress', async (progress) => {
        video.progress = progress.percent
        await video.save()
      })
      .on('end', async () => {
        console.log(`Finished processing video ${video.id}`)

        fs.unlinkSync(video.path)

        video.progress = 100
        video.status = videoStatuses.DONE
        video.path = processedVideoPath
        await video.save()
      })
      .run()
  }
}
