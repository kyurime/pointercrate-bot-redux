import Command from "../utils/command";
import UserLogoutCommand from "./account/delete";
import UserInfoCommand from "./account/info";
import UserLoginCommand from "./account/login";

export default class UserGroup extends Command {
	constructor() {
		super({
			name: "account",
			description: "Account related commands."
		},
			{
				subcommands: [
					new UserLoginCommand(),
					new UserInfoCommand(),
					new UserLogoutCommand(),
				],
				testing: false,
			}
		);
	}

	protected run_command: undefined;
}
