import { OperationType } from "../../entities/Statement";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "Username",
      email: "useremail@test.com",
      password: "userpassword",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Test deposit",
    });

    expect(deposit).toHaveProperty("id");
    expect(deposit.amount).toEqual(10);
    expect(deposit.description).toEqual("Test deposit");
  });

  it("should be able to create a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Username",
      email: "useremail@test.com",
      password: "userpassword",
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Test deposit",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: String(user.id),
      type: OperationType.WITHDRAW,
      amount: 5,
      description: "Test withdraw",
    });

    expect(withdraw).toHaveProperty("id");
    expect(withdraw.amount).toEqual(5);
    expect(withdraw.description).toEqual("Test withdraw");
  });

  it("should not be able to create a statement if user not exist", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user_id",
        type: OperationType.DEPOSIT,
        amount: 10,
        description: "Test deposit",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw statement if insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: "Username",
      email: "useremail@test.com",
      password: "userpassword",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: String(user.id),
        type: OperationType.WITHDRAW,
        amount: 5,
        description: "Test withdraw",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
