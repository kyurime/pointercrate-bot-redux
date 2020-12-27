import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
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

		const user = await get_user(interaction.member.user.id);
		if (user && user.implied_permissions.includes(Permissions.ListModerator)) {
			client.token_login_unsafe(user.token);
		} else {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "You must be at least ListModerator to use this command!",
				}
			}
		}

		const submitter = await client.submitters.from_id(id);
		const submitter_embed = {
			title: `Submitter ${submitter.id}`,
			description: `This submitter is currently ${submitter.banned ? "" : "not "}banned`
		};

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: [submitter_embed],
			}
		}
	}

}
