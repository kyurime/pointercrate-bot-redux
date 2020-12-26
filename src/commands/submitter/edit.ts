import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
import { shared_client } from "../../pointercrate-link";
import Subcommand from "../../utils/subcommand";

export default class SubmitterEditSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "edit",
				description: "Edits a submitter",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "id",
						description: "ID of submitter to edit",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.BOOLEAN,
						name: "banned",
						description: "Whether submitter is banned or not",
						required: false,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ id, banned }: { id: number, banned?: boolean }
	) {
		const client = shared_client();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: "This command is currently unimplemented!",
				flags: MessageFlags.EPHEMERAL,
			}
		}
	};
}
