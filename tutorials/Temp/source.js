var uint8Array = Uint8Array
var uint32Array = Uint32Array
var pow = Math.pow

var DEFAULT_STATE = new uint32Array(8)
var ROUND_CONSTANTS = []

var M = new uint32Array(64)

function getFractionalBits(n) {
  return ((n - (n | 0)) * pow(2, 32)) | 0
}

var n = 2,
  nPrime = 0
while (nPrime < 64) {
  var isPrime = true
  for (var factor = 2; factor <= n / 2; factor++) {
    if (n % factor === 0) {
      isPrime = false
    }
  }
  if (isPrime) {
    if (nPrime < 8) {
      DEFAULT_STATE[nPrime] = getFractionalBits(pow(n, 1 / 2))
    }
    ROUND_CONSTANTS[nPrime] = getFractionalBits(pow(n, 1 / 3))

    nPrime++
  }

  n++
}

var LittleEndian = !!new uint8Array(new uint32Array([1]).buffer)[0]

function convertEndian(word) {
  if (LittleEndian) {
    return (
      // byte 1 -> byte 4
      (word >>> 24) |
      // byte 2 -> byte 3
      (((word >>> 16) & 0xff) << 8) |
      // byte 3 -> byte 2
      ((word & 0xff00) << 8) |
      // byte 4 -> byte 1
      (word << 24)
    )
  } else {
    return word
  }
}

function rightRotate(word, bits) {
  return (word >>> bits) | (word << (32 - bits))
}

function sha256(data) {
  // Copy default state
  var STATE = DEFAULT_STATE.slice()

  // Caching this reduces occurrences of ".length" in minified JavaScript
  // 3 more byte savings! :D
  var legth = data.length

  // Pad data
  var bitLength = legth * 8
  var newBitLength = 512 - ((bitLength + 64) % 512) - 1 + bitLength + 65

  // "bytes" and "words" are stored BigEndian
  var bytes = new uint8Array(newBitLength / 8)
  var words = new uint32Array(bytes.buffer)

  bytes.set(data, 0)
  // Append a 1
  bytes[legth] = 0b10000000
  // Store length in BigEndian
  words[words.length - 1] = convertEndian(bitLength)

  // Loop iterator (avoid two instances of "var") -- saves 2 bytes
  var round

  // Process blocks (512 bits / 64 bytes / 16 words at a time)
  for (var block = 0; block < newBitLength / 32; block += 16) {
    var workingState = STATE.slice()

    // Rounds
    for (round = 0; round < 64; round++) {
      var MRound
      // Expand message
      if (round < 16) {
        // Convert to platform Endianness for later math
        MRound = convertEndian(words[block + round])
      } else {
        var gamma0x = M[round - 15]
        var gamma1x = M[round - 2]
        MRound =
          M[round - 7] +
          M[round - 16] +
          (rightRotate(gamma0x, 7) ^ rightRotate(gamma0x, 18) ^ (gamma0x >>> 3)) +
          (rightRotate(gamma1x, 17) ^ rightRotate(gamma1x, 19) ^ (gamma1x >>> 10))
      }

      // M array matches platform endianness
      M[round] = MRound |= 0

      // Computation
      var t1 =
        (rightRotate(workingState[4], 6) ^ rightRotate(workingState[4], 11) ^ rightRotate(workingState[4], 25)) +
        ((workingState[4] & workingState[5]) ^ (~workingState[4] & workingState[6])) +
        workingState[7] +
        MRound +
        ROUND_CONSTANTS[round]
      var t2 =
        (rightRotate(workingState[0], 2) ^ rightRotate(workingState[0], 13) ^ rightRotate(workingState[0], 22)) +
        ((workingState[0] & workingState[1]) ^ (workingState[2] & (workingState[0] ^ workingState[1])))
      for (var i = 7; i > 0; i--) {
        workingState[i] = workingState[i - 1]
      }
      workingState[0] = (t1 + t2) | 0
      workingState[4] = (workingState[4] + t1) | 0
    }

    // Update state
    for (round = 0; round < 8; round++) {
      STATE[round] = (STATE[round] + workingState[round]) | 0
    }
  }

  // Finally the state needs to be converted to BigEndian for output
  // And we want to return a Uint8Array, not a Uint32Array
  return new uint8Array(
    new uint32Array(
      STATE.map(function (val) {
        return convertEndian(val)
      })
    ).buffer
  )
}

function hmac(key, data) {
  if (key.length > 64) key = sha256(key)

  if (key.length < 64) {
    const tmp = new Uint8Array(64)
    tmp.set(key, 0)
    key = tmp
  }

  // Generate inner and outer keys
  var innerKey = new Uint8Array(64)
  var outerKey = new Uint8Array(64)
  for (var i = 0; i < 64; i++) {
    innerKey[i] = 0x36 ^ key[i]
    outerKey[i] = 0x5c ^ key[i]
  }

  // Append the innerKey
  var msg = new Uint8Array(data.length + 64)
  msg.set(innerKey, 0)
  msg.set(data, 64)

  // Has the previous message and append the outerKey
  var result = new Uint8Array(64 + 32)
  result.set(outerKey, 0)
  result.set(sha256(msg), 64)

  // Hash the previous message
  return sha256(result)
}

// Convert a string to a Uint8Array, SHA-256 it, and convert back to string
function utf8Encode(str) {
  const bytes = []

  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i)

    if (code < 0x80) {
      bytes.push(code)
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6))
      bytes.push(0x80 | (code & 0x3f))
    } else if (code < 0x10000) {
      bytes.push(0xe0 | (code >> 12))
      bytes.push(0x80 | ((code >> 6) & 0x3f))
      bytes.push(0x80 | (code & 0x3f))
    } else {
      bytes.push(0xf0 | (code >> 18))
      bytes.push(0x80 | ((code >> 12) & 0x3f))
      bytes.push(0x80 | ((code >> 6) & 0x3f))
      bytes.push(0x80 | (code & 0x3f))
    }
  }

  return new Uint8Array(bytes)
}

const encoder = {
  encode: utf8Encode,
}

function sign(inputKey, inputData) {
  const key = typeof inputKey === "string" ? encoder.encode(inputKey) : inputKey
  const data = typeof inputData === "string" ? encoder.encode(inputData) : inputData
  return hmac(key, data)
}

function hash(str) {
  return hex(sha256(encoder.encode(str)))
}

function hex(bin) {
  return bin.reduce((acc, val) => acc + ("00" + val.toString(16)).substr(-2), "")
}

const Encrypt = (salt, text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0))
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2)
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)

  return text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("")
}

const decrypt = (salt, encoded) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0))
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code)
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("")
}

const sessionId = args[0]
const veriff_Api_Key = secrets.veriff_Api_Key
const veriff_shared_secret_key = secrets.veriff_shared_secret_key
const secretSalt = args[1]
const web3_storage_token = secrets.web3_storage_token


// console.log("1 fin");
const HMACSign = await hex(sign(veriff_shared_secret_key, sessionId))

const mediaAPICall = Functions.makeHttpRequest({
  url: `https://stationapi.veriff.com/v1/sessions/${sessionId}/media`,
  headers: {
    "Content-Type": "application/json",
    "X-AUTH-CLIENT": `${veriff_Api_Key}`,
    "X-HMAC-SIGNATURE": `${HMACSign}`,
  },
})

const mediaAPIresponse = await mediaAPICall
if (mediaAPIresponse.error) {
  // console.log(veriff_Api_Key, HMACSign);
  console.log(mediaAPIresponse.error)
  throw Error("Request Failed")
}

// console.log(mediaAPIresponse);

// build HTTP request objects

const data = await mediaAPIresponse["data"]

const images = data["images"]

if (images.length == 0) {
  console.log("No images stored on the session id")
  throw Error("No images")
}

const face = images[0]
// console.log(face);
const mediaId = face["id"]
// console.log(mediaId);
const mediaHMACSign = await hex(sign(veriff_shared_secret_key, mediaId))

const faceAPICall = Functions.makeHttpRequest({
  url: `https://stationapi.veriff.com/v1/media/${mediaId}`,
  headers: {
    "Content-Type": "application/json",
    "X-AUTH-CLIENT": `${veriff_Api_Key}`,
    "X-HMAC-SIGNATURE": `${mediaHMACSign}`,
  },
})

const faceAPIResponse = await faceAPICall
if (faceAPIResponse.error) {
  console.log(faceAPIResponse.error)
  throw Error("Request Failed")
}
// console.log(faceAPIResponse["data"]);
const Resp = await faceAPIResponse["data"]

console.log(Resp.length)




return Functions.encodeString(JSON.stringify(0))
