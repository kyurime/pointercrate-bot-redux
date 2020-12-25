export class CommandError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "CommandError";
	}
}