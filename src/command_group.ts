import { PartialApplicationCommand } from "slash-commands";
import Subcommand from "./subcommand";

export default abstract class CommandGroup {
	testing?: boolean;

	constructor(
		public command: PartialApplicationCommand,
		public commands: Subcommand[],
		{ testing }: { testing?: boolean }
	) {
		this.testing = testing;
	}
}