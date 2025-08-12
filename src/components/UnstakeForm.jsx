import React, { useState } from "react";
import { useStaking } from "../hooks/useStaking";

const UnstakeForm = () => {
  const [amount, setAmount] = useState("");
  const { unstakeTokens } = useStaking();

  const handleUnstake = async (e) => {
    e.preventDefault();
    if (amount > 0) {
      await unstakeTokens(amount);
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleUnstake} className="card p-3">
      <h5>Unstake Tokens</h5>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Amount to unstake"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-warning">
        Unstake
      </button>
    </form>
  );
};

export default UnstakeForm;
