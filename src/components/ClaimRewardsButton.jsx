import React from "react";
import { useStaking } from "../hooks/useStaking";

const ClaimRewardsButton = () => {
  const { claimRewards } = useStaking();

  return (
    <div className="card p-3">
      <h5>Claim Rewards</h5>
      <button onClick={claimRewards} className="btn btn-primary">
        Claim
      </button>
    </div>
  );
};

export default ClaimRewardsButton;
