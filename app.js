// ✅ Initialize Web3Modal with WalletConnect v2
const web3Modal = new window.Web3Modal.Web3Modal({
  projectId: "28f3dd90094536ee0e4ae65cad0c4de2", // your WalletConnect Project ID
  themeMode: "dark",
  chains: [
    {
      chainId: 8453,
      name: "Base",
      rpcUrls: ["https://mainnet.base.org"],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18
      }
    }
  ],
  metadata: {
    name: "Base Utility Hub",
    description: "Utility DApp on Base",
    url: window.location.origin,
    icons: ["https://walletconnect.com/meta/favicon.ico"]
  }
});

let ethersProvider;

// ✅ Connect Wallet function
async function initWalletConnect() {
  try {
    const provider = await web3Modal.connect();
    ethersProvider = new ethers.providers.Web3Provider(provider, "any");
    const accounts = await ethersProvider.listAccounts();
    document.getElementById("connect-wallet").innerText = "Connected";
    document.getElementById("wallet-address").innerText = `Wallet: ${accounts[0]}`;
  } catch (error) {
    console.error("WalletConnect error:", error);
    alert("Connection failed: " + (error.message || error));
  }
}

document.getElementById("connect-wallet").onclick = initWalletConnect;

// ✅ Example: just show the modal form for each contract (stub)
function showForm(contractName) {
  if (!ethersProvider) return alert("Connect wallet first!");
  const form = document.getElementById("contract-form");
  form.innerHTML = `<p>Actions for <b>${contractName}</b> coming soon...</p>`;
  document.getElementById("form-modal").style.display = "block";
}
