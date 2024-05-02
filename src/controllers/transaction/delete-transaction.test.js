import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
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
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const deleteTransactionController = new DeleteTransactionController(
            deleteTransactionUseCase,
        )

        return { deleteTransactionController, deleteTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    }

    it('should return 200 when deleting transaction sucessfully', async () => {
        //arrange
        const { deleteTransactionController } = makeSut()

        //act
        const result = await deleteTransactionController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        //arrange
        const { deleteTransactionController } = makeSut()

        //act
        const result = await deleteTransactionController.execute({
            params: { transactionId: 'invalid_id' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when transaction is not found', async () => {
        //arrange
        const { deleteTransactionController, deleteTransactionUseCase } =
            makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )

        //act
        const result = await deleteTransactionController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        //arrange
        const { deleteTransactionController, deleteTransactionUseCase } =
            makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await deleteTransactionController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })
})
