import { UpdateTransactionController } from './update-transaction.js'
import { faker } from '@faker-js/faker'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.string.alphanumeric(10),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const updateTransactionController = new UpdateTransactionController(
            updateTransactionUseCase,
        )

        return { updateTransactionController, updateTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.string.alphanumeric(10),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 200 when updating transaction', async () => {
        //arrange
        const { updateTransactionController } = makeSut()

        //act
        const result = await updateTransactionController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when invalid id is provided', async () => {
        //arrange
        const { updateTransactionController } = makeSut()

        //act
        const result = await updateTransactionController.execute({
            ...httpRequest,
            params: { transactionId: 'invalid_id' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        //arrange
        const { updateTransactionController } = makeSut()

        //act
        const result = await updateTransactionController.execute({
            ...httpRequest,
            body: { ...httpRequest.body, unallowed_field: 'unallowed_value' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        //arrange
        const { updateTransactionController } = makeSut()

        //act
        const result = await updateTransactionController.execute({
            ...httpRequest,
            body: { ...httpRequest.body, amount: 'invalid_amount' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        //arrange
        const { updateTransactionController } = makeSut()

        //act
        const result = await updateTransactionController.execute({
            ...httpRequest,
            body: { ...httpRequest.body, type: 'invalid_type' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })
})
