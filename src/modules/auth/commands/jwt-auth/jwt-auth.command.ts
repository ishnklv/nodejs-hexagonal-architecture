import { BaseCommand, CommandProps } from '@libs/libs/base';

export class JwtAuthCommand extends BaseCommand {

  readonly email: string;

  constructor(props: CommandProps<JwtAuthCommand>) {
    super(props);
    this.email = props.email;
  }

}
