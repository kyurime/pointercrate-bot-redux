import PlayerListingFilters from "pointercrate-js/build/main/lib/endpoints/player/playerpagination";
import { InteractionResponseType, ApplicationCommandOptionType, Interaction, Embed, MessageFlags } from "slash-commands";
import { get_user, Permissions } from "../../database/user";
import { shared_client } from "../../pointercrate-link";

import Subcommand from "../../utils/subcommand";

export default class PlayerListSubcommand extends Subcommand {
	constructor() {
		super(
			{
				name: "list",
				description: "Lists 10 players by id",
				type: ApplicationCommandOptionType.SUB_COMMAND,
				options: [
					{
						type: ApplicationCommandOptionType.INTEGER,
						name: "page",
						description: "Page of player listing",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "name_contains",
						description: "Name of players",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.BOOLEAN,
						name: "banned",
						description: "If players are banned or not",
						required: false,
					},
					{
						type: ApplicationCommandOptionType.STRING,
						name: "nation",
						description: "Nationality of players",
						required: false,
					},
				]
			},
		);
	}

	protected async run_command(
		interaction: Interaction,
		{ page, name_contains, banned, nation }:
		{ page?: number, name_contains?: string, banned?: boolean, nation?: string }
	) {
		const client = shared_client();

		const user = await get_user(interaction.member.user.id);
		if (user && user.implied_permissions.includes(Permissions.ExtendedAccess)) {
			client.token_login_unsafe(user.token);
		} else {
			return {
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					flags: MessageFlags.EPHEMERAL,
					content: "You must have at least Extended Access to use this command!",
				}
			}
		}

		const pagination: PlayerListingFilters = {
			limit: 10,
			name_contains,
			banned,
			nation,
		};

		if (page) {
			// kinda hacky way, doesn't account for deleted records or anything
			pagination.after = ((page - 1) * pagination.limit!) - 1;
		}

		const players = await client.players.list(pagination);
		const player_embeds = players.map((player) => {
			return {
				title: `Player ${player.name} (#${player.id})${player.nationality ? ` - ${player.nationality}` : ''}`,
				description: `This player is currently ${player.banned ? "" : "not "}banned`,
			}
		});

		client.logout();

		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				embeds: player_embeds,
			}
		}
	};
}
