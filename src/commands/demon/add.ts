import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
import { shared_client } from "../../pointercrate-link";
import Subcommand from "../../utils/subcommand";

export default class AddDemonCommand extends Subcommand {
	constructor() {
		super(
			{
				name: "add",
				description: "Adds demon to Pointercrate",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.STRING,
						name: "name",
						description: "Name of demon",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "position",
						description: "Position of demon",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "requirement",
						description: "Required progress of demon",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "verifier",
						description: "Verifier name of demon",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "publisher",
						description: "Publisher name of demon",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "creators",
						description: "Comma separated list of creators of demon",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "video",
						description: "Verification video of demon",
						required: false,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ name, position, requirement, verifier, publisher, creators, video }:
		{ name: string, position: number, requirement: number, verifier: string,
		publisher: string, creators: string, video?: string }
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

		const creators_list = creators.split(",").map((creator_name) => creator_name.trim())

		const demon = await client.demons.add({
			name, position, requirement, verifier, publisher,
			creators: creators_list,
			video
		});

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				flags: MessageFlags.EPHEMERAL,
				content: `Demon ${demon.name} (ID: ${demon.id}) has been successfully added!`,
			}
		}
	};
}
