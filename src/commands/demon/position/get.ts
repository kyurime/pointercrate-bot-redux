import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed } from "slash-commands";
import { demon_embed } from "../../../helpers/demon";
import { shared_client } from "../../../pointercrate-link";

import Subcommand from "../../../utils/subcommand";

export default class GetDemonByPositionCommand extends Subcommand {
	constructor() {
		super(
			{
				name: "get",
				description: "Get demon by position",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "position",
						description: "Position of demon",
						required: true,
					}
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ position }: { position: number }
	) {
		const client = shared_client();

		const demon = await client.demons.from_position(position);

		const embed = await demon_embed(demon);

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [embed],
			}
		}
	};
}
