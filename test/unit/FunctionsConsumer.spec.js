const { expect } = require("chai")
const { ethers } = require("hardhat")
const path = require("path")
// const { ethers } = require("ethers");
const fs = require("fs")
const { assert } = require("console")
const contractAddress = "0x9E9FF3334f50Bf2d944eB764c7DB6eaE9Bc4911d"
// const contract = new ethers.Contract(ADDRESS, ABI, signer);

describe("Temp Contract", function () {
  // it("should set the source code", async function () {
  //   let contract = await ethers.getContractAt("TestContract", contractAddress)
  //   const file = fs.readFileSync(path.resolve(`${__dirname}/../../tutorials/Temp`, "source.js")).toString()
  //   const changeSource = await contract.updateSourceCode(file)
  //   await changeSource.wait()
  // })

  // it("should map the session id with address", async function () {
  //   let contract = await ethers.getContractAt("TestContract", contractAddress);

  //   const [owner] = await ethers.getSigners();
  //   const sessionId = "4c11c01a-19fd-47d1-b301-5a6782144d72";

  //   const abc = await contract.mapSessionId(sessionId);
  //   await abc.wait();
  //   // await contract.getAddressFrmSessionId(sessionId);

  //   const data2 = await contract.getAddressFrmSessionId(sessionId);
  //   console.log(data2);
  //   expect(data2).to.equal(owner.address);
  // });

  it("should call an contract function", async function () {
    let contract = await ethers.getContractAt("TestContract", contractAddress)

    const [owner] = await ethers.getSigners()

    const sessionId = "4c11c01a-19fd-47d1-b301-5a6782144d72"
    const args = [sessionId.toString()]
    const secrets = []
    const subId = 1864
    const gasLimit = 300000

    const transferTokenTx = await contract.transferToken(args, secrets, subId, gasLimit, { gasLimit: 1000000 })

    await transferTokenTx.wait()
  })

  it("should check the relayer", async function () {
    let contract = await ethers.getContractAt("TestContract", contractAddress)
    const transferTokenTx = await contract.checkRelayer()

    // await transferTokenTx.wait()
    console.log(transferTokenTx);
  })
})
