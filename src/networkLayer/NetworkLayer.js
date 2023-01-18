function NetworkClient(baseURL, cors = false) {
	this.baseURL = baseURL
	this.cors = cors ? 'cors' : 'no-cors'
	this.send = async (request) => {
		return await request.performRequest(this.baseURL, this.cors)
	}
}
function Decoders(response) {
	this.response = response
	this.json = () => this.response.json()
	this.xml = () => this.response.text()
}

function Decodable(response) {
	this.response = response
	this.decoder = () => {
		if (this.response.headers.get("Content-Type").includes(/json$/)) {
			return Decoders.json
		} else if (this.response.headers.get("Content-Type".includes(/xml$/))) {
			return Decoders.xml
		} else
			console.log("Response is not JSON")
	}
}

function Error(message) {
	this.message = message
}

function NetworkBehaviour() {
	this.success = response => {
		const decodable = new Decodable(response)
		return decodable.decoder()
	}
	this.failure = err => {
		return new Error(String(err))
	}
}

function NetworkRequest(endpoint, method = "GET", headers = {}, body = null) {
	this.endpoint = endpoint
	this.method = method
	this.headers = headers
	this.body = body !== null && undefined ? JSON.stringify(body) : null
	this.performRequest = async (baseURL, cors = "no-cors") => {
		return await fetch(`${baseURL}${this.endpoint}`, {
			method: this.method,
			headers: headers,
			mode: cors,
			body: body
		})
			.then(NetworkBehaviour.success)
			.catch(NetworkBehaviour.failure)
	}
}

const client = new NetworkClient("https://official-joke-api.appspot.com")
const getRequest = new NetworkRequest("/random_joke")

const joke = client.send(getRequest)

joke
	.then(response => response.json())
	.then(data => console.log(data))

	// console.log("Random joke =>", randomJoke)
