import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bull'

import { VideosModule } from './videos/videos.module'

@Module({
  imports: [
    VideosModule,
    MongooseModule.forRoot('mongodb://localhost:27017/practice-final'),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
