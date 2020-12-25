import Command from "../utils/command";
import GetDemonCommand from "./demon/get";

export default class DemonGroup extends Command {
	constructor() {
		super({
			name: "demon",
			description: "Demon related commands."
		},
		{
			subcommands: [
				new GetDemonCommand()
			],
			testing: true,
		}
		);
	}

	protected run_command: undefined;
}
