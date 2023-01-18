import type {Method, Body, Headers, Cors} from './types'
import { NetworkBehaviour } from './NetworkBehaviour'

interface NetworkRequest {
	endpoint: String
	method: Method
	headers: Headers
	body: Body
	performRequest(baseURL: String, cors: Cors): Promise<any>
}

export class NetworkRequestObject implements NetworkRequest {
	endpoint: String
	method: Method
	headers: Headers
	body: Body

	constructor(
		endpoint: String,
		method: Method = 'GET',
		headers = {},
		body = null
	) {
		this.endpoint = endpoint
		this.method = method
		this.headers = headers
		this.body = body !== null && undefined ? JSON.stringify(body) : null
	}

	async performRequest(baseURL: String, cors: Cors = 'no-cors'): Promise<any> {
		return await fetch(`${baseURL}${this.endpoint}`, {
			method: this.method,
			headers: this.headers,
			mode: cors,
			body: this.body,
		})
			.then(NetworkBehaviour.success)
			.catch(NetworkBehaviour.failure)
	}
}
