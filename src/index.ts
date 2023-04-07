import app from "./app"
import { prisma } from "./db/db.client"


app.listen(process.env.PORT || 3000, async () => {
    await prisma.$connect()
    console.log('Server listening on http://localhost:3000')
})


process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})