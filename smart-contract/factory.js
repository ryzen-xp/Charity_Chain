import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x17a7C7B47666f432bCcC4C929eEAFbA3C054460B"

);

export default instance;

//  "0xa56CDFF7895eD493dD742E373ca9b566Eb668798"