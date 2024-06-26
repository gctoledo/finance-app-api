import { CreateTransactionUseCase } from './create-transaction'
import { UserNotFoundError } from '../../errors/user'
import { transaction, user } from '../../tests/index.js'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = { ...transaction, id: undefined }

    class CreateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'random_id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return { ...user }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const createTransactionUseCase = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            createTransactionRepository,
            idGeneratorAdapter,
            getUserByIdRepository,
            createTransactionUseCase,
        }
    }

    it('should create transaction successfully', async () => {
        //arrange
        const { createTransactionUseCase } = makeSut()

        //act
        const result = await createTransactionUseCase.execute(
            createTransactionParams,
        )

        //assert
        expect(result).toEqual(transaction)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrange
        const { createTransactionUseCase, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        //act
        await createTransactionUseCase.execute(createTransactionParams)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(createTransactionParams.user_id)
    })

    it('should call IdGeneratorAdapter', async () => {
        //arrange
        const { createTransactionUseCase, idGeneratorAdapter } = makeSut()
        const executeSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        //act
        await createTransactionUseCase.execute(createTransactionParams)

        //assert
        expect(executeSpy).toHaveBeenCalled()
    })

    it('should call CreateTransactionRepository with correct params', async () => {
        //arrange
        const { createTransactionUseCase, createTransactionRepository } =
            makeSut()
        const executeSpy = jest.spyOn(createTransactionRepository, 'execute')

        //act
        await createTransactionUseCase.execute(createTransactionParams)

        //assert
        expect(executeSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        //arrange
        const { createTransactionUseCase, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        //act
        const promise = createTransactionUseCase.execute(
            createTransactionParams,
        )

        //assert
        expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { createTransactionUseCase, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = createTransactionUseCase.execute(
            createTransactionParams,
        )

        //assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        //arrange
        const { createTransactionUseCase, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        //act
        const promise = createTransactionUseCase.execute(
            createTransactionParams,
        )

        //assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        //arrange
        const { createTransactionUseCase, createTransactionRepository } =
            makeSut()
        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        //act
        const promise = createTransactionUseCase.execute(
            createTransactionParams,
        )

        //assert
        expect(promise).rejects.toThrow()
    })
})
