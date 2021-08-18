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

interface Message {
  chatId: number
  senderId: number
  content: string
}

io.on('connection', (socket: Socket) => {
  console.log('connected: ', socket.id, io.sockets.sockets.size)

  socket.on('join-room', (chatId: number) => {
    socket.join(chatId.toString())
  })

  socket.on('message', (message: Message) => {
    socket.to(message.chatId.toString()).to(socket.id).emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('disconnected: ', socket.id, io.sockets.sockets.size)
  })
})

httpServer.listen(3030, () => {
  console.log('listening on port 3030')
})
