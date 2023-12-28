import { OperationType } from "../../entities/Statement";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to return a statement operation", async () => {
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

    const statement = await getStatementOperationUseCase.execute({
      user_id: String(user.id),
      statement_id: String(deposit.id),
    });

    expect(statement.id).toEqual(deposit.id);
  });

  it("should not be able to return a statement if user not exists", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user_id",
        statement_id: "statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to return a statement if not exists", async () => {
    const user = await createUserUseCase.execute({
      name: "Username",
      email: "useremail@test.com",
      password: "userpassword",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: "statement_id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
