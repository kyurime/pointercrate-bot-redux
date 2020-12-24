import { InteractionResponseType, ApplicationCommandOptionType, ApplicationCommandInteractionDataOption, Embed } from "slash-commands";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../subcommand";

export default class GetDemonCommand extends Subcommand {
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
					}
				]
			},
		);
	}

	async run_command({ id }: { id: number }) {
		const client = shared_client();

		const demon = await client.demons.from_id(id);

		const embed: Embed = {
			title: `Demon ${demon.name} (#${demon.position})`,
		}

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [embed],
			}
		}
	};
}
