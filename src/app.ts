import express from 'express'
import { Application } from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { SocketService } from './socket/socket.service'

const app: Application = express()
app.use(cors({
    origin: '*'
}))

const server = createServer(app)

const io = SocketService.createSocketServer(server)


export default app