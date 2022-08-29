import { BaseCommand, CommandProps } from '@libs/libs/base';

export class CustomUseCaseCommand extends BaseCommand {

  readonly name: string;
  readonly email: string;

  constructor(props: CommandProps<CustomUseCaseCommand>) {
    super(props);
    this.name = props.name;
    this.email = props.email;
  }
}
