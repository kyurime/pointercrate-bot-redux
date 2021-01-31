import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
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

		if (!user.implied_permissions.includes(Permissions.ListModerator)) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "You must be list helper to use this command!",
				}
			}
		}
		client.token_login_unsafe(user.token);

		const submitter = await client.submitters.from_id(id);
		await submitter.edit({ banned });

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Submitter #${submitter.id} is now ${submitter.banned ? "banned" : "not banned" }...`,
				flags: MessageFlags.EPHEMERAL,
			}
		}
	};
}
