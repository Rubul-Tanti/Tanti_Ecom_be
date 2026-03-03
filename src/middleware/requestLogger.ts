import { Request, Response, NextFunction } from 'express'

export const RequestLogger=(req: Request, res: Response, next: NextFunction) => {
  const date = new Date()
  const time = date.toISOString()
  const url = req.url
  const origin = req.get('origin') || req.headers.host
  const device = req.headers['user-agent'] || 'Unknown'

  console.log(`[${time}] Request from ${origin} to ${url}, Device: ${device}`)

  next()
}