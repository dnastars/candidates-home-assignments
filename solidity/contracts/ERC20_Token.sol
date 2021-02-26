pragma solidity ^0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token_A is ERC20, Ownable {
    constructor() public ERC20("Token_A", "TOKA") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }   
}

contract Token_B is ERC20, Ownable {
    constructor() public ERC20("Token_B", "TOKB") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }   
}

contract Token_C is ERC20, Ownable {
    constructor() public ERC20("Token_C", "TOKC") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }   
}