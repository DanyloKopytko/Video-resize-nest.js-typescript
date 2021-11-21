# Final project: Nest.js, TS, task queues, bull, multer

## Description

Implement video-processing web-service, using nestjs build-in task queues (nestjs/bull) and file uploader (multer middleware)

Goal: Develop web-service for resizing video files, and notifying client about job progress and status. 

Actors: Client, Server

Steps: 
1. Client send a video file to the server
2. Server validates file type and size 
3. Server enqueues new job (video resizing) and creates new record in DB where `id`, `status`, `progress` are persisted
4. Server returns job `id` to the client
5. Client can use `id` to reach `/status` endpoint and get current status of the job with given `id`. Client uses this info to display loader bar or show progress percentage to user. 
6. Server has a hooks that updates progress or status in DB, when job status or progress is changed. 

API spec

`/status` - returns current status and progress value for given job `id`

For this task you should use only Typescript language. For video resizing you can use `fluent-ffmpeg` module. Should implement only Server. 