import RecordListingPagination from "pointercrate-js/build/main/lib/endpoints/record/recordpagination";
import RecordStatus from "pointercrate-js/build/main/lib/endpoints/record/recordstatus";
import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { get_user } from "../../database/user";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../utils/subcommand";

export default class RecordListSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "list",
				description: "Lists 10 records by id",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "page",
						description: "Page of record listing",
						required: false,
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
		{ page, detailed, status }: { page?: number, detailed?: boolean, status?: RecordStatus }
	) {
		const client = shared_client();

		// this endpoint allows for optional authentication
		const user = await get_user(interaction.member.user.id);
		if (user) {
			client.token_login_unsafe(user.token);
		}

		try {
			const pagination: RecordListingPagination = {
				limit: 10
			};

			if (page) {
				// kinda hacky way, doesn't account for deleted records or anything
				pagination.after = ((page - 1) * pagination.limit!) - 1;
			}

			pagination.status = status ?? RecordStatus.Approved;

			const records = await client.records.list(pagination);

			if (records.length == 0) {
				return {
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						flags: MessageFlags.EPHEMERAL,
						content: "No records were found with that set of filters!"
					}
				}
			}

			const embeds = records.map((record) => {
				return {
					title: `\
${record.player.name}'s${detailed ? ` (${record.player.id})` : ""} \
${record.progress}% record on ${record.demon.name} ${detailed ? `(${record.demon.id})` : ""}`,
					description: `Currently ${record.status}`,
					url: record.video,
					footer: {
						text: `Record ${record.id}`
					}
				}
			});

			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					embeds: embeds,
				}
			}
		} catch (e) {
			if ("code" in e) {
				switch (e.code) {
					case 40100:
						return {
							type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
							data: {
								flags: MessageFlags.EPHEMERAL,
								content: "You do not have the permissions required for these filters!"
							}
						}
				}
			}
			throw e;
		}
	};
}
