import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../utils/subcommand";

export default class SubmitterGetSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "get",
				description: "Get submitter by id",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "id",
						description: "ID of submitter",
						required: true,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ id }: { id: number }
	) {
		const client = shared_client();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				flags: MessageFlags.EPHEMERAL,
				content: "This endpoint is currently unimplemented!",
			}
		}
	};
}
