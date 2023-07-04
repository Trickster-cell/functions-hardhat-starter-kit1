const sessionId = args[0]

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

console.log(statusCode);

if(statusCode!=9001)
{
  const err = {res: "NOT VERIFIED"};
  return Functions.encodeString(JSON.stringify(err))

}

const first_name = data["verification"]["person"]["firstName"]
const last_name = data["verification"]["person"]["lastName"]
const DOB = data["verification"]["person"]["dateOfBirth"]

const result = {
  FirstName : first_name
}


return Functions.encodeString(JSON.stringify(result))
