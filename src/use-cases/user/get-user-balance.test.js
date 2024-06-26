import { UserNotFoundError } from '../../errors/user.js'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { faker } from '@faker-js/faker'
import { userBalance, user } from '../../tests/index.js'

describe('GetUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
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

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { getUserBalanceUseCase, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = getUserBalanceUseCase.execute(faker.string.uuid())

        //assert
        expect(promise).rejects.toThrow(new Error())
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        //arrange
        const { getUserBalanceUseCase, getUserBalanceRepository } = makeSut()
        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        //act
        const promise = getUserBalanceUseCase.execute(faker.string.uuid())

        //assert
        expect(promise).rejects.toThrow(new Error())
    })
})
