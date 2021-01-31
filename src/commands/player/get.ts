import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../utils/subcommand";

export default class PlayerGetSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "get",
				description: "Get player by id",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "id",
						description: "ID of player",
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

		const player = await client.players.from_id(id);
		const player_embed = {
			title: `Player ${player.name} (#${player.id})${player.nationality ? ` - ${player.nationality.nation}` : ''}`,
			description: `This player is currently ${player.banned ? "" : "not "}banned`
		};

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [player_embed],
			}
		}
	}
}
