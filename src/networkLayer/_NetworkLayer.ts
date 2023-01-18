import type { Cors, Method, Headers, Body } from './types'

interface NetworkClient {
	baseURL: String
	cors: Cors
	send(request: NetworkRequestObject): Promise<any>
}

class NetworkClientObject implements NetworkClient {
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

class Decoder {
	static json(response: Response) {
		return response.json()
	}
	static xml(response: Response) {
		return response.text()
	}
}

interface Decodable {
	response: Response
	decoder(): Promise<any>
}

class DecodableObject implements Decodable {
	response: Response
	constructor(response: Response) {
		this.response = response
	}

	async decoder(): Promise<any> {
		const contentType = this.response.headers.get('Content-Type')
		if (contentType) {
			if (contentType.includes('/json')) {
				return await Decoder.json(this.response)
			} else if (contentType.endsWith('xml')) {
				return await Decoder.xml(this.response)
			}
		}

		return Promise.reject(
			new Error('Promise Rejected: Content-Type not JSON nor XML')
		)
	}
}

// interface NetworkBehaviour {
// 	success(response: Response): Promise<any>
// 	failure(error: any): Error
// }

class NetworkBehaviour {
	static async success(response: Response): Promise<any> {
		const decodable = new DecodableObject(response)
		return await decodable.decoder()
	}

	static failure(error: any): Error {
		throw new Error(error)
	}
}

interface NetworkRequest {
	endpoint: String
	method: Method
	headers: Headers
	body: Body
	performRequest(baseURL: String, cors: Cors): Promise<any>
}

class NetworkRequestObject implements NetworkRequest {
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

const client = new NetworkClientObject('https://official-joke-api.appspot.com')
const getRequest = new NetworkRequestObject('/random_joke')

const joke = client.send(getRequest)

joke.then((response) => console.log(response))
