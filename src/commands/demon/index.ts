import CommandGroup from "../../command_group";
import GetDemonCommand from "./get";

export default abstract class DemonGroup extends CommandGroup {
	constructor() {
		super({
			name: "demon",
			description: "Demon related commands."
		},
		[
			new GetDemonCommand()
		],
		{
			testing: true
		}
		);
	}
}
