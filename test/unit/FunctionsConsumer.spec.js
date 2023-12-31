const { expect } = require("chai")
const { ethers } = require("hardhat")
const path = require("path")
// const { ethers } = require("ethers");
const fs = require("fs")
const { assert } = require("console")
const ABI = [{"inputs":[{"internalType":"address","name":"oracle","type":"address"},{"internalType":"string","name":"_sourceCode","type":"string"},{"internalType":"address","name":"_relayer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"EmptyArgs","type":"error"},{"inputs":[],"name":"EmptySecrets","type":"error"},{"inputs":[],"name":"EmptySource","type":"error"},{"inputs":[],"name":"NoInlineSecrets","type":"error"},{"inputs":[],"name":"RequestIsAlreadyPending","type":"error"},{"inputs":[],"name":"RequestIsNotPending","type":"error"},{"inputs":[],"name":"SenderIsNotRegistry","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"requestId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"result","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"err","type":"bytes"}],"name":"OCRResponse","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"RequestFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"id","type":"bytes32"}],"name":"RequestSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recieverAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"TransferredCoins","type":"event"},{"inputs":[{"internalType":"address","name":"oracleAddress","type":"address"},{"internalType":"bytes32","name":"requestId","type":"bytes32"}],"name":"addSimulatedRequestId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ans","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_relayer","type":"address"}],"name":"changeRelayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"checkRelayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"enum Functions.Location","name":"codeLocation","type":"uint8"},{"internalType":"enum Functions.Location","name":"secretsLocation","type":"uint8"},{"internalType":"enum Functions.CodeLanguage","name":"language","type":"uint8"},{"internalType":"string","name":"source","type":"string"},{"internalType":"bytes","name":"secrets","type":"bytes"},{"internalType":"string[]","name":"args","type":"string[]"}],"internalType":"struct Functions.Request","name":"req","type":"tuple"},{"internalType":"uint64","name":"subscriptionId","type":"uint64"},{"internalType":"uint32","name":"gasLimit","type":"uint32"},{"internalType":"uint256","name":"gasPrice","type":"uint256"}],"name":"estimateCost","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"source","type":"string"},{"internalType":"bytes","name":"secrets","type":"bytes"},{"internalType":"string[]","name":"args","type":"string[]"},{"internalType":"uint64","name":"subscriptionId","type":"uint64"},{"internalType":"uint32","name":"gasLimit","type":"uint32"}],"name":"executeRequest","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_sessionId","type":"string"}],"name":"getAddressFrmSessionId","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDONPublicKey","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"requestId","type":"bytes32"},{"internalType":"bytes","name":"response","type":"bytes"},{"internalType":"bytes","name":"err","type":"bytes"}],"name":"handleOracleFulfillment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"latestError","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRequestId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestResponse","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_sessionId","type":"string"}],"name":"mapSessionId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"args","type":"string[]"},{"internalType":"bytes","name":"secrets","type":"bytes"},{"internalType":"uint64","name":"subscriptionId","type":"uint64"},{"internalType":"uint32","name":"gasLimit","type":"uint32"}],"name":"transferToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"oracle","type":"address"}],"name":"updateOracleAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_sourceCode","type":"string"}],"name":"updateSourceCode","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const contractAddress = "0x0b699C6D62b122531a8ABAa4245049b91AD3C13b"
// const contract = new ethers.Contract(ADDRESS, ABI, signer);

describe("Temp Contract", function () {
  // it("should set the source code", async function () {
  //   let contract = await ethers.getContractAt("TestContract", contractAddress)
  //   const file = fs.readFileSync(path.resolve(`${__dirname}/../../tutorials/Temp`, "source.js")).toString()
  //   const changeSource = await contract.updateSourceCode(file)
  //   await changeSource.wait()
  // })

  it("should map the session id with address", async function () {
    let contract = await ethers.getContractAt("TestContract", contractAddress);

    const [owner] = await ethers.getSigners();
    const sessionId = "4c11c01a-19fd-47d1-b301-5a6782144d72";

    const abc = await contract.mapSessionId(sessionId);
    await abc.wait();
    // await contract.getAddressFrmSessionId(sessionId);

    const data2 = await contract.getAddressFrmSessionId(sessionId);
    console.log(data2);
    expect(data2).to.equal(owner.address);
  });

  // it("should call an contract function", async function () {
  //   const provider = ethers.getDefaultProvider()
  //   const signer = provider.getSigner()
  //   const contract = new ethers.Contract(ADDRESS, ABI, signer);

  //   const sessionId = "4c11c01a-19fd-47d1-b301-5a6782144d72"
  //   const args = [sessionId.toString(), "00"]
  //   const secrets = "0x"
  //   const subId = 1864
  //   const gasLimit = 300000

  //   const transferTokenTx = await contract.transferToken(args, secrets, subId, gasLimit, { gasLimit: 1000000 })

  //   await transferTokenTx.wait()
  // })

  // it("should check the relayer", async function () {
  //   let contract = await ethers.getContractAt("TestContract", contractAddress)
  //   const transferTokenTx = await contract.checkRelayer()

  //   // await transferTokenTx.wait()
  //   console.log(transferTokenTx);
  // })
})
