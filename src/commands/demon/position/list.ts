import DemonListingFilters from "pointercrate-js/build/main/lib/endpoints/demon/demonpagination";
import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { listed_demon_embed } from "../../../helpers/demon";
import { shared_client } from "../../../pointercrate-link";

import Subcommand from "../../../utils/subcommand";

export default class ListDemonByPositionCommand extends Subcommand {
	constructor() {
		super(
			{
				name: "list",
				description: "List demon by position",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "page",
						description: "Page of demon list",
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
		{ page, detailed }: { page?: number, detailed?: boolean }
	) {
		const client = shared_client();

		const pagination: DemonListingFilters = {
			limit: 10
		};

		if (page) {
			pagination.after = ((page - 1) * pagination.limit!) - 1;
		}

		const demons = await client.demons.by_position(pagination);
		const embeds = demons.map((demon) => listed_demon_embed(demon, detailed ?? false));

		if (embeds.length >= 1) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					embeds: embeds,
				}
			}
		} else {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "There were no demons found with this set of filters!"
				}
			}
		}
	}
}
