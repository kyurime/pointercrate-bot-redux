import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from 'slash-commands';
import { create_user, get_user } from '../../database/user';
import { shared_client } from '../../pointercrate-link';
import Subcommand from '../../utils/subcommand';

export default class UserLoginCommand extends Subcommand {
	constructor() {
		super({
			name: "link",
			description: "Links to pointercrate account with provided token.",
			type: ApplicationCommandOptionType.SUB_COMMAND,
			options: [
				{
					name: "token",
					description: "Access token of user",
					required: true,
					type: ApplicationCommandOptionType.STRING,
				}
			]
		})
	}

	async run_command(interaction: Interaction, { token }: { token: string }) {
		const client = shared_client();

		const user = await get_user(interaction.member.user.id);
		if (user) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: `You are already linked - please unlink first!`,
				}
			}
		}

		// messy token validation thing
		try {
			const token_head = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString('ascii'));
			if (token_head.typ != 'JWT') {
				throw new Error("this token parsing error should never be seen");
			}
		} catch (e) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "Token is in invalid format.",
				}
			}
		}

		try {
			await client.token_login(token);
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
			await create_user(interaction.member.user.id, token,client.user?.permissions ?? 0);
		} catch (e) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: `DB entry failed with message \`${e.message}\`.`,
				}
			}
		}

		const message = `Linked with user \`${client.user?.name}\`.`;
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