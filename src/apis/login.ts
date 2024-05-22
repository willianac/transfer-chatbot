import fetch from "node-fetch"
import { xml2js } from "xml-js";
import { LoginResponse } from "../types/LoginResponse";

export async function login(email: string, password: string): Promise<LoginResponse> {
	const url = `https://api.moneytransmittersystem.com/mts/am/mobileApp/xpappstart.cfm?LoginName=${email}&MyPassword=${password}&lang=en&LandUnit=BOB`

	const res = await fetch(url, {
		method: "GET",

	});
	const xml = await res.text();
	const data = xml2js(xml, {compact: true});

	return data as LoginResponse;
}