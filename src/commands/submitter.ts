import Command from "../utils/command";
import SubmitterEditSubcommand from "./submitter/edit";
import SubmitterGetSubcommand from "./submitter/get";
import SubmitterListSubcommand from "./submitter/list";

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
					new SubmitterListSubcommand(),
				],
				testing: false,
			}
		);
	}

	protected run_command: undefined;
}
