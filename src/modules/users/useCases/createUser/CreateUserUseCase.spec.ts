import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "usertest@test.com",
      password: "usertest",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email", async () => {
    await createUserUseCase.execute({
      name: "User Test",
      email: "usertest@test.com",
      password: "usertest",
    });

    expect(async () => {
      await createUserUseCase.execute({
        name: "User Test",
        email: "usertest@test.com",
        password: "usertest",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
