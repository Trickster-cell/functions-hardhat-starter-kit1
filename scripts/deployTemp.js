async function main() {
    const verifierContract = "temp";
  
    const ERC20Verifier = await ethers.getContractFactory(verifierContract);
    const erc20Verifier = await ERC20Verifier.deploy();
  
    await erc20Verifier.deployed();
    console.log(verifierContract, " contract address:", erc20Verifier.address);
  }
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  