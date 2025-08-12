import WalletConnectButton from "../components/WalletConnectButton";
import Header from "../components/Header";

const Home = () => {
  console.log("Home page rendered");
  return (
    <div>
      <Header />
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <div className="card-body text-center">
            <h1 className="card-title mb-4">Welcome to the Web3 App</h1>
            <p className="card-text mb-4">
              Connect your wallet to access the dashboard.
            </p>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
