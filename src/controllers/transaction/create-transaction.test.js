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
})
