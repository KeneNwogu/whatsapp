import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { Application } from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { SocketService } from './socket/socket.service'
import { schema } from './graphql/schema'
import { resolvers } from './graphql/resolvers'


const app: Application = express()
app.use(cors({
    origin: '*'
}))

app.use('/graphql', graphqlHTTP({
   schema: schema,
   rootValue: resolvers,
   graphiql: true 
}))

const server = createServer(app)

const io = SocketService.createSocketServer(server)


export default app