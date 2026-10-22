import { configVariable, defineConfig } from "hardhat/config";
import hardhatViem from "@nomicfoundation/hardhat-viem";
import hardhatNodeTestRunner from "@nomicfoundation/hardhat-node-test-runner";
import hardhatViemAssertions from "@nomicfoundation/hardhat-viem-assertions";
import hardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";

export default defineConfig({
  plugins: [hardhatViem, hardhatNodeTestRunner, hardhatViemAssertions, hardhatNetworkHelpers],
  solidity: {
    version: "0.8.28",
    settings: {
      // Size matters more than call gas here: pallet-revive reserves a deposit per byte of code.
      optimizer: { enabled: true, runs: 1 },
      viaIR: true,
      // Portaldot's REVM backend runs standard EVM bytecode; cancun matches other deployments on V3.
      evmVersion: "cancun",
    },
  },
  networks: {
    portaldotTestnet: {
      type: "http",
      chainType: "l1",
      url: "https://test-evm-rpc-v3.portaldot.dev",
      chainId: 420420777,
      // Read from the environment at use time only (see .env.example); never stored in the repo.
      accounts: [configVariable("PORTALDOT_EVM_PRIVATE_KEY")],
    },
  },
});
