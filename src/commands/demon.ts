import Command from "../utils/command";
import AddDemonCommand from "./demon/add";
import DemonByIDCommand from "./demon/id";

export default class DemonGroup extends Command {
	constructor() {
		super({
			name: "demon",
			description: "Demon related commands."
		},
		{
			subcommands: [
				new DemonByIDCommand(),
				new AddDemonCommand(),
			],
			testing: true,
		}
		);
	}

	protected run_command: undefined;
}
