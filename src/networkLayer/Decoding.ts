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

export class DecodableObject implements Decodable {
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
