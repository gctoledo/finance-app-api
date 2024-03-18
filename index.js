import 'dotenv/config.js'
import express from 'express'

import {
    makeCreateUserController,
    makeGetUserByIdController,
    makeDeleteUserController,
    makeUpdateUserController,
    makeCreateTransactionController,
    makeGetTransactionsByUserId,
    makeUpdateTransactionController,
} from './src/factories/controllers/index.js'

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

app.get('/api/transactions', async (req, res) => {
    const getTransactionsByUserIdController = makeGetTransactionsByUserId()

    const response = await getTransactionsByUserIdController.execute(req)

    res.status(response.statusCode).send(response.body)
})

app.post('/api/transactions', async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const response = await createTransactionController.execute(req)

    res.status(response.statusCode).send(response.body)
})

app.patch('/api/transactions/:transactionId', async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController()

    const response = await updateTransactionController.execute(req)

    res.status(response.statusCode).send(response.body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
