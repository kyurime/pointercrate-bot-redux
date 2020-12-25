import Command from "../utils/command";
import UserLogoutCommand from "./user/delete";
import UserInfoCommand from "./user/info";
import UserLoginCommand from "./user/login";

export default class UserGroup extends Command {
	constructor() {
		super({
			name: "user",
			description: "User related commands."
		},
			{
				subcommands: [
					new UserLoginCommand(),
					new UserInfoCommand(),
					new UserLogoutCommand(),
				],
				testing: true,
			}
		);
	}

	protected run_command: undefined;
}
