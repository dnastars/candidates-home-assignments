// We import Chai to use its asserting functions here.
const { expect } = require("chai");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");

describe("Portfolio contract", function () {

    describe('Deployment', function () {
        let sender; 
        let TOKA;

        beforeEach(async function () {  
            [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
            
            Portfolio = await ethers.getContractFactory("Portfolio");
            Token_A = await ethers.getContractFactory("Token_A");

            sender = await Portfolio.deploy()
            TOKA = await Token_A.deploy()

            await sender.deployed();
            await TOKA.deployed();

            let symbol = ethers.utils.formatBytes32String("TOKA") 
            await sender.add_token(symbol, TOKA.address)
        });

        it("Should add a new token", async function () {  
            let symbol = ethers.utils.formatBytes32String("TOKA") 
            let address = await sender.tokens(symbol); 
            expect(address).to.equal(TOKA.address);
        });

        it("Should remove a supported token", async function () {  
            let symbol = ethers.utils.formatBytes32String("TOKA") 
            await sender.remove_token(symbol);  
            let address = await sender.tokens(symbol);  
            expect(address).to.equal('0x0000000000000000000000000000000000000000');  
        });
    });

    describe("Transactions", function () {
        let sender, TOKA, TOKB
        let owner, addr1, addr2; 

        beforeEach(async function () {
            [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
            
            Portfolio = await ethers.getContractFactory("Portfolio");
            sender = await Portfolio.deploy();
            
            Token_A = await ethers.getContractFactory("Token_A");
            TOKA = await Token_A.deploy()

            await sender.deployed();
            await TOKA.deployed();

            let symbol = ethers.utils.formatBytes32String("TOKA") 
            await sender.add_token(symbol, TOKA.address)
        });

        it("should be able to transfer tokens to another wallet", async function () {  
            let amount = 1000;

            //Approve the Porfolio contract to spend on behalf
            await TOKA.approve(sender.address, amount);

            let symbol = ethers.utils.formatBytes32String("TOKA") 
            await sender.transfer_tokens(symbol, addr1.address, amount);  
        
            let balance = ((await TOKA.balanceOf(addr1.address)).toString());  

            expect(balance).to.equal('1000');
        });

        /*it("should be able to keep track of all previous transactions", async function () {  
            let amount = 1000;

            //Approve the Porfolio contract to spend on behalf
            await TOKA.approve(sender.address, amount);

            let symbol = ethers.utils.formatBytes32String("TOKA") 
            await sender.transfer_tokens(symbol, addr1.address, amount);  
        
            let transfers_id = (await sender.transactionIndexesToSender(owner.address));
            //let transfers_record = sender.transactions[transfers_id]

        });*/

/*        it("should be able to withdraw all contract ETH to another wallet", async function () {  
            let owner_balance = owner.balance

            await sender.withdraw_eth(addr3.address)

            let new_owner_balance = await web3.eth.getBalance(owner.address)
            let addr3_balance = await web3.eth.getBalance(addr3.address)
            
            console.log(addr3_balance)
            
            expect(new_owner_balance).to.equal("0")
            expect(addr3.balance).to.equal("10000000000000000000000")

        });*/

        it("should be able to withdraw all tokens to another wallet", async function () {  
            let symbol = ethers.utils.formatBytes32String("TOKA") 
            let amount = await TOKA.balanceOf(owner.address)

            await TOKA.approve(sender.address, amount);
            await sender.withdraw_tokens(symbol, addr2.address);

            let owner_balance = ((await TOKA.balanceOf(owner.address)).toString())
            let adr2_balance = ((await TOKA.balanceOf(addr2.address)).toString())

            expect(owner_balance).to.equal('0')
            expect(adr2_balance).to.equal(amount.toString())
        });


    });
});
