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

interface Profile {
  id: number
}

interface Message {
  id: number
  sender: Profile
  receiver: Profile
  content: string
  timestamp: Date
}

interface SocketIdMap {
  [key: number]: string
}

const socketIdMap: SocketIdMap = {}

io.on('connection', (socket: Socket) => {
  console.log('connection made: ', socket.id, io.sockets.sockets.size)

  socket.on('profile-id', (id: number) => {
    socketIdMap[id] = socket.id
    console.log('profile-id: ', socketIdMap)
  })

  socket.on('message', (message: Message) => {
    socket.to(socketIdMap[message.receiver.id]).emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('disconnected: ', socket.id, io.sockets.sockets.size)
  })
})

httpServer.listen(3030, () => {
  console.log('listening on port 3030')
})
