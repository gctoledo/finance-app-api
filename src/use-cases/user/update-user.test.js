import { UpdateUserUseCase } from './update-user.js'
import { faker } from '@faker-js/faker'

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()

        const updateUserUseCase = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
            updateUserUseCase,
        }
    }

    it('should update user successfully (without email and password)', async () => {
        //arrange
        const { updateUserUseCase } = makeSut()

        //act
        const result = await updateUserUseCase.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        //assert
        expect(result).toBe(user)
    })

    it('should update user successfully (with email)', async () => {
        //arrange
        const { updateUserUseCase, getUserByEmailRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')
        const email = faker.internet.email()

        //act
        const result = await updateUserUseCase.execute(faker.string.uuid(), {
            email,
        })

        //assert
        expect(result).toBe(user)
        expect(executeSpy).toHaveBeenCalledWith(email)
    })

    it('should update user successfully (with password)', async () => {
        //arrange
        const { updateUserUseCase, passwordHasherAdapter } = makeSut()
        const executeSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const password = faker.internet.password

        //act
        const result = await updateUserUseCase.execute(faker.string.uuid(), {
            password,
        })

        //assert
        expect(result).toBe(user)
        expect(executeSpy).toHaveBeenCalledWith(password)
    })
})
