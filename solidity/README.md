# Amun solidity/vyper engineer task

An exercise in implementing smart contract logic

## How to use it:

- `$ npm install`

This repo uses [hardhat](https://hardhat.org/). Feel free to use it to as template for your task.

1. Fork this repo
2. Work on one of the tasks
3. Create a pull request and add Amun engineers as reviewers

Tasks (Choose one):

A. Create a ERC20 tokens smart contract portfolio

- User is able to add, remove, show list of tokens with their balances
- Be able to transfer tokens for the user from the portifolio smart contract
- Bonus: emergency withdraw all tokens

SOLUTION:

1) Test:  
-`$ npx hardhat compile`
-`$ npx hardhat test`
The test can be found in the test folder. It creates 3 coins TOKA TOKB TOKC ERC20 and one portfolio contract. Then, it tests the functions of the ERC20 and Porfolio contract.

2)  Deploy Hardhat's testing network:
- `$ npx hardhat node`
- `$ npx hardhat run scripts/deploy.js --network localhost`
Then open a browser with Metamask extension installed. Connect to Network localhost 8545. Copy your wallet address.
- `$ npx hardhat --network localhost faucet 0xYOUR_ADDRESS` You will receive 1 ETH for futures transaction fees + the Portfolio ownership.
Move to frontend folder
- `$ npm install`
- `$ npm start`
Go to http://localhost:3000/ and try the interface (not finished)

B. Build a token fund.

This fund works as following.

- When a user deposits USDC or USDT to this fund it gets the user 50% of LINK and 50% of WETH.

- When user withdraws from the fund there is a 10% fee on the profit the fund made for them. Otherwise there is no fee.

- Bonus: Connect the smart contract you create at least to two Dexes, for example Uniswap or Kyber, so as to get the best price when coverting stable coin to LINK or WETH.
