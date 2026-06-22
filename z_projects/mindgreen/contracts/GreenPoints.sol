// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenPoints is ERC20, Ownable {
  constructor() ERC20("GreenPoints", "GP") Ownable(msg.sender) {}

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function redeem(address from, uint256 amount) public onlyOwner {
    _burn(from, amount);
  }
}
