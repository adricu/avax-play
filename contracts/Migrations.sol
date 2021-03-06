// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

contract Migrations {
  address public owner;
  uint256 public lastCompletedMigration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setCompleted(uint256 completed) public restricted {
    lastCompletedMigration = completed;
  }
}
