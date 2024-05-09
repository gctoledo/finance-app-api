import { UserNotFoundError } from '../../errors/user.js'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { faker } from '@faker-js/faker'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investments: faker.finance.amount(),
        balance: faker.finance.amount(),
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()

        const getUserBalanceUseCase = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return {
            getUserBalanceRepository,
            getUserBalanceUseCase,
            getUserByIdRepository,
        }
    }

    it('should get user balance sucessfully', async () => {
        //arrange
        const { getUserBalanceUseCase } = makeSut()

        //act
        const result = await getUserBalanceUseCase.execute(faker.string.uuid())

        //assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        //arrange
        const { getUserBalanceUseCase, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        //act
        const promise = getUserBalanceUseCase.execute(userId)

        //assert
        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrange
        const { getUserBalanceUseCase, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
        //act
        await getUserBalanceUseCase.execute(userId)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        //arrange
        const { getUserBalanceUseCase, getUserBalanceRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')
        //act
        await getUserBalanceUseCase.execute(userId)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
