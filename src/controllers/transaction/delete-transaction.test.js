import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
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

    it('should call DeleteTransactionUseCase with correct params', async () => {
        //arrange
        const { deleteTransactionController, deleteTransactionUseCase } =
            makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        //act
        await deleteTransactionController.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
        )
    })
})
