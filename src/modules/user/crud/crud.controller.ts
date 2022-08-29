import { Crud, CrudController } from '@nestjsx/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthHeaders } from '@src/decorators';
import { apiTags } from '@config/api.tags';
import { crudConfig } from '@config/crud.config';
import { routes } from '@config/app.routes';
import { UserResponse } from '@modules/user/dtos/user.response';
import { UpdateUserRequest } from '@modules/user/crud/update-user.request';
import { CreateUserRequest } from '@modules/user/crud/create-user.request';
import { ReplaceUserRequest } from '@modules/user/crud/replace-user.request';
import { UserOrmEntity } from '@modules/user/repository/user.orm-entity';
import { CrudUserService } from '@modules/user/crud/crud.service';

@ApiTags(apiTags.users)
@Crud(crudConfig({
    model: {
        type: UserResponse,
    },
    dto: {
        create: CreateUserRequest,
        update: UpdateUserRequest,
        replace: ReplaceUserRequest,
    },
}))
@AuthHeaders()
@Controller(routes.users.root)
export class CrudUserController implements CrudController<UserOrmEntity> {
    constructor(readonly service: CrudUserService) {
    }
}
