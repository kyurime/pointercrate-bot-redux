// i'll sort out this import... eventually..?
import PointercrateClient from "pointercrate-js/build/main/lib";
const POINTERCRATE_CLIENT = new PointercrateClient({ url: process.env.POINTERCRATE_URL ?? "https://pointercrate.com/api" });

export function shared_client() {
	return POINTERCRATE_CLIENT;
}

