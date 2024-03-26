import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "dotenv/config";

const config: HardhatUserConfig = {
    solidity: "0.8.24",

    networks: {
        hardhat: {
            forking: {
                enabled: true,
                url: "https://rpc.ankr.com/eth",
            },
        },
    },
};

export default config;
