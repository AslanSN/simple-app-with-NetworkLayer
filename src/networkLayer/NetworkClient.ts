import type { Cors } from "./types"
import type { NetworkRequestObject } from "./NetworkRequest"

interface NetworkClient {
	baseURL: String
	cors: Cors
	send(request: NetworkRequestObject): Promise<any>
}

export class NetworkClientObject implements NetworkClient {
	baseURL: String
	cors: Cors
	constructor(baseURL: String, cors = false) {
		this.baseURL = baseURL
		this.cors = cors ? 'cors' : 'no-cors'
	}

	async send(request: NetworkRequestObject): Promise<any> {
		return await request.performRequest(this.baseURL, this.cors)
	}
}
