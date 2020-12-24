import { ApplicationCommandInteractionDataOption, ApplicationCommandOption, InteractionResponse } from "slash-commands";

export default abstract class Subcommand {
	command: ApplicationCommandOption;

	constructor(command: ApplicationCommandOption) {
		this.command = command;
	}

	abstract run_command(interaction_data?: ApplicationCommandInteractionDataOption[]): Promise<InteractionResponse>;
}