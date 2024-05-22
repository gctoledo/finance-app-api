import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction.js'
import { transaction } from '../../tests/index.js'

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()

        const updateTransactionUseCase = new UpdateTransactionUseCase(
            updateTransactionRepository,
        )

        return { updateTransactionRepository, updateTransactionUseCase }
    }

    it('should update transaction successfully', async () => {
        //arrange
        const { updateTransactionUseCase } = makeSut()

        //act
        const result = await updateTransactionUseCase.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        })

        //assert
        expect(result).toEqual(transaction)
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        //arrange
        const { updateTransactionUseCase, updateTransactionRepository } =
            makeSut()
        const executeSpy = jest.spyOn(updateTransactionRepository, 'execute')

        //act
        await updateTransactionUseCase.execute(transaction.id, {
            amount: transaction.amount,
        })

        //assert
        expect(executeSpy).toHaveBeenCalledWith(transaction.id, {
            amount: transaction.amount,
        })
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        //arrange
        const { updateTransactionUseCase, updateTransactionRepository } =
            makeSut()
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        //act
        const promise = updateTransactionUseCase.execute(transaction.id, {
            amount: transaction.amount,
        })

        //assert
        expect(promise).rejects.toThrow()
    })
})
