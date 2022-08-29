import { BaseQuery, CommandProps } from '@libs/libs/base';

export class ValidateUserQuery extends BaseQuery {

  readonly email: string;

  constructor(props: CommandProps<ValidateUserQuery>) {
    super();
    this.email = props.email;
  }

}
