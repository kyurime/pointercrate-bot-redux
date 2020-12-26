import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
import { shared_client } from "../../pointercrate-link";
import Subcommand from "../../utils/subcommand";

export default class RecordEditSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "edit",
				description: "Edits a Pointercrate record",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "id",
						description: "ID of record to edit",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "status",
						description: "Status of record",
						required: false,
						choices: [
							{
								name: "Approved",
								value: "approved"
							},
							{
								name: "Rejected",
								value: "rejected"
							},
							{
								name: "Submitted",
								value: "submitted"
							},
							{
								name: "Under Consideration",
								value: "under consideration"
							}
						],
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "demon",
						description: "Name of demon of record",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "progress",
						description: "Progress of record",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "player",
						description: "Player name of completor of record",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "video",
						description: "Video of completion",
						required: false,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ id, status, demon, progress, player, video }:
			{
				id: number, status?: string, demon?: string,
				progress?: string, player?: string, video?: string
			}
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
