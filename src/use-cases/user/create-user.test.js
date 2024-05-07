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

    it('should create a user successfully', async () => {
        //arrange

        const { createUserUseCase } = makeSut()

        //act

        const createdUser = await createUserUseCase.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        })

        //assert
        expect(createdUser).toBeTruthy()
    })
})
