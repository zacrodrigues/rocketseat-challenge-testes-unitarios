import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to list user profile", async () => {
    const user = {
      name: "User Name",
      email: "useremail@test.com",
      password: "userpassword",
    };

    const userCreated = await createUserUseCase.execute(user);

    const userProfile = await showUserProfileUseCase.execute(
      String(userCreated.id)
    );

    expect(userProfile).toHaveProperty("id");
    expect(userProfile.password).not.toEqual(user.password);
  });

  it("should not be able to list user profile if not exists", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("idnotexist");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
