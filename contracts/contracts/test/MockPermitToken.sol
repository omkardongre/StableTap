// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// Test stand-in for the pUSD asset precompile: 6 decimals, ERC-20 + EIP-2612 permit.
contract MockPermitToken is ERC20, ERC20Permit {
    constructor() ERC20("Portaldot USD (test)", "pUSD") ERC20Permit("Portaldot USD (test)") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
