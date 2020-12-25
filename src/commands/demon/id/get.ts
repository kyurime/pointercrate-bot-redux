import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed } from "slash-commands";
import { demon_embed } from "../../../helpers/demon";
import { shared_client } from "../../../pointercrate-link";

import Subcommand from "../../../utils/subcommand";

export default class GetDemonByIDCommand extends Subcommand {
	constructor() {
		super(
			{
				name: "get",
				description: "Get demon by id",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "id",
						description: "ID of demon",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.BOOLEAN,
						name: "records",
						description: "Determines whether to include records or not",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.BOOLEAN,
						name: "detailed",
						description: "Provides more ids than typical",
						required: false,
					}
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ id, records, detailed }: { id: number, records?: boolean, detailed?: boolean }
	) {
		const client = shared_client();

		const demon = await client.demons.from_id(id);
		const embeds = await demon_embed(demon, records ?? false, detailed ?? false);

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: embeds,
			}
		}
	};
}
