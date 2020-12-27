import { ApplicationCommandOptionType } from "slash-commands";
import Subcommand from "../../utils/subcommand";
import GetDemonByPositionCommand from "./position/get";
import ListDemonByPositionCommand from "./position/list";

export default class DemonByPositionCommand extends Subcommand {
	constructor() {
		super(
			{
				name: "position",
				description: "Demon commands sorted by position",
				type: ApplicationCommandOptionType.SUB_COMMAND_GROUP
			},
			[
				new GetDemonByPositionCommand(),
				new ListDemonByPositionCommand(),
			],
		)
	}

	protected run_command: undefined;
}