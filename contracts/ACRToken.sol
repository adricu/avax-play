// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ACRToken is Initializable, ERC20Upgradeable {
  function initialize(
    string memory name,
    string memory symbol,
    uint256 totalSupply
  ) public initializer {
    __ERC20_init(name, symbol);
    _mint(_msgSender(), totalSupply);
  }
}
