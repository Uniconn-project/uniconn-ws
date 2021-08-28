import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://127.0.0.1:3000',
      'http://127.0.0.1:1234',
      'http://localhost:3000',
      'http://localhost:1234'
    ]
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
    for (let profileId of profileIds) {
      socket.to(profileId.toString()).emit('message', chatId)
    }
    socket.emit('message', chatId)
  })

  socket.on('message-visualization', (profileIds: number[], chatId: number) => {
    for (let profileId of profileIds) {
    socket.to(profileId.toString()).emit('message-visualization', chatId)
    }
    socket.emit('message-visualization', chatId)
  })

  socket.on('notification', (profileIds: number[]) => {
    for (let profileId of profileIds) {
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

httpServer.listen(3030, () => {
  console.log('listening on port 3030')
})
