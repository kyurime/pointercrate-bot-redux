import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from 'slash-commands';
import { create_user, delete_user, get_user } from '../../database/user';
import { shared_client } from '../../pointercrate-link';
import Subcommand from '../../utils/subcommand';

export default class UserSyncCommand extends Subcommand {
	constructor() {
		super({
			name: "sync",
			description: "Syncs a linked pointercrate account.",
			type: ApplicationCommandOptionType.SUB_COMMAND,
		})
	}

	async run_command(interaction: Interaction) {
		const client = shared_client();

		const user = await get_user(interaction.member.user.id);
		if (!user) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: `You must be linked to use this command!`,
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
						content: `User linking failed with message \`${e.message}\`.`,
					}
				}
			} else {
				throw e;
			};
		}

		try {
			await delete_user(interaction.member.user.id);
			await create_user(interaction.member.user.id, client.token!!, client.user?.permissions ?? 0);
		} catch (e) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: `DB entry failed with message \`${e.message}\`.`,
				}
			}
		}

		const message = `Successfully synced with \`${client.user?.name}\`.`;
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