import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { get_user } from "../../database/user";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../utils/subcommand";

export default class RecordGetSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "get",
				description: "Get record by id",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "id",
						description: "ID of record",
						required: true,
					},
					{
						type: ApplicationCommandOptionType.BOOLEAN,
						name: "detailed",
						description: "Return more detailed record information",
						required: false,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ id, detailed }: { id: number, detailed?: boolean }
	) {
		const client = shared_client();

		// this endpoint allows for optional authentication
		const user = await get_user(interaction.member.user.id);
		if (user) {
			client.token_login_unsafe(user.token);
		}

		const record = await client.records.from_id(id);

		const embeds = [];

		embeds.push({
			title: `\
${record.player.name}'s${detailed ? ` (${record.player.id})` : ""} \
${record.progress}% record on ${record.demon.name} ${detailed ? `(${record.demon.id})` : ""}`,
			description: `Currently ${record.status}`,
			url: record.video,
			footer: {
				text: `Record ${record.id}`
			}
		});

		if (record.notes && record.notes.length > 0) {
			embeds.push({
				title: "Record Notes",
				fields: record.notes.map((note) => {
					return {
						name: (note.author ?? "Submitter") + (detailed ? ` (${note.id})` : ""),
						value: note.content,
					}
				})
			});
		}

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: embeds,
			}
		}
	};
}
