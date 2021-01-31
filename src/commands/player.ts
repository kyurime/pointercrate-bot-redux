import Command from "../utils/command";
import PlayerGetSubcommand from "./player/get";
import PlayerListCommand from "./player/list";

export default class PlayerGroup extends Command {
	constructor() {
		super({
			name: "player",
			description: "Player related commands."
		},
			{
				subcommands: [
					new PlayerListCommand(),
					new PlayerGetSubcommand(),
				],
				testing: true,
			}
		);
	}

	protected run_command: undefined;
}
