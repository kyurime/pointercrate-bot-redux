import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from 'slash-commands';
import { shared_client } from '../pointercrate-link';
import Command from '../utils/command';

export default class LoginCommand extends Command {
	constructor() {
		super({
			name: "login",
			description: "Logs into pointercrate with provided token.",
			options: [
				{
					name: "token",
					description: "Access token of user",
					required: true,
					type: ApplicationCommandOptionType.STRING,
				}
			]
		},
		{
			testing: true
		});
	}

	async run_command(interaction: Interaction, { token }: { token: string }) {
		const client = shared_client();

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
						content: `User login failed with message \`${e.message}\`.`,
					}
				}
			} else {
				throw e;
			};
		}

		// TODO: db code

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE,
			data: {
				flags: MessageFlags.EPHEMERAL,
				content: `Successfully logged into user ${client.user?.name}.`,
			}
		}
	}
}