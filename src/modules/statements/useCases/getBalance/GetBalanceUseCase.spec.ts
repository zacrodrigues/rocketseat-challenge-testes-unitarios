import { OperationType } from "../../entities/Statement";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

import { GetBalanceError } from "./GetBalanceError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to list a empty balance if not exists any operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Username",
      email: "useremail@test.com",
      password: "userpassword",
    });

    const statement = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(statement.balance).toEqual(0);
  });

  it("should be able to list a balance bigger then zero", async () => {
    const user = await createUserUseCase.execute({
      name: "Username",
      email: "useremail@test.com",
      password: "userpassword",
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 5,
      description: "Statement description",
      type: OperationType.DEPOSIT,
    });

    const statement = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(statement.balance).toEqual(5);
  });

  it("should be able to list a balance when a withdraw is created", async () => {
    const user = await createUserUseCase.execute({
      name: "Username",
      email: "useremail@test.com",
      password: "userpassword",
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 10,
      description: "Statement description",
      type: OperationType.DEPOSIT,
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 5,
      description: "Statement description",
      type: OperationType.WITHDRAW,
    });

    const statement = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(statement.balance).toEqual(5);
  });

  it("should not be able to list a balance if user not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user_not_exists",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
