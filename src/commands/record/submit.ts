import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
import { shared_client } from "../../pointercrate-link";
import Subcommand from "../../utils/subcommand";

export default class RecordSubmitSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "submit",
				description: "Submits a Pointercrate record",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.STRING,
						name: "demon",
						description: "Name of demon of record",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "progress",
						description: "Progress of record",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "player",
						description: "Player name of completor of record",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "video",
						description: "Video of completion",
						required: true,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ demon, progress, player, video }:
		{ demon: string, progress: string, player: string, video: string }
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