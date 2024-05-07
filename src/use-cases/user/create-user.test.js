import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserUseCase } from './create-user.js'
import { faker } from '@faker-js/faker'

describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()

        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const createUserUseCase = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            createUserUseCase,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    it('should create a user successfully', async () => {
        //arrange
        const { createUserUseCase } = makeSut()

        //act
        const createdUser = await createUserUseCase.execute(user)

        //assert
        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        //arrange
        const { createUserUseCase, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        )

        //act
        const promise = createUserUseCase.execute(user)

        //assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })
})
