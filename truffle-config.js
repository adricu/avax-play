/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const {INFURA_API_KEY, INFURA_API_SECRET, MNEMONIC, PRIVATE_KEY, ETHERSCAN_API_KEY, POLIGONSCAN_API_KEY} = process.env;

const getEthereumWallet = (network) => {
  return getWallet(`wss://:${INFURA_API_SECRET}@${network}.infura.io/ws/v3/${INFURA_API_KEY}`);
};

const getWallet = (url) => {
  return new HDWalletProvider(MNEMONIC || [PRIVATE_KEY], url);
};

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*" // Any network (default: none)
    },
    live: {
      networkCheckTimeout: 10000,
      provider: () => {
        return getEthereumWallet("mainnet");
      },
      addressIndex: 0,
      network_id: 1, // Mainnet's id
      maxFeePerGas: 150 * 1e9,
      maxPriorityFeePerGas: 2 * 1e9,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      websocket: true,
      production: true // Treats this network as if it was a public net. (default: false)
    },
    ropsten: {
      networkCheckTimeout: 90000,
      provider: () => {
        return getEthereumWallet("ropsten");
      },
      addressIndex: 0,
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      maxFeePerGas: 50 * 1e9,
      maxPriorityFeePerGas: 2 * 1e9,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 2000,
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
      websocket: true
    },
    rinkeby: {
      networkCheckTimeout: 10000,
      provider: () => {
        return getEthereumWallet("rinkeby");
      },
      addressIndex: 0,
      network_id: 4,
      gas: 5500000,
      maxFeePerGas: 3 * 1e9,
      maxPriorityFeePerGas: 2 * 1e9,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 2000,
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
      websocket: true
    },
    goerli: {
      networkCheckTimeout: 10000,
      provider: () => {
        return getEthereumWallet("goerli");
      },
      addressIndex: 0,
      network_id: 5,
      gas: 5500000,
      maxFeePerGas: 3 * 1e9,
      maxPriorityFeePerGas: 2 * 1e9,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 2000,
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
      websocket: true
    },
    polygon: {
      networkCheckTimeout: 10000,
      provider: () => {
        // https://docs.polygon.technology/docs/develop/network-details/network/
        return getWallet("https://polygon-rpc.com/");
      },
      addressIndex: 0,
      network_id: 137,
      gas: 5500000,
      maxFeePerGas: 600 * 1e9,
      maxPriorityFeePerGas: 200 * 1e9,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 2000,
      skipDryRun: true // Skip dry run before migrations? (default: false for public nets )
      // websocket: true
    },
    mumbai: {
      networkCheckTimeout: 10000,
      provider: () => {
        // https://docs.polygon.technology/docs/develop/network-details/network/
        return getWallet("https://matic-mumbai.chainstacklabs.com");
        // return getWallet("wss://rpc-mumbai.maticvigil.com/ws");
        // return getWallet("wss://rpc-mumbai.matic.today");
        // return getWallet("https://rpc-mumbai.maticvigil.com");
      },
      addressIndex: 0,
      network_id: 80001,
      gas: 5500000,
      maxFeePerGas: 3 * 1e9,
      maxPriorityFeePerGas: 2 * 1e9,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 2000,
      skipDryRun: true // Skip dry run before migrations? (default: false for public nets )
      // websocket: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 10000
  },

  compilers: {
    solc: {
      version: "0.8.11",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },

  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
    polygonscan: POLIGONSCAN_API_KEY
  },
  plugins: ["truffle-plugin-verify", "solidity-coverage"]
};
