const request = require('request') // To make tests
const querystring = require('querystring')
const fetch = require('node-fetch')
const crypto = require('crypto')

const config = require('./config.json') // Config file

const ROOT_URL = 'https://localbitcoins.com'
const KEY = config.auth.key
const SECRET = config.auth.secret
const DEFAULT_HEADERS = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Apiauth-Key': KEY
}

// This returns a signature for a request as a Base64-encoded string
const getMessageSignature = (path, params, nonce) => {
	const postParameters = querystring.stringify(params)
	const message = nonce + KEY + path + postParameters

	return crypto
		.createHmac('sha256', SECRET)
		.update(message)
		.digest('hex')
		.toUpperCase()
}

// This returns http headers
const getHeaders = (path, params = {}) => {
	const nonce = new Date() * 1000
	const signature = getMessageSignature(path, params, nonce)

	return {
		...DEFAULT_HEADERS,
		...{ 'Apiauth-Nonce': nonce, 'Apiauth-Signature': signature }
	}
}

// Here's where the magic happends
const api = {
	get: async path => {
		const headers = getHeaders(path)
		const res = await fetch(ROOT_URL + path, { method: 'GET', headers })

		return res.json()
	}
}

// Paths
const paths = {
	PAYMENT_METHODS: '/api/payment_methods/'
}

// Test using the api method to get the payment methods.
const getPaymentMethods = async () => {
	const response = await api.get(paths.PAYMENT_METHODS)
	console.log(response)
}

getPaymentMethods()

// Testing Localbitcoins API Payment Methods
/*const payment_methods = request('https://localbitcoins.com/api/payment_methods/', function(err, res, data) {

	console.log(res.statusCode);
	if (!err && res.statusCode == 200) {
		console.log(data);
	}
});*/