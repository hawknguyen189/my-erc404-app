import React, { useState } from "react";
import { useERC404 } from "../hooks/useERC404";
import { useStaking } from "../hooks/useStaking";

// Rest unchanged...

const StakeForm = () => {
  const [amount, setAmount] = useState("");
  const { approveStaking } = useERC404();
  const { stakeTokens } = useStaking();

  const handleStake = async (e) => {
    e.preventDefault();
    if (amount > 0) {
      try {
        await approveStaking(amount); // Approve first
        await stakeTokens(amount); // Then stake
        setAmount("");
      } catch (error) {
        console.error("Stake failed:", error);
      }
    }
  };

  return (
    <form onSubmit={handleStake} className="card p-3">
      <h5>Stake Tokens</h5>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Amount to stake"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-success">
        Stake
      </button>
    </form>
  );
};

export default StakeForm;
