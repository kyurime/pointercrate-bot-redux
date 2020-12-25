import Command from "../utils/command";
import RecordDeleteSubcommand from "./record/delete";
import RecordEditSubcommand from "./record/edit";
import RecordGetSubcommand from "./record/get";
import RecordSubmitSubcommand from "./record/submit";

export default class RecordGroup extends Command {
	constructor() {
		super({
			name: "record",
			description: "Record related commands."
		},
			{
				subcommands: [
					new RecordEditSubcommand(),
					new RecordSubmitSubcommand(),
					new RecordDeleteSubcommand(),
					new RecordGetSubcommand(),
				],
				testing: true,
			}
		);
	}

	protected run_command: undefined;
}
