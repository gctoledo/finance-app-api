import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserController } from './create-user.js'
import { faker } from '@faker-js/faker'
import { user } from '../../tests/index.js'

describe('CreateUserController', () => {
    class CreateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        return { createUserUseCase, createUserController }
    }

    const httpRequest = {
        body: {
            ...user,
            id: undefined,
        },
    }

    it('should return 201 when creating an user successfully', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(user)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less then 6 characters', async () => {
        // arrange
        const { createUserController } = makeSut()

        // act
        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        // arrange
        const { createUserController, createUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        // act
        await createUserController.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        // arrange
        const { createUserController, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        // arrange
        const { createUserController, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email),
        )

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })
})
