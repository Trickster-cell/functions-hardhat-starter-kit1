// This example shows how to make a decentralized price feed using multiple APIs


// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
// const coinMarketCapCoinId = args[0]
// const coinGeckoCoinId = args[1]
// const coinPaprikaCoinId = args[2]

const sessionId = args[0]

if (
  secrets.apiKey == "" ||
  secrets.apiKey === "Your decision API key (get a free one: https://coinmarketcap.com/api/)"
) {
  throw Error(
    "COINMARKETCAP_API_KEY environment variable not set for CoinMarketCap API.  Get a free key from https://coinmarketcap.com/api/"
  )
}

// build HTTP request objects

const decisionApiCall = Functions.makeHttpRequest({
  url: `https://stationapi.veriff.com/v1/sessions/${sessionId}/decision`,
  headers: {
    "Content-Type": "application/json",
    "X-AUTH-CLIENT": "f084cf46-a954-4da1-b908-db35d5e52bf7",
    "X-HMAC-SIGNATURE": "1cd03710ec74b4657fd8734a19b96277e00aa20b034a9abed16fbe87b0bcbed1"
  },
})

const decisionAPIresponse = await decisionApiCall
if (decisionAPIresponse.error) {
  console.log(decisionAPIresponse.error)
  throw Error("Request Failed")
}

const data = decisionAPIresponse["data"]
if (data.Response === "Error") {
  console.error(data.Message)
  throw Error(`Functional error. Read message: ${data.Message}`)
}

const statusCode = data["verification"]["code"]
// const temp_f = data["current"]["temp_f"]
// return Functions.encodeUint256(Math.round(temp_c*100))

console.log(statusCode);

if(statusCode!="9001")
{
  const err = {res: "NOT VERIFIED"};
  return Functions.encodeString(JSON.stringify(err))

}

const dataApiCall = Functions.makeHttpRequest({
  url: `https://stationapi.veriff.com/v1/sessions/${sessionId}/person`,
  headers: {
    "Content-Type": "application/json",
    "X-AUTH-CLIENT": "f084cf46-a954-4da1-b908-db35d5e52bf7",
    "X-HMAC-SIGNATURE": "1cd03710ec74b4657fd8734a19b96277e00aa20b034a9abed16fbe87b0bcbed1"
  },
})

const dataAPIresponse = await dataApiCall
if (dataAPIresponse.error) {
  console.log(dataAPIresponse.error)
  throw Error("Request Failed")
}

const data1 = dataAPIresponse["data"]
if (data1.Response === "Error") {
  console.error(data1.Message)
  throw Error(`Functional error. Read message: ${data1.Message}`)
}

const first_name = data1["person"]["firstName"]
const last_name = data1["person"]["lastName"]
const DOB = data1["person"]["dateOfBirth"]

const result = {
  FirstName : first_name,
  LastName : last_name,
  DOB : DOB
}


return Functions.encodeString(JSON.stringify(result))
