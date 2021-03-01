// We import Chai to use its asserting functions here.
const { expect } = require("chai");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");

describe("Portfolio contract", function () {

    describe('Deployment', function () {
        let portfolio; 
        let TOKA;

        beforeEach(async function () {  
            // Get all the available address on the network
            [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
            
            // Deploy Portfolio contract 
            Portfolio = await ethers.getContractFactory("Portfolio");
            portfolio = await Portfolio.deploy()
            
            // Deploy TOKA contract 
            Token_A = await ethers.getContractFactory("Token_A");
            TOKA = await Token_A.deploy()

            await portfolio.deployed();
            await TOKA.deployed();

            // Add TOKA to the portfolio
            let symbol = ethers.utils.formatBytes32String("TOKA") 
            await portfolio.add_token(symbol, TOKA.address)
        });

        it("Should add a new token", async function () {  
            let symbol = ethers.utils.formatBytes32String("TOKA") 
            let address = await portfolio.tokens(symbol); 
            
            expect(address).to.equal(TOKA.address);
        });

        it("Should remove a supported token", async function () {  
            let symbol = ethers.utils.formatBytes32String("TOKA") 
            await portfolio.remove_token(symbol);  
            let address = await portfolio.tokens(symbol);  
            
            expect(address).to.equal('0x0000000000000000000000000000000000000000');
        });

        // it("Should provide the balance", async function () {  
        //     let symbol = ethers.utils.formatBytes32String("TOKA");
            
        //     let balance = await portfolio.balanceOf(symbol);
        //     let tx = await TOKA.balanceOf(owner.address);
        // });
    });

    describe("Transactions", function () {
        let portfolio, TOKA, TOKB
        let owner, addr1, addr2; 

        beforeEach(async function () {
            // Get all the available address on the network
            [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
            
            // Deploy Portfolio contract 
            Portfolio = await ethers.getContractFactory("Portfolio");
            portfolio = await Portfolio.deploy();
            
            // Deploy TOKA contract 
            Token_A = await ethers.getContractFactory("Token_A");
            TOKA = await Token_A.deploy();

            await portfolio.deployed();
            await TOKA.deployed();

            // Add TOKA to the portfolio
            let symbol = ethers.utils.formatBytes32String("TOKA");
            await portfolio.add_token(symbol, TOKA.address);
        });

        it("should be able to transfer tokens to another wallet", async function () {  
            let amount = 1000;
            let owner_balance = parseFloat(await TOKA.balanceOf(owner.address));

            //Approve the Porfolio contract to spend on behalf of owner
            await TOKA.approve(portfolio.address, amount);

            // Send amount of TOKA to addr1
            let symbol = ethers.utils.formatBytes32String("TOKA");
            await portfolio.transfer_tokens(symbol, addr1.address, amount);  
        
            // Check the actual balance of addr1 and owner
            let addr1_balance = ((await TOKA.balanceOf(addr1.address)).toString());
            owner_balance = ((await TOKA.balanceOf(owner.address)).toString());  

            expect(addr1_balance).to.equal('1000');
            expect(owner_balance).to.equal('999999999999999999999000')
        });

        it("should be able to keep track of all previous transactions", async function () {  
            let amount = 1000;

            // Approve the Porfolio contract to spend on behalf of owner
            await TOKA.approve(portfolio.address, amount);

            // Send amount of TOKA to addr1
            let symbol = ethers.utils.formatBytes32String("TOKA");
            await portfolio.transfer_tokens(symbol, addr1.address, amount);  
            
            // I don't understand why it does not work...
            // let transfers_id = await portfolio.transactionIndexesToSender(owner.address);
            
            // Check the only transaction info
            let t = await portfolio.transactions(0);
            
            expect(t.contract_).to.equal(TOKA.address);
            expect(t.to_).to.equal(addr1.address);
            expect(t.amount_).to.equal("1000");
        });

        it("should be able to withdraw all contract ETH to another wallet", async function () {  
            
            // First send some eth to the contract address
            const tx4 = await owner.sendTransaction({to: addr3.address, value: ethers.constants.WeiPerEther});
            await tx4.wait();

            // Get the actual balances for portfolio and addr3
            let portfolio_balance = await web3.eth.getBalance(portfolio.address)
            let addr3_balance = await web3.eth.getBalance(addr3.address)

            // Send all portfolio eth to addr3
            await portfolio.withdraw_eth(addr3.address)

            // Get the new accounts balances
            let new_portfolio_balance = await web3.eth.getBalance(portfolio.address)
            let new_addr3_balance = await web3.eth.getBalance(addr3.address)
            
            // Sum to get the expected addr3 balance
            let final_amount = (parseFloat(addr3_balance)+parseFloat(portfolio_balance)).toLocaleString('fullwide', {useGrouping:false});
            
            expect(new_portfolio_balance).to.equal("0")
            expect(new_addr3_balance).to.equal(final_amount)

        });

        it("should be able to withdraw all tokens to another wallet", async function () {  
            
            // Get the actual balance of TOKA for the owner
            let symbol = ethers.utils.formatBytes32String("TOKA") 
            let amount = await TOKA.balanceOf(owner.address)

            // Approve porfolio address to spend on behalf of the owner
            await TOKA.approve(portfolio.address, amount);

            // Send all TOKA coins to addr2
            await portfolio.withdraw_tokens(symbol, addr2.address);

            // Get the actual balances for owner and adr2
            let owner_balance = ((await TOKA.balanceOf(owner.address)).toString())
            let adr2_balance = ((await TOKA.balanceOf(addr2.address)).toString())

            expect(owner_balance).to.equal('0')
            expect(adr2_balance).to.equal(amount.toString())
        });


    });
});
