const provider = new WalletConnect.UniversalProvider({
  projectId: "28f3dd90094536ee0e4ae65cad0c4de2", // Replace with your WalletConnect projectId from cloud.walletconnect.com
  metadata: { name: "Base Utility Hub", description: "Utility DApp on Base", url: window.location.origin, icons: [] }
});

const contracts = {
  TipJar: {
    address: "0x3A683D04B4ebA7a123699b0De74B0f1cF7c909Be",
    abi: [{"inputs":[{"internalType":"address payable","name":"_recipient","type":"address"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  },
  Faucet: {
    address: "0xa9749370eeE8b8a07ea6B9dEE9613465706322aF",
    abi: [{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  },
  Raffle: {
    address: "0x2fc19C9cD545EF178B30A41D17516382133E6f88",
    abi: [{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"enterRaffle","outputs":[],"stateMutability":"payable","type":"function"}]
  },
  DeadMansSwitch: {
    address: "0x34696e5CfC8D02376fF68CA2cDD55Fcb7ac8062A",
    abi: [{"inputs":[{"internalType":"address","name":"_beneficiary","type":"address"}],"name":"setBeneficiary","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  },
  MultiSig: {
    address: "0xE2Da7787FA45E95f2A8B5aF907Df2601d73cC865",
    abi: [{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"submitTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  },
  Staking: {
    address: "0x44976C5BEFf3974d5cbF76eFb523B6EE028bbDA0",
    abi: [{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  },
  Vault: {
    address: "0xE8C08F76961A7c32B27515FfcBb1b2f631be6B3c",
    abi: [{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"}]
  },
  Auction: {
    address: "0x449311E71bC911e30aE528d54AD379f91c0D7b16",
    abi: [{"inputs":[{"internalType":"uint256","name":"_bidAmount","type":"uint256"}],"name":"bid","outputs":[],"stateMutability":"payable","type":"function"}]
  },
  Splitter: {
    address: "0xA9849750d46702Dfb44599e1D6a8747D7E67deAE",
    abi: [{"inputs":[{"internalType":"address[]","name":"_recipients","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"split","outputs":[],"stateMutability":"payable","type":"function"}]
  },
  SimpleDEX: {
    address: "0xD9B49a740C9B43c58da671183d268625Cc88997A",
    abi: [{"inputs":[{"internalType":"uint256","name":"_amountIn","type":"uint256"}],"name":"swap","outputs":[],"stateMutability":"payable","type":"function"}]
  },
  TimelockVault: {
    address: "0xF8EaA1664406Ae596cFc3559FeF58c9760e0Ed35",
    abi: [{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_releaseTime","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"payable","type":"function"}]
  },
  BatchSender: {
    address: "0x07b780Fab0CaDC91c3B788C120F3A3374bCca431",
    abi: [{"inputs":[{"internalType":"address[]","name":"_recipients","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"batchSend","outputs":[],"stateMutability":"payable","type":"function"}]
  }
};

let ethersProvider;

async function initWalletConnect() {
  try {
    await provider.init();
    await provider.connect({
      chains: [8453],
      optionalNamespaces: {
        eip155: {
          chains: ["eip155:8453"],
          methods: ["eth_sendTransaction", "personal_sign"],
          events: ["chainChanged", "accountsChanged"]
        }
      }
    });
    ethersProvider = new ethers.providers.Web3Provider(provider);
    const accounts = await ethersProvider.listAccounts();
    document.getElementById("connect-wallet").innerText = "Connected";
    document.getElementById("wallet-address").innerText = `Wallet: ${accounts[0]}`;
  } catch (error) {
    console.error("WalletConnect error:", error);
    alert("Connection failed: " + error.message);
  }
}

document.getElementById("connect-wallet").onclick = initWalletConnect;

function showForm(contractName, address) {
  if (!ethersProvider) return alert("Connect wallet first!");
  const form = document.getElementById("contract-form");
  form.innerHTML = "";
  switch (contractName) {
    case "TipJar":
      form.innerHTML = `<input id="amount" placeholder="Amount (ETH)" type="number" step="0.01"><button onclick="callContract('TipJar')">Send Tip</button>`;
      break;
    case "Faucet":
      form.innerHTML = `<button onclick="callContract('Faucet')">Claim Tokens</button>`;
      break;
    case "Raffle":
      form.innerHTML = `<input id="amount" placeholder="Amount (ETH)" type="number" step="0.01"><button onclick="callContract('Raffle')">Enter Raffle</button>`;
      break;
    case "DeadMansSwitch":
      form.innerHTML = `<input id="beneficiary" placeholder="Beneficiary Address"><button onclick="callContract('DeadMansSwitch')">Set Beneficiary</button>`;
      break;
    case "MultiSig":
      form.innerHTML = `<input id="to" placeholder="To Address"><input id="value" placeholder="Value (ETH)" type="number" step="0.01"><input id="data" placeholder="Data (hex)"><button onclick="callContract('MultiSig')">Submit Tx</button>`;
      break;
    case "Staking":
      form.innerHTML = `<input id="amount" placeholder="Amount to Stake" type="number"><button onclick="callContract('Staking')">Stake</button>`;
      break;
    case "Vault":
      form.innerHTML = `<input id="amount" placeholder="Amount (ETH)" type="number" step="0.01"><button onclick="callContract('Vault')">Deposit</button>`;
      break;
    case "Auction":
      form.innerHTML = `<input id="amount" placeholder="Bid Amount (ETH)" type="number" step="0.01"><button onclick="callContract('Auction')">Bid</button>`;
      break;
    case "Splitter":
      form.innerHTML = `<input id="recipients" placeholder="Addresses (comma-separated)"><input id="amounts" placeholder="Amounts (comma-separated)"><button onclick="callContract('Splitter')">Split</button>`;
      break;
    case "SimpleDEX":
      form.innerHTML = `<input id="amount" placeholder="Amount In (ETH)" type="number" step="0.01"><button onclick="callContract('SimpleDEX')">Swap</button>`;
      break;
    case "TimelockVault":
      form.innerHTML = `<input id="amount" placeholder="Amount (ETH)" type="number" step="0.01"><input id="releaseTime" placeholder="Release Time (Unix)" type="number"><button onclick="callContract('TimelockVault')">Lock</button>`;
      break;
    case "BatchSender":
      form.innerHTML = `<input id="recipients" placeholder="Addresses (comma-separated)"><input id="amounts" placeholder="Amounts (comma-separated)"><button onclick="callContract('BatchSender')">Batch Send</button>`;
      break;
  }
  document.getElementById("form-modal").style.display = "block";
}

async function callContract(contractName) {
  if (!ethersProvider) return alert("Connect wallet first!");
  try {
    const signer = ethersProvider.getSigner();
    const contract = new ethers.Contract(contracts[contractName].address, contracts[contractName].abi, signer);
    let tx;
    switch (contractName) {
      case "TipJar":
        const tipAmount = document.getElementById("amount").value;
        tx = await contract.deposit({ value: ethers.utils.parseEther(tipAmount) });
        break;
      case "Faucet":
        tx = await contract.claim();
        break;
      case "Raffle":
        const raffleAmount = document.getElementById("amount").value;
        tx = await contract.enterRaffle(ethers.utils.parseEther(raffleAmount), { value: ethers.utils.parseEther(raffleAmount) });
        break;
      case "DeadMansSwitch":
        const beneficiary = document.getElementById("beneficiary").value;
        tx = await contract.setBeneficiary(beneficiary);
        break;
      case "MultiSig":
        const to = document.getElementById("to").value;
        const value = document.getElementById("value").value;
        const data = document.getElementById("data").value || "0x";
        tx = await contract.submitTransaction(to, ethers.utils.parseEther(value), data);
        break;
      case "Staking":
        const stakeAmount = document.getElementById("amount").value;
        tx = await contract.stake(stakeAmount);
        break;
      case "Vault":
        const vaultAmount = document.getElementById("amount").value;
        tx = await contract.deposit(ethers.utils.parseEther(vaultAmount), { value: ethers.utils.parseEther(vaultAmount) });
        break;
      case "Auction":
        const bidAmount = document.getElementById("amount").value;
        tx = await contract.bid(ethers.utils.parseEther(bidAmount), { value: ethers.utils.parseEther(bidAmount) });
        break;
      case "Splitter":
        const recipients = document.getElementById("recipients").value.split(",").map(r => r.trim());
        const amounts = document.getElementById("amounts").value.split(",").map(a => ethers.utils.parseEther(a.trim()));
        tx = await contract.split(recipients, amounts, { value: amounts.reduce((a, b) => a.add(b), ethers.BigNumber.from(0)) });
        break;
      case "SimpleDEX":
        const swapAmount = document.getElementById("amount").value;
        tx = await contract.swap(ethers.utils.parseEther(swapAmount), { value: ethers.utils.parseEther(swapAmount) });
        break;
      case "TimelockVault":
        const lockAmount = document.getElementById("amount").value;
        const releaseTime = document.getElementById("releaseTime").value;
        tx = await contract.lock(ethers.utils.parseEther(lockAmount), releaseTime, { value: ethers.utils.parseEther(lockAmount) });
        break;
      case "BatchSender":
        const batchRecipients = document.getElementById("recipients").value.split(",").map(r => r.trim());
        const batchAmounts = document.getElementById("amounts").value.split(",").map(a => ethers.utils.parseEther(a.trim()));
        tx = await contract.batchSend(batchRecipients, batchAmounts, { value: batchAmounts.reduce((a, b) => a.add(b), ethers.BigNumber.from(0)) });
        break;
    }
    await tx.wait();
    alert("Transaction successful!");
    document.getElementById("form-modal").style.display = "none";
  } catch (error) {
    console.error("Transaction error:", error);
    alert("Transaction failed: " + error.message);
  }
}
