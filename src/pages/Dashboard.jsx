import React from "react";
import { useERC404 } from "../hooks/useERC404";
import { useStaking } from "../hooks/useStaking";
import StakeForm from "../components/StakeForm";
import UnstakeForm from "../components/UnstakeForm";
import ClaimRewardsButton from "../components/ClaimRewardsButton";

// Rest unchanged...

const Dashboard = () => {
  const { tokenBalance } = useERC404();
  const { stakedAmount, rewards, tierProgress } = useStaking();

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Token Balance</h5>
            <p className="card-text">{tokenBalance} ERC-404</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Staked Amount</h5>
            <p className="card-text">{stakedAmount} ERC-404</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Staking Rewards</h5>
            <p className="card-text">{rewards} Tokens</p>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Upgrade Progress</h5>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${tierProgress}%` }}
                aria-valuenow={tierProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {tierProgress}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <StakeForm />
      </div>
      <div className="col-md-4 mb-4">
        <UnstakeForm />
      </div>
      <div className="col-md-4 mb-4">
        <ClaimRewardsButton />
      </div>
    </div>
  );
};

export default Dashboard;
