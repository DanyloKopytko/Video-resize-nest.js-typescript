import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bull'

import { VideosController } from './videos.controller'
import { VideosService } from './videos.service'
import { Video, VideoSchema } from '../schemas/video.schema'
import { VideosConsumer } from './videos-queue.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    BullModule.registerQueue({
      name: 'videos'
    })
  ],
  controllers: [VideosController],
  providers: [VideosService, VideosConsumer]
})
export class VideosModule {}
