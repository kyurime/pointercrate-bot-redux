import FullDemon from "pointercrate-js/build/main/lib/endpoints/demon/fulldemon";
import { Embed } from "slash-commands";
import { shared_client } from "../pointercrate-link";

import url from "url";

export async function demon_embed(demon: FullDemon, include_records: boolean, detailed: boolean) {
	const client = shared_client();
	const metadata = await client.get_metadata();

	const embeds: Embed[] = [];

	const num_of_completions = demon.records.filter((record) => record.progress == 100).length;
	const pc_url = new URL(client.url);

	const embed: Embed = {
		title: `${demon.name} (#${demon.position})`,
		url: `${pc_url.origin}/demonlist/${demon.position}`,
		description: get_creator_string(demon, detailed),
		fields: [
			{
				name: "Record Completion",
				value: `${num_of_completions}/${demon.records.length}`,
				inline: true,
			}
		],
		footer: {
			text: `Demon ${demon.id}`
		}
	}

	if ((demon.position ?? (metadata.list_size + 1)) <= metadata.list_size) {
		// ts is drunk
		embed.fields?.unshift({
			name: "Minimum Progress",
			value: `${demon.requirement}%`,
			inline: true,
		});
	}

	if (demon.level_id) {
		embed.fields?.unshift({
			name: "Level ID",
			value: demon.level_id.toString(),
			inline: true,
		});
	}

	embeds.push(embed);

	if (demon.creators.length > 2) {
		embeds.push({
			title: "Creators",
			description: demon.creators.map((creator) => {
				return `${creator.name}${detailed ? ` (${creator.id})` : ``}`
			}).join(", "),
		});
	}

	if (include_records) {
		embeds.push({
			title: "Records",
			fields: demon.records.map((record) => {
				return {
					name: `${record.player.name} (${record.progress}%)`,
					value: `${detailed ? `${record.id} | ` : ``}${`[Video](${record.video})` ?? "\u200b"}`,
					inline: true,
				}
			}),
		});
	}

	return embeds;
}

// port from pointercrate
function get_creator_string(demon: FullDemon, detailed: boolean) {
	const publisher_name = `${demon.publisher.name}${detailed ? ` (${demon.publisher.id})` : ""}`;
	const verifier_name = `${demon.verifier.name}${detailed ? ` (${demon.verifier.id})` : ""}`;

	let creator_string = "Unknown";

	if (demon.creators.length >= 1) {
		const first_creator_name = `${demon.creators[0].name}${detailed ? ` (${demon.creators[0].id})` : ""}`;
		creator_string = first_creator_name;

		if (demon.creators.length == 2) {
			creator_string = `${first_creator_name} and ${demon.creators[1].name}${detailed ? ` (${demon.creators[1].id})` : ""}`
		} else if (demon.creators.length > 2) {
			creator_string = `${first_creator_name} and more`
		}
	}

	let headline = "";

	if (creator_string == verifier_name && creator_string == publisher_name) {
		headline = `by ${creator_string}`;
	} else if (creator_string != verifier_name && verifier_name == publisher_name) {
		headline = `by ${creator_string}, verified and published by ${verifier_name}`
	} else if (creator_string != verifier_name && creator_string != publisher_name && publisher_name != verifier_name) {
		headline = `by ${creator_string}, published by ${publisher_name}, verified by ${verifier_name}`
	} else if (creator_string == verifier_name && creator_string != publisher_name) {
		headline = `by ${creator_string}, published by ${publisher_name}`
	} else if (creator_string == publisher_name && creator_string != verifier_name) {
		headline = `by ${creator_string}, verified by ${verifier_name}`
	} else {
		headline = `by ${creator_string}, verified by ${verifier_name}`
	}

	return headline;
}