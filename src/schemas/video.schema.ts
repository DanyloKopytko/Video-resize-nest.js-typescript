import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type VideoDocument = Video & Document

export enum videoStatuses {
  IN_PROGRESS,
  DONE,
  FAILED
}

@Schema()
export class Video {
  @Prop()
  status: videoStatuses

  @Prop()
  progress: number

  @Prop()
  path: string
}

export const VideoSchema = SchemaFactory.createForClass(Video)
