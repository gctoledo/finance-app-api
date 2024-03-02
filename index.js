import 'dotenv/config.js'
import express from 'express'

import {
    makeCreateUserController,
    makeGetUserByIdController,
    makeDeleteUserController,
    makeUpdateUserController,
} from './src/factories/controllers/user.js'

const app = express()

app.use(express.json())

app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdController = makeGetUserByIdController()

    const response = await getUserByIdController.execute(req)

    res.status(response.statusCode).send(response.body)
})

app.post('/api/users', async (req, res) => {
    const createUserController = makeCreateUserController()

    const response = await createUserController.execute(req)

    res.status(response.statusCode).json(response.body)
})

app.patch('/api/users/:userId', async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const response = await updateUserController.execute(req)

    res.status(response.statusCode).send(response.body)
})

app.delete('/api/users/:userId', async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const response = await deleteUserController.execute(req)

    res.status(response.statusCode).send(response.body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
