import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { DATA_SEED_USERS } from './dataSeed/dataSeedUsers';

@Injectable()
export class SeedService {

  constructor(
    private readonly usersService: UsersService,
  ){}

  async genereteSeed() {
    const res = await this.usersService.genereteSeedUsers(DATA_SEED_USERS);
    return res;
  }

}
