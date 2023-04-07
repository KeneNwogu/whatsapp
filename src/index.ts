import app from "./app"
import { prisma } from "./db/db.client"

const port = process.env.PORT || 3000;

app.listen(port, async () => {
    await prisma.$connect()
    console.log(`Server listening on http://localhost:${port}`)
})


process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})