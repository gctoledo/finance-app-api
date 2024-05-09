import { GetUserByIdUseCase } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
        length: 7,
    }),
}

class GetUserByIdRepositoryStub {
    async execute() {
        return user
    }
}

describe('GetUserByIdUseCase', () => {
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
})
