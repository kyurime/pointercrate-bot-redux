import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
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

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: "This command is currently unimplemented!",
				flags: MessageFlags.EPHEMERAL,
			}
		}
	};
}
