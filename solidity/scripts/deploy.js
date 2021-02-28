async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  //--------------------------------------------------------------------------------------------------
  // Deploy tokens contracts
  //--------------------------------------------------------------------------------------------------
  console.log("Deploying 3 new tokens");

  const Token_A = await ethers.getContractFactory("Token_A");
  const toka = await Token_A.deploy();
  await toka.deployed();

  console.log("TOKA address:", toka.address);

  const Token_B = await ethers.getContractFactory("Token_B");
  const tokb = await Token_B.deploy();
  await tokb.deployed();

  console.log("TOKB address:", tokb.address);

  const Token_C = await ethers.getContractFactory("Token_C");
  const tokc = await Token_C.deploy();
  await tokc.deployed();

  console.log("TOKC address:", tokc.address);

  //--------------------------------------------------------------------------------------------------
  // Deploy Portfolio contract 
  //--------------------------------------------------------------------------------------------------
  console.log("Deploying portfolio");

  const Portfolio = await ethers.getContractFactory("Portfolio");
  const portfolio = await Portfolio.deploy();
  await portfolio.deployed();

  console.log("Portfolio address:", portfolio.address);
  
  //--------------------------------------------------------------------------------------------------
  // We also save the contract's artifacts and address in the frontend directory
  //--------------------------------------------------------------------------------------------------
  saveFrontendFiles(portfolio);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Portfolio: token.address }, undefined, 2)
  );

  const PortfolioArtifact = artifacts.readArtifactSync("Portfolio");

  fs.writeFileSync(
    contractsDir + "/Portfolio.json",
    JSON.stringify(PortfolioArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
