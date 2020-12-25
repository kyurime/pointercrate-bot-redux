import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from 'slash-commands';
import { delete_user } from '../../database/user';
import { shared_client } from '../../pointercrate-link';
import Subcommand from '../../utils/subcommand';

export default class UserLogoutCommand extends Subcommand {
	constructor() {
		super({
			name: "logout",
			description: "Logs out current Pointercrate user.",
			type: ApplicationCommandOptionType.SUB_COMMAND,
		})
	}

	async run_command(interaction: Interaction) {
		try {
			await delete_user(interaction.member.user.id);
		} catch (e) {
			if ("message" in e) {
				return {
					type: InteractionResponseType.CHANNEL_MESSAGE,
					data: {
						flags: MessageFlags.EPHEMERAL,
						content: `User logout failed with message \`${e.message}\`.`,
					}
				}
			} else {
				throw e;
			};
		}

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE,
			data: {
				flags: MessageFlags.EPHEMERAL,
				content: `You have been successfully logged out.`,
			}
		}
	}
}