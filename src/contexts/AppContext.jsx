/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useWallet } from "../hooks/useWallet";
import { useERC404 } from "../hooks/useERC404";
import { useStaking } from "../hooks/useStaking";

const initialState = {
  tokenBalance: 0,
  stakedAmount: 0,
  rewards: 0,
  tierProgress: 0,
  connectionError: null,
};

const reducer = (state, action) => {
  console.log("Reducer action:", action);
  switch (action.type) {
    case "UPDATE_BALANCES":
      return { ...state, ...action.payload };
    case "SET_ERROR":
      return { ...state, connectionError: action.payload };
    default:
      return state;
  }
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { address, provider, connectionError } = useWallet();
  const { tokenBalance, fetchBalance } = useERC404(provider);
  const { stakedAmount, rewards, tierProgress, fetchStakingData } =
    useStaking(provider);

  const refreshData = useCallback(() => {
    if (address && provider) {
      console.log("Refreshing data for address:", address);
      fetchBalance();
      fetchStakingData();
      dispatch({
        type: "UPDATE_BALANCES",
        payload: { tokenBalance, stakedAmount, rewards, tierProgress },
      });
    } else {
      console.log("Cannot refresh: No address or provider");
    }
  }, [
    address,
    provider,
    tokenBalance,
    stakedAmount,
    rewards,
    tierProgress,
    fetchBalance,
    fetchStakingData,
  ]);

  useEffect(() => {
    console.log("Syncing connectionError:", connectionError);
    dispatch({ type: "SET_ERROR", payload: connectionError });
  }, [connectionError]);

  useEffect(() => {
    console.log("AppContext state updated:", {
      walletAddress: address,
      ...state,
    });
  }, [address, state]);

  const contextValue = useMemo(
    () => ({ walletAddress: address, ...state, refreshData }),
    [address, state, refreshData]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
