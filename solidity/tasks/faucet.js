const fs = require("fs");
require("@nomiclabs/hardhat-ethers");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Portfolio)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const Portfolio = await ethers.getContractAt("Portfolio", address.Portfolio);
    const [owner] = await ethers.getSigners();
    
    console.log(`Transferred Portfolio ownership to ${receiver}`);
    await Portfolio.transferOwnership(receiver)

    const tx4 = await owner.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx4.wait();

    console.log(`Transferred 1 ETH to ${receiver}`);
  });
