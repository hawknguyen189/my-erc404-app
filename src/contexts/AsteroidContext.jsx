/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { useERC404 } from "../hooks/useERC404";
import { useStaking } from "../hooks/useStaking";

const initialState = {
  tokenBalance: 0,
  stakedAmount: 0,
  rewards: 0,
  tierProgress: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_BALANCES":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { address, signer } = useWallet();
  const { tokenBalance, fetchBalance, approveStaking } = useERC404(signer);
  const {
    stakedAmount,
    rewards,
    tierProgress,
    fetchStakingData,
    stakeTokens,
    unstakeTokens,
    claimRewards,
  } = useStaking(signer);

  useEffect(() => {
    if (address && signer) {
      fetchBalance();
      fetchStakingData();
      const interval = setInterval(() => {
        fetchBalance();
        fetchStakingData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [address, signer, fetchBalance, fetchStakingData]);

  useEffect(() => {
    dispatch({
      type: "UPDATE_BALANCES",
      payload: { tokenBalance, stakedAmount, rewards, tierProgress },
    });
  }, [tokenBalance, stakedAmount, rewards, tierProgress]);

  return (
    <AppContext.Provider value={{ walletAddress: address, ...state }}>
      {children}
    </AppContext.Provider>
  );
};
