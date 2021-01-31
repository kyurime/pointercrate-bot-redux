import RecordStatus from "pointercrate-js/build/main/lib/endpoints/record/recordstatus";
import { ApplicationCommandOptionType, Interaction, InteractionResponseType, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
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
				id: number, status?: RecordStatus, demon?: string,
				progress?: number, player?: string, video?: string
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

		if (!user.implied_permissions.includes(Permissions.ListHelper)) {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "You must be list helper to use this command!",
				}
			}
		}

		client.token_login_unsafe(user.token);

		const record = await client.records.from_id(id);
		await record.edit({
			status, demon, progress, player, video
		});

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `${record.player.name}'s record on ${record.demon} has been updated!`,
				flags: MessageFlags.EPHEMERAL,
			}
		}
	};
}
