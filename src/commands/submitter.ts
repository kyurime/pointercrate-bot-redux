import Command from "../utils/command";
import SubmitterEditSubcommand from "./submitter/edit";
import SubmitterGetSubcommand from "./submitter/get";

export default class SubmitterGroup extends Command {
	constructor() {
		super({
			name: "submitter",
			description: "Submitter related commands."
		},
			{
				subcommands: [
					new SubmitterEditSubcommand(),
					new SubmitterGetSubcommand(),
				],
				testing: true,
			}
		);
	}

	protected run_command: undefined;
}
