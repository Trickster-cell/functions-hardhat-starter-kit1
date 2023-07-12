const fs = require("fs")
const path = require("path")

// Loads environment variables from .env.enc file (if it exists)
require("@chainlink/env-enc").config()

const Location = {
  Inline: 0,
  Remote: 1,
}

const CodeLanguage = {
  JavaScript: 0,
}

const ReturnType = {
  uint: "uint256",
  uint256: "uint256",
  int: "int256",
  int256: "int256",
  string: "string",
  bytes: "Buffer",
  Buffer: "Buffer",
}

// Configure the request by setting the fields below
const requestConfig = {
  // location of source code (only Inline is curently supported)
  codeLocation: Location.Inline,
  // code language (only JavaScript is currently supported)
  codeLanguage: CodeLanguage.JavaScript,
  // string containing the source code to be executed
  source: fs.readFileSync(path.resolve(__dirname, "source.js")).toString(),
  // secrets can be accessed within the source code with `secrets.varName` (ie: secrets.apiKey)
  secrets: { veriff_Api_Key: process.env.VERIFF_API_KEY, veriff_shared_secret_key: process.env.VERIFF_SECRET_SHARED_KEY },
  // ETH wallet key used to sign secrets so they cannot be accessed by a 3rd party
  walletPrivateKey: process.env["PRIVATE_KEY"],
  // args can be accessed within the source code with `args[index]` (ie: args[0])
  args: ["ae3e9b4c-a851-4fab-b02c-df9e9170af2c"],
  // expected type of the returned value
  expectedReturnType: ReturnType.string,
}

module.exports = requestConfig
