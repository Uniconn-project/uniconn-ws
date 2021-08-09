import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket: Socket) => {
  console.log('connection made: ', socket.id)

  socket.on('message', ({ value }: { value: string }) => {
    io.emit('message', { value })
  })
})

httpServer.listen(3030, () => {
  console.log('listening on port 3030')
})
