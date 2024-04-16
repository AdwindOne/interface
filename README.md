# Uniswap Interface


An open source interface for Uniswap -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [https://adwindone.github.io/interface](https://adwindone.github.io/interface)


## Accessing the Uniswap Interface

To access the Uniswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/Uniswap/uniswap-interface/releases/latest), 
or visit [app.uniswap.org](https://app.uniswap.org).

## Listing a token

Please see the
[@uniswap/default-token-list](https://github.com/uniswap/default-token-list) 
repository.

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```
### Publish the Project to GitHub

1. **Install gh-pages**:

```bash
   yarn add gh-pages
```

2. **Generate Frontend Code**:

```bash
   yarn build
```

3. **Modify Configuration File**: Update the homepage field in package.json to point to your GitHub Pages address:

```bash
   "homepage": "https://adwindone.github.io/interface"
```

4. **Add Deploy Script**: Add a deploy script in package.json to deploy the generated static files to GitHub Pages:

```bash
   "scripts": {
     "deploy": "gh-pages -d build"
   }
```

5. **Publish the Project to GitHub**:

```bash
   git add .
   git commit -m "Publishing to GitHub Pages with Markdown and English language"
   git push
```

6. **Deploy the Frontend Interface**:

```bash
   yarn deploy
```

After completing these steps, your page should be in Markdown style and the language should be changed to English. You can visit the link https://adwindone.github.io/interface to view the latest version of your page.

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both 
[Uniswap V2](https://uniswap.org/docs/v2/smart-contracts/factory/) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `main` branch.** 
CI checks will run against all PRs.

## Accessing Uniswap Interface V1

The Uniswap Interface supports swapping against, and migrating or removing liquidity from Uniswap V1. However,
if you would like to use Uniswap V1, the Uniswap V1 interface for mainnet and testnets is accessible via IPFS gateways 
linked from the [v1.0.0 release](https://github.com/Uniswap/uniswap-interface/releases/tag/v1.0.0).
