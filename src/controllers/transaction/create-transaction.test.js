import { CreateTransactionController } from './create-transaction.js'
import { faker } from '@faker-js/faker'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const createTransactionController = new CreateTransactionController(
            createTransactionUseCase,
        )

        return { createTransactionController, createTransactionUseCase }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 when creating transaction sucessfully', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 400 when missing user_id', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute({
            body: { ...httpRequest.body, user_id: undefined },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute({
            body: { ...httpRequest.body, name: undefined },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute({
            body: { ...httpRequest.body, date: undefined },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute({
            body: { ...httpRequest.body, type: undefined },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute({
            body: { ...httpRequest.body, amount: undefined },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute({
            body: { ...httpRequest.body, date: 'invalid_date' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        //arrange
        const { createTransactionController } = makeSut()

        //act
        const result = await createTransactionController.execute({
            body: { ...httpRequest.body, type: 'invalid_type' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })
})
