// This example shows how to make a decentralized price feed using multiple APIs


// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
// const coinMarketCapCoinId = args[0]
// const coinGeckoCoinId = args[1]
// const coinPaprikaCoinId = args[2]

const city = args[0]

if (
  secrets.apiKey == "" ||
  secrets.apiKey === "Your Weather API key (get a free one: https://coinmarketcap.com/api/)"
) {
  throw Error(
    "COINMARKETCAP_API_KEY environment variable not set for CoinMarketCap API.  Get a free key from https://coinmarketcap.com/api/"
  )
}

// build HTTP request objects

const weatherApiCall = Functions.makeHttpRequest({
  url: `http://api.weatherapi.com/v1/current.json`,
  params: {
    q: city,
    key: secrets.apiKey,
    aqi: "no",
  },
})

const weatherAPIresponse = await weatherApiCall
if (weatherAPIresponse.error) {
  console.log(weatherAPIresponse.error)
  throw Error("Request Failed")
}

const data = weatherAPIresponse["data"]
if (data.Response === "Error") {
  console.error(data.Message)
  throw Error(`Functional error. Read message: ${data.Message}`)
}

const temp_c = data["current"]["temp_c"]
const temp_f = data["current"]["temp_f"]
// return Functions.encodeUint256(Math.round(temp_c*100))

console.log(`Current Temperature in ${city} is ${temp_c} | ${temp_f}`)

const result = {
    temp_c: temp_c.toFixed(2),
    temp_f: temp_f.toFixed(2),
}


if((temp_c)>35)
{
    const tempContractAddress = "0xDb3FF6B2d345a6B90E09694c538D91Ac9d975cd0"
    
    let tempContract = await ethers.getContractAt("temp", tempContractAddress)
    
    await tempContract.addTwo(12, 35)

    const ans = await tempContract.retrieve()

    console.log(ans)
}

return Functions.encodeString(JSON.stringify(result))
