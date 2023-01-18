import { DecodableObject } from "./Decoding"

export class NetworkBehaviour {
	static async success(response: Response): Promise<any> {
		const decodable = new DecodableObject(response)
		return await decodable.decoder()
	}

	static failure(error: any): Error {
		throw new Error(error)
	}
}
