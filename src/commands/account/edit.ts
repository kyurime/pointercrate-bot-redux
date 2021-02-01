import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from 'slash-commands';
import { get_user } from '../../database/user';
import { shared_client } from '../../pointercrate-link';
import Subcommand from '../../utils/subcommand';

export default class UserEditCommand extends Subcommand {
	constructor() {
		super({
			name: "edit",
			description: "Edits the currently linked Pointercrate account.",
			type: ApplicationCommandOptionType.SUB_COMMAND,
			options: [
				{
					name: "display_name",
					description: "New display name to set user to",
					required: false,
					type: ApplicationCommandOptionType.STRING
				},
				{
					name: "youtube_channel",
					description: "New youtube channel URL to set user to",
					required: false,
					type: ApplicationCommandOptionType.STRING
				},
				{
					name: "permissions",
					description: "New permissions to set user to",
					required: false,
					type: ApplicationCommandOptionType.INTEGER
				},
			]
		})
	}

	async run_command(interaction: Interaction,
		{ display_name, youtube_channel, permissions }:
		{ display_name?: string, youtube_channel?: string, permissions?: number }) {
		const client = shared_client();

		const user = await get_user(interaction.member.user.id);
		if (!user) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: `You are not currently logged in.`,
				}
			}
		}

		try {
			await client.token_login(user.token);
		} catch (e) {
			if ("message" in e) {
				return {
					type: InteractionResponseType.CHANNEL_MESSAGE,
					data: {
						flags: MessageFlags.EPHEMERAL,
						content: `User login failed with message \`${e.message}\`.`,
					}
				}
			} else {
				throw e;
			};
		}

		await client.edit_self({
			display_name,
			youtube_channel,
			permissions
		});

		// we do the message before to prevent leaking the token
		const message = `User \`${client.user?.name}\` edited.`;
		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE,
			data: {
				flags: MessageFlags.EPHEMERAL,
				content: message,
			}
		}
	}
}