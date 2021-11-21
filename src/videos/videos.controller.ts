import { diskStorage } from 'multer'
import { extname } from 'path'
import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { VideosService } from './videos.service'
import { videoValidator } from './validators/videos.validator'
import { Video } from '../schemas/video.schema'
import { ALLOWED_VIDEO_SIZE } from './constants'

@Controller('video')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('status/:id')
  async videoStatus(@Param('id') id: string): Promise<Video> {
    return this.videosService.getVideoStatus(id)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const randomName = Array(8)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        }
      }),
      limits: { fileSize: ALLOWED_VIDEO_SIZE },
      fileFilter: videoValidator
    })
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File): Promise<{ id }> {
    return this.videosService.uploadVideo(file)
  }
}
