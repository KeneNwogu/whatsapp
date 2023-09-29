import express from 'express'
import "express-async-errors";
import { graphqlHTTP } from 'express-graphql'
import { Application } from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { SocketService } from './socket/socket.service'
import { schema } from './graphql/schema'
import { resolvers } from './graphql/resolvers'
import routes from './routes/v1/routes'
import dotenv from "dotenv"
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()
declare global {
    namespace Express {
      interface Request {
        user: any;
        // token: Jwt | string;
      }
    }
}

const app: Application = express()

app.use(express.json());
app.use(cors({
    origin: '*'
}))

app.get('/health', (req, res) => res.sendStatus(200))

app.use('/graphql', graphqlHTTP({
   schema: schema,
   rootValue: resolvers,
   graphiql: true 
}))

app.use("/api/v1", routes);

app.use(errorHandler)

const server = createServer(app)

export const io = new SocketService(server)

export default server