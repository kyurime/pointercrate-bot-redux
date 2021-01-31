import { ApplicationCommandOptionType } from "slash-commands";
import Subcommand from "../../utils/subcommand";
import EditDemonByIDCommand from "./id/edit";
import GetDemonByIDCommand from "./id/get";
import ListDemonByIDCommand from "./id/list";

export default class DemonByIDCommand extends Subcommand {
	constructor() {
		super(
			{
				name: "id",
				description: "Demon commands sorted by id",
				type: ApplicationCommandOptionType.SUB_COMMAND_GROUP
			},
			[
				new GetDemonByIDCommand(),
				new ListDemonByIDCommand(),
				new EditDemonByIDCommand(),
			],
			)
	}

	protected run_command: undefined;
}