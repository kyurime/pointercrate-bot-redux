import SubmitterListingFilters from "pointercrate-js/build/main/lib/endpoints/submitter/submitterpagination";
import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../utils/subcommand";

export default class SubmitterListSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "list",
				description: "List 10 submitters",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "page",
						description: "Page of submitter listing",
						required: false,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ page }: { page?: number }
	) {
		const client = shared_client();

		const user = await get_user(interaction.member.user.id);
		if (user && user.implied_permissions.includes(Permissions.ListAdministrator)) {
			client.token_login_unsafe(user.token);
		} else {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "You must be at least ListAdministrator to use this command!",
				}
			}
		}

		const pagination: SubmitterListingFilters = {
			limit: 10
		};

		if (page) {
			// kinda hacky way, doesn't account for deleted records or anything
			pagination.after = ((page - 1) * pagination.limit!) - 1;
		}

		const submitters = await client.submitters.list(pagination);
		const submitter_embeds = submitters.map((submitter) => {
			return {
				title: `Submitter ${submitter.id}`,
				description: `This submitter is currently ${submitter.banned ? "" : "not "}banned`
			}
		});

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: submitter_embeds,
			}
		}
	}
}
