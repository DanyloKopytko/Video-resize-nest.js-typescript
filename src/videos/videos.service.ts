import { Model } from 'mongoose'
import { Queue } from 'bull'
import path from 'path'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectQueue } from '@nestjs/bull'

import { Video, VideoDocument, videoStatuses } from '../schemas/video.schema'

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    @InjectQueue('videos') private videosQueue: Queue
  ) {}

  async getVideoStatus(id): Promise<Video> {
    return this.videoModel.findById(id)
  }

  async uploadVideo(file): Promise<{ id }> {
    const video = await this.videoModel.create({
      status: 0,
      progress: videoStatuses.IN_PROGRESS,
      path: path.resolve(file.path)
    })

    await this.videosQueue.add('video-resizing', { id: video.id })

    return { id: video.id }
  }
}
