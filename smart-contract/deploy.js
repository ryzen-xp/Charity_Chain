const provider = new HDWalletProvider(process.env.mnemonic, process.env.link);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account:", accounts[0]);

  const chainId = 10000; // Holesky chain ID

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: "0x" + compiledFactory.bytecode })
    .send({ from: accounts[0], chainId: chainId });

  console.log("Contract deployed to:", result.options.address);
};

deploy();
