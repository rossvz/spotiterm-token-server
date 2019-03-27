import { JsonController, OnNull, Param, Post, Put } from "routing-controllers";
import { getConnectionManager, Repository } from "typeorm";
import { EntityFromBody } from "typeorm-routing-controllers-extensions";
import { User } from "../entity/User";
import Cryptr = require("cryptr");

@JsonController()
export class UserController {
  private repo: Repository<User>;
  constructor() {
    this.repo = getConnectionManager()
      .get()
      .getRepository(User);
  }

  @OnNull(400)
  @Post("/login")
  async login(@EntityFromBody() credentials: User) {
    const user =
      (await this.repo.findOne(credentials)) ||
      (await this.repo.save(this.repo.create(credentials)));
    return {
      user,
      meta: new Cryptr(user.machineId).encrypt(process.env.SPOTITERM_SECRET)
    };
  }

  @Put("/users/:id")
  async update(@Param("id") id: number, @EntityFromBody() user: User) {
    await this.repo.update(id, user);
    return user;
  }

  @Post("/users")
  create(@EntityFromBody() user: User) {
    return this.repo.save(user);
  }
}
