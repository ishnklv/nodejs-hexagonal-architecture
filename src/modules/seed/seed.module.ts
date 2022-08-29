import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { UserModule } from '@src/modules';
import { UserRepositoryInterface } from '@modules/user/repository/user.repository.interface';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

@Module({
  imports: [
    UserModule,
  ],
})
export class SeedModule implements OnApplicationBootstrap {

  constructor(readonly userRepo: UserRepositoryInterface) {
  }

  async onApplicationBootstrap(): Promise<void> {
    if (!process.env.INIT_USER_EMAIL) {
      return;
    }
    const adminUser = await this.userRepo.findOne({
      email: process.env.INIT_USER_EMAIL,
    });
    if (!adminUser) {
      await this.userRepo.saveOne(UserEntity.create({
        name: process.env.INIT_USER_NAME,
        email: process.env.INIT_USER_EMAIL,
      }));
    }
  }

}
