import Command from "../utils/command";
import UserLogoutCommand from "./account/delete";
import UserEditCommand from "./account/edit";
import UserInfoCommand from "./account/info";
import UserLoginCommand from "./account/login";
import UserSyncCommand from "./account/sync";

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
					new UserSyncCommand(),
					new UserEditCommand(),
				],
				testing: false,
			}
		);
	}

	protected run_command: undefined;
}
