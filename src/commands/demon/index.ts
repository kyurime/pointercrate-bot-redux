import Command from "../../command";
import GetDemonCommand from "./get";

export default abstract class DemonGroup extends Command {
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
}
