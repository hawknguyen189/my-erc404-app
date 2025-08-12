import { useState, useEffect } from "react";

export const useStaking = (signer) => {
  const [asteroid, setAsteroid] = useState({}); // Single object

  useEffect(() => {
    let isMounted = true;
    console.log("useStaking signer:", signer); // Debug signer change
    const sampleAsteroid = {
      id: "1",
      name: "Asteroid X",
      x: 300,
      y: 200,
      resources: 50,
      owner: null,
    };
    console.log("useStaking sampleAsteroid:", sampleAsteroid);
    if (isMounted) setAsteroid(sampleAsteroid);
    return () => {
      isMounted = false;
    };
  }, [signer]); // Only re-run on signer change

  console.log("useStaking returning asteroid:", asteroid);
  const stakeResources = async (args) => {
    console.log("Simulating stake for args:", args);
    return Promise.resolve();
  };

  return { stakeResources, asteroid }; // Return object with asteroid
};
