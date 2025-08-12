import { useContext } from "react";
import { AppContext } from "../context/AppContextUtils";
import WalletConnectButton from "./WalletConnectButton";

const Header = () => {
  const context = useContext(AppContext);
  console.log("Header rendered, context:", context);

  return (
    <header className="bg-primary text-white py-3 mb-4">
      <div className="">
        <h2 className="mb-0">My Web3 App</h2>
        <WalletConnectButton />
      </div>
    </header>
  );
};

export default Header;
