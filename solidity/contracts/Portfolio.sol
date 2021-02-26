pragma solidity ^0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Portfolio  is Ownable, Pausable {

    // The adress of the portfolio owner  
    //address public owner;
    
    // Map token symbols to token adresses
    mapping(bytes32 => address) public tokens;

    // Map all users adress to their corresponding transfers index
    mapping(address => uint[]) public transactionIndexesToSender;  

    // Define a transfer struct
    struct Transfer {  
        address contract_;  
        address to_;  
        uint amount_;  
        bool failed_;  
    }
  
    // Table containing all the transactions 
    Transfer[] public transactions;  
    
    // To interface with the needed ERC20 token
    ERC20 public ERC20Interface;

    // Transfer events
    event TransferSuccessful(address indexed from_, address indexed to_, uint256 amount_);   
    event TransferFailed(address indexed from_, address indexed to_, uint256 amount_);

    constructor() public {
    }

    /**  
    * @dev To add a new token to the portofolio
    * @param address_ The token contract address
    **/
    function add_token(bytes32 symbol_, address address_) public onlyOwner returns (bool) {  
        
        tokens[symbol_] = address_;

        return true;  
    } 

    /**  
    * @dev To remove a new token from the portofolio
    * @param symbol_ The token symbol used for mapping to the token contract
    **/
    function remove_token(bytes32 symbol_) public onlyOwner returns (bool) {  
        require(tokens[symbol_] != address(0x0));  
  
        delete(tokens[symbol_]);
  
        return true;  
    } 

    /**  
    * @dev To tranfer ERC20 tokens to other adresses
    * @param symbol_ The token symbol used for mapping to the token contract
    * @param to_ The recipient's adress
    * @param amount_ The token amount to send
    **/
    function transfer_tokens(bytes32 symbol_, address to_, uint256 amount_) public whenNotPaused {  
        require(tokens[symbol_] != address(0x0));
        require(amount_ > 0);  
  
        address contract_ = tokens[symbol_];  
        address from_ = msg.sender;  
  
        ERC20Interface = ERC20(contract_);  
  
        uint256 transactionId;

        transactions.push(Transfer({contract_:  contract_, to_: to_, amount_: amount_, failed_: true}));

        transactionId = transactions.length;

        transactionIndexesToSender[from_].push(transactionId - 1);  
  
        if(amount_ > ERC20Interface.allowance(from_, address(this))) {  
            emit TransferFailed(from_, to_, amount_);  
            revert();  
        }  
        
        ERC20Interface.transferFrom(from_, to_, amount_);  
  
        transactions[transactionId - 1].failed_ = false;  
  
        emit TransferSuccessful(from_, to_, amount_);  
    }

    /**  
    * @dev To withdraw funds from the portfolio
    * @param beneficiary The recipient's adress to receive ETH
    **/
    function withdraw_eth(address payable beneficiary) public payable onlyOwner whenNotPaused {  
        beneficiary.transfer(address(this).balance);  
    }

    /**  
    * @dev To withdraw ERC20 tokens to other adresses
    * @param beneficiary The recipient's adress
    * @param symbol_ The token symbol used for mapping to the token contract
    **/
    function withdraw_tokens(bytes32 symbol_, address beneficiary) public whenNotPaused {  
        
        address contract_ = tokens[symbol_];

        ERC20Interface = ERC20(contract_);
        
        uint256 amount = ERC20Interface.balanceOf(msg.sender);
        
        ERC20Interface.approve(beneficiary, amount);
        
        transfer_tokens(symbol_, beneficiary, amount);
    }

}