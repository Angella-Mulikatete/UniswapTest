import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main(){

    //swapping USDC for Eth
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    //amountOut, amountInMax
    const amountInMax = ethers.parseUnits("4000",6);
    const amountOut = ethers.parseUnits("1", 18);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const ETH_Contract = await ethers.getContractAt("IERC20", WETH);
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    await USDC_Contract.approve(ROUTER, amountInMax);


    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const ethBal = await ethers.provider.getBalance(impersonatedSigner.address)
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before swap", Number(usdcBal));
    console.log("eth balance before swap", Number(ethBal));

    await ROUTER.swapTokensForExactETH(
        amountOut,
        amountInMax,
        [USDC, WETH],
        impersonatedSigner.address,
        deadline
    );
    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const ethBalAfter = await ethers.provider.getBalance(impersonatedSigner.address);

    console.log("=========================================================");

    console.log("usdc balance after swap", Number(usdcBalAfter));
    console.log("eth balance after swap", Number(ethBalAfter));


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});