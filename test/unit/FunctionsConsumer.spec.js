const { expect } = require("chai")
const { ethers } = require("hardhat")
const path = require("path")
const fs = require("fs");


describe("Temp Contract", function () {
  it("should call an API", async function () {
    const [owner] = await ethers.getSigners()

    const ERC20VerifierAddress = "0x4a54CC5f35A7b919eEa94419699EB8cB3C4aD6A7"

    let erc20Verifier = await ethers.getContractAt("TempContract", ERC20VerifierAddress)

    const filePath = `${__dirname}/../../tutorials/Temp/source.js`
    const fileContent = fs.readFileSync(filePath, "utf8");
    // console.log(typeof(fileContent));

    // const val = await erc20Verifier.getVolumeData();

    const val2 = await erc20Verifier.updateSourceCode(fileContent)
    console.log(val2)
    // expect(val2).to.equal(100);
    // expect(val).to.equal(100);
  })
})
