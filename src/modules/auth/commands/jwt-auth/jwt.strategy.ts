import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuardType } from '@libs/constants';
import { JwtPayload } from './jwt.payload';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ValidateUserQuery } from '@modules/user/commands/validate-user/validate-user.query';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthGuardType.Jwt) {

  constructor(private readonly commandBus: CommandBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const result = await this.commandBus.execute(new ValidateUserQuery({ email: payload.email }));
    return result.unwrap();
  }

}
