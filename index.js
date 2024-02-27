import 'dotenv/config.js'
import express from 'express'
import { CreateUserController } from './src/controllers/create-user.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (req, res) => {
    const createUserController = new CreateUserController()

    const response = await createUserController.execute(req)

    res.status(response.statusCode).json(response.body)
})

app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdController = new GetUserByIdController()

    const response = await getUserByIdController.execute(req)

    res.status(response.statusCode).send(response.body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
