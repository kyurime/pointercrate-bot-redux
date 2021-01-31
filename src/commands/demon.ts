import Command from "../utils/command";
import AddDemonCommand from "./demon/add";
import DemonByIDCommand from "./demon/id";
import DemonByPositionCommand from "./demon/position";

export default class DemonGroup extends Command {
	constructor() {
		super({
			name: "demon",
			description: "Demon related commands."
		},
		{
			subcommands: [
				new DemonByIDCommand(),
				new DemonByPositionCommand(),
				new AddDemonCommand(),
			],
			testing: false,
		}
		);
	}

	protected run_command: undefined;
}
