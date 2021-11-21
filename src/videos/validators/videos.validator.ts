import { ALLOWED_VIDEO_MIME_TYPES } from '../constants'

export function videoValidator(req, file, cb): void {
  if (!file) {
    cb(new Error('File expected'))
  }

  if (!ALLOWED_VIDEO_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type'))
  }

  cb(null, true)
}
