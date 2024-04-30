import { UpdateUserController } from './update-user.js'
import { faker } from '@faker-js/faker'

describe('UpdateUserController', () => {
    class UpdateUserUseCase {
        async execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCase()
        const updateUserController = new UpdateUserController(updateUserUseCase)

        return { updateUserController, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        },
    }

    it('should return 200 when updating user successfully', async () => {
        //arrange
        const { updateUserController } = makeSut()

        //act
        const result = await updateUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })
})
