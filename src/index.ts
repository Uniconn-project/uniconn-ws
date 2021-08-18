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

  socket.on('join-room', (chatId: number) => {
    socket.join(chatId.toString())
    console.log(`${socket.id} joined room ${chatId}`)
  })

  socket.on('message', (chatId: number) => {
    socket.to(chatId.toString()).emit('message')
    socket.emit('message')
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
