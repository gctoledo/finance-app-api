import { GetUserByIdUseCase } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'
import { user } from '../../tests/index.js'

describe('GetUserByIdUseCase', () => {
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()

        const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

        return { getUserByIdRepository, getUserByIdUseCase }
    }

    it('should get user by id successfully', async () => {
        //arrange
        const { getUserByIdUseCase } = makeSut()

        //act
        const result = await getUserByIdUseCase.execute(faker.string.uuid())

        //assert
        expect(result).toEqual(user)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrange
        const { getUserByIdUseCase, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
        const userId = faker.string.uuid()

        //act
        await getUserByIdUseCase.execute(userId)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { getUserByIdUseCase, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = getUserByIdUseCase.execute(faker.string.uuid())

        //assert
        expect(promise).rejects.toThrow(new Error())
    })
})
