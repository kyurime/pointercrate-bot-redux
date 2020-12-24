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

	async run_command(data?: ApplicationCommandInteractionDataOption[]) {
		const client = shared_client();

		if (!data) {
			return { type: InteractionResponseType.ACKNOWLEDGE }
		}

		const id_option = data.find((option) => option.name == "id");

		if (!id_option || !("value" in id_option)) {
			return { type: InteractionResponseType.ACKNOWLEDGE };
		}

		const demon = await client.demons.from_id(id_option.value as number);

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
