import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from 'slash-commands';
import { get_user } from '../../database/user';
import { shared_client } from '../../pointercrate-link';
import Subcommand from '../../utils/subcommand';

export default class UserInfoCommand extends Subcommand {
	constructor() {
		super({
			name: "info",
			description: "Checks provided token of pointercrate user.",
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

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE,
			data: {
				flags: MessageFlags.EPHEMERAL,
				content: `You are currently logged in as user \`${client.user?.name}\`.`,
			}
		}
	}
}