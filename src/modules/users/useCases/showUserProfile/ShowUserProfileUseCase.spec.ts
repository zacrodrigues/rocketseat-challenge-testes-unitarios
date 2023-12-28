import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

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

  it("should be able to return user profile", async () => {
    const user = {
      name: "User Name",
      email: "useremail@test.com",
      password: "userpassword",
    };

    const userCreated = await createUserUseCase.execute(user);

    const userProfile = await showUserProfileUseCase.execute(
      String(userCreated.id)
    );

    console.log(userProfile);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile.password).not.toEqual(user.password);
  });
});
