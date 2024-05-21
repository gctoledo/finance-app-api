import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction'
import { UserNotFoundError } from '../../errors/user'

describe('CreateTransactionUseCase', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const createTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'random_id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
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
        expect(result).toEqual({ ...createTransactionParams, id: 'random_id' })
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
})
