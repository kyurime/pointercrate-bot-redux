import { Interaction, ApplicationCommandOptionValue, ApplicationCommandInteractionDataOption, ApplicationCommandOption, InteractionResponse, ApplicationCommandOptionType } from "slash-commands";
import { CommandError } from "./error";

export interface SubcommandRunnable {
	command: Subcommand;
	options: ApplicationCommandInteractionDataOption[];
}

export default abstract class Subcommand {
	command: ApplicationCommandOption;

	// while we can't nest them more than once right now, they're the same type anyways
	subcommands?: Subcommand[];

	constructor(command: ApplicationCommandOption, subcommands?: Subcommand[]) {
		this.command = command;

		if (subcommands) {
			if (this.command.type != ApplicationCommandOptionType.SUB_COMMAND_GROUP) {
				throw new Error("subcommands can only be a subcommand of a subcommand group or top level command");
			}
			this.subcommands = subcommands;

			if (!this.command.options) {
				this.command.options = [];
			}

			for (const subcommand of subcommands) {
				this.command.options.push(subcommand.command);
			}
		}

	}

	async on_command(interaction: Interaction, options: ApplicationCommandInteractionDataOption[]): Promise<InteractionResponse> {
		const params: Record<string, ApplicationCommandOptionValue> = {};
		let runnable_command: SubcommandRunnable | undefined;

		for (const data of options) {
			if (!("value" in data)) {
				const linked_command = this.subcommands?.find((subcommand) => subcommand.command.name == data.name);
				if (!linked_command) {
					throw new CommandError("failed to find subcommand for subcommand");
				}

				runnable_command = { command: linked_command, options: data.options };
			} else {
				params[data.name] = data.value;
			}
		}

		if (runnable_command != undefined) {
			return runnable_command.command.on_command(interaction, runnable_command.options);
		}

		// subcommands don't need this
		if (this.run_command) {
			return this.run_command(interaction, params);
		}

		throw new CommandError("no action found for subcommand");
	}

	protected abstract run_command?(interaction: Interaction, interaction_data?: Record<string, ApplicationCommandOptionValue>): Promise<InteractionResponse>;
}