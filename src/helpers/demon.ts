import FullDemon from "pointercrate-js/build/main/lib/endpoints/demon/fulldemon";
import { Embed } from "slash-commands";
import { shared_client } from "../pointercrate-link";

import url from "url";

export async function demon_embed(demon: FullDemon) {
	const client = shared_client();
	const metadata = await client.get_metadata();

	const num_of_completions = demon.records.filter((record) => record.progress == 100).length;
	const pc_url = new URL(client.url);

	const embed: Embed = {
		title: `${demon.name} (#${demon.position})`,
		url: `${pc_url.origin}/demonlist/${demon.position}`,
		description: get_creator_string(demon),
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

	if (demon.creators.length > 2) {
		embed.fields?.unshift({
			name: "Creators",
			value: demon.creators.map((creator) => creator.name).join(", "),
		});
	}

	return embed;
}

// port from pointercrate
function get_creator_string(demon: FullDemon) {
	const publisher_name = demon.publisher.name;
	const verifier_name = demon.verifier.name;

	let creator_string = "Unknown";

	if (demon.creators.length == 1) {
		creator_string = demon.creators[0].name;
	} else if (demon.creators.length == 2) {
		creator_string = `${demon.creators[0].name} and ${demon.creators[1].name}`
	} else if (demon.creators.length > 2) {
		creator_string = `${demon.creators[0].name} and more`
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