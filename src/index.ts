import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

interface Message {
  id: number
  content: string
}

io.on('connection', (socket: Socket) => {
  console.log('connection made: ', socket.id)

  socket.on('message', (message: Message) => {
    io.emit('message', message)
  })
})

httpServer.listen(8080, () => {
  console.log('listening on port 8080')
})
