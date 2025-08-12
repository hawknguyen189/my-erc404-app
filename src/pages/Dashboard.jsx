import { useWallet } from "../hooks/useWallet";
import WalletConnectButton from "../components/WalletConnectButton";
import Header from "../components/Header";
import AsteroidMap from "./AsteroidMap";

const Dashboard = () => {
  const { address } = useWallet();

  // ...existing code...
  return (
    <div>
      <Header />
      <div>
        <div className="row py-5">
          <div className="card shadow-lg p-4">
            <div className="card-body">
              <h1 className="card-title mb-4">Dashboard</h1>
              <p className="card-text">
                <strong>Connected Address:</strong> {address}
              </p>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-9">
              <AsteroidMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // ...existing code...
};

export default Dashboard;
