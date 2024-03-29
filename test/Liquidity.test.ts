import { ethers } from "hardhat";
import { LiquidityContract, IERC20 } from "../typechain-types";
import { expect } from "chai";

describe.only("LiquidityContract", () => {
    let liquidity: LiquidityContract,
        dai: IERC20,
        usdc: IERC20,
        user: string,
        pool: unknown;

    const DAI_WHALE = "0xe5F8086DAc91E039b1400febF0aB33ba3487F29A";
    const DAI_TOKEN = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const USDC_TOKEN = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const USDC_WHALE = "0xD6153F5af5679a75cC85D8974463545181f48772";
    const POSITION_MANAGER = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

    const POOL = "0xa63b490aa077f541c9d64bfc1cc0db2a752157b5";

    const USDC_AMOUNT = ethers.parseUnits("10", 6);
    const DAI_AMOUNT = ethers.parseUnits("10", 18);

    beforeEach(async () => {
        const daiSigner = await ethers.getImpersonatedSigner(DAI_WHALE);
        const usdcSigner = await ethers.getImpersonatedSigner(USDC_WHALE);
        const signers = await ethers.getSigners();

        await signers[0].sendTransaction({
            value: ethers.parseEther("5"),
            to: DAI_WHALE,
        });
        await signers[0].sendTransaction({
            value: ethers.parseEther("5"),
            to: USDC_WHALE,
        });

        dai = await ethers.getContractAt("IERC20", DAI_TOKEN);
        usdc = await ethers.getContractAt("IERC20", USDC_TOKEN);
        pool = await ethers.getContractAt("IUniswapV3Pool", POOL);

        // transfer tokens to our signer to make transactions
        user = signers[0].address;
        await dai.connect(daiSigner).transfer(user, DAI_AMOUNT);
        await usdc.connect(usdcSigner).transfer(user, USDC_AMOUNT);

        const s = await ethers.deployContract("LiquidityContract", [
            POSITION_MANAGER,
        ]);

        liquidity = await s.waitForDeployment();
    });

    it(".. test minting new position", async () => {
        await dai.approve(liquidity.target, DAI_AMOUNT);
        await usdc.approve(liquidity.target, USDC_AMOUNT);

        console.log(
            "USDC before mint: ",
            ethers.formatUnits(await usdc.balanceOf(user), 6)
        );
        console.log(
            "DAI before mint: ",
            ethers.formatUnits(await dai.balanceOf(user), 18)
        );

        await liquidity.mint(DAI_AMOUNT, USDC_AMOUNT);

        console.log(
            "USDC after mint: ",
            ethers.formatUnits(await usdc.balanceOf(user), 6)
        );
        console.log(
            "DAI after mint: ",
            ethers.formatUnits(await dai.balanceOf(user), 18)
        );
    });
});
