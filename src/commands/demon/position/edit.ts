import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../../database/user";
import { shared_client } from "../../../pointercrate-link";
import Subcommand from "../../../utils/subcommand";

export default class EditDemonByPositionCommand extends Subcommand {
	constructor() {
		super(
			{
				name: "edit",
				description: "Edits a Demon",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "current_position",
						description: "Position of demon to edit",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "name",
						description: "New name of demon",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "position",
						description: "New position of demon",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "video",
						description: "New video of demon",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "requirement",
						description: "New requirement of demon",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "verifier",
						description: "New verifier of demon",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "publisher",
						description: "New publisher of demon",
						required: false,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ current_position, name, position, video, requirement, verifier, publisher }:
			{
				current_position: number, name?: string, position?: number,
				video?: string, requirement?: number, verifier?: string,
				publisher?: string
			}
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
					content: "You must be list moderator to use this command!",
				}
			}
		}

		client.token_login_unsafe(user.token);

		const demon = await client.demons.from_position(current_position);

		await demon.edit({
			name, position, video, requirement, verifier, publisher
		});

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Demon ${demon.name} (${demon.id}) has been edited!`,
				flags: MessageFlags.EPHEMERAL,
			}
		}
	};
}
