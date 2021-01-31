import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../utils/subcommand";

export default class RecordDeleteSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "delete",
				description: "Delete record by id",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "id",
						description: "ID of record",
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
		if (!user) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "You must be linked to use this command!",
				}
			}
		}

		if (!user.implied_permissions.includes(Permissions.ListAdministrator)) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "You must be list admin to use this command!",
				}
			}
		}

		client.token_login_unsafe(user.token);

		const record = await client.records.from_id(id);
		await record.delete();

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				flags: MessageFlags.EPHEMERAL,
				content: `Record ${record.id} by ${record.player.name} successfully deleted!`,
			}
		}
	};
}
