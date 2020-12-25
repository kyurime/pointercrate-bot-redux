import { PartialApplicationCommand, Interaction, InteractionResponse, ApplicationCommandInteractionData, ApplicationCommandOptionValue } from "slash-commands";
import Subcommand, { SubcommandRunnable } from "./subcommand";
import { CommandError } from "./error";

export default abstract class Command {
	testing?: boolean;
	subcommands?: Subcommand[];

	constructor(
		public command: PartialApplicationCommand,
		options?: { subcommands?: Subcommand[], testing?: boolean }
	) {
		if (options?.subcommands) {
			if (!this.command.options) {
				this.command.options = [];
			}

			this.subcommands = options.subcommands;

			for (const subcommand of this.subcommands) {
				this.command.options?.push(subcommand.command);
			}
		}

		this.testing = options?.testing;
	}

	async on_command(interaction: Interaction): Promise<InteractionResponse> {
		// wrong interaction type altogether - this should never be reached
		if (!interaction.data) {
			throw new CommandError("command called from non command event");
		}

		if (!interaction.data.options) {
			// we just set a default of nothing here, gonna do the same thing anyways
			interaction.data.options = [];
		}

		const params: Record<string, ApplicationCommandOptionValue> = {};
		let runnable_command: SubcommandRunnable | undefined;

		// this is a top level command, so being here means that interaction.data.name has already been used
		// thus, we must parse args now
		for (const data of interaction.data.options) {
			if (!("value" in data)) {
				// this means we have a subcommand on our hands
				const linked_command = this.subcommands?.find((subcommand) => subcommand.command.name == data.name);
				if (!linked_command) {
					throw new CommandError("failed to find subcommand for command");
				}

				runnable_command = { command: linked_command, options: data.options };
			} else {
				params[data.name] = data.value;
			}
		}

		// there'll only be one subcommand run at a time
		if (runnable_command != undefined) {
			return runnable_command.command.on_command(interaction, runnable_command.options);
		}

		// subcommands don't need this
		if (this.run_command) {
			return this.run_command(interaction, params);
		}

		throw new CommandError("no subcommand or action found for command");
	}

	protected abstract run_command?(interaction: Interaction, data: Record<string, ApplicationCommandOptionValue>): Promise<InteractionResponse>;
}