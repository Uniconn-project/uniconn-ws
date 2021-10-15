import express from 'express'
import cors, { CorsOptions } from 'cors'
import { Server, Socket } from 'socket.io'

const PORT = process.env.PORT || 3030

const allowedOrigins = [
  'https://uniconn-web.vercel.app',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:1234',
  'http://localhost:1234'
]
const options: CorsOptions = {
  origin: allowedOrigins
}

const server = express()
  .use(cors(options))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = new Server(server, {
  cors: {
    origin: allowedOrigins
  }
})

io.on('connection', (socket: Socket) => {
  console.log(
    `connected: ${socket.id}`,
    '|',
    `total connections: ${io.sockets.sockets.size}`
  )

  socket.on('initialize', (myProfileId: number) => {
    socket.join(myProfileId.toString())
    console.log(`${socket.id} joined room ${myProfileId}`)
  })

  socket.on('message', (profileIds: number[], chatId: number) => {
    for (const profileId of profileIds) {
      socket.to(profileId.toString()).emit('message', chatId)
    }
    socket.emit('message', chatId)
  })

  socket.on(
    'message-visualization',
    (viewerProfileId: number, profileIds: number[], chatId: number) => {
      for (const profileId of profileIds) {
        socket
          .to(profileId.toString())
          .emit('message-visualization', { viewerProfileId, chatId })
      }
      socket.emit('message-visualization', { viewerProfileId, chatId })
    }
  )

  socket.on(
    'message-typing',
    (typerProfileId: number, profileIds: number[], chatId: number) => {
      for (const profileId of profileIds) {
        socket
          .to(profileId.toString())
          .emit('message-typing', { typerProfileId, chatId })
      }
      socket.emit('message-typing', { typerProfileId, chatId })
    }
  )

  socket.on('notification', (profileIds: number[]) => {
    for (const profileId of profileIds) {
      socket.to(profileId.toString()).emit('notification')
    }
  })

  socket.on('disconnect', () => {
    console.log(
      `disconnected: ${socket.id}`,
      '|',
      `total connections: ${io.sockets.sockets.size}`
    )
  })
})
