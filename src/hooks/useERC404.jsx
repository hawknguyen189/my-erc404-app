import { useState, useEffect } from "react";

export const useERC404 = (signer) => {
  const [planet, setPlanet] = useState({}); // Single object

  useEffect(() => {
    let isMounted = true;
    console.log("useERC404 signer:", signer); // Debug signer change
    const samplePlanet = {
      id: "1",
      name: "Planet Alpha",
      x: 200,
      y: 300,
      resources: 100,
      owner: null,
    };
    console.log("useERC404 samplePlanet:", samplePlanet);
    if (isMounted) setPlanet(samplePlanet);
    return () => {
      isMounted = false;
    };
  }, [signer]); // Only re-run on signer change

  console.log("useERC404 returning planet:", planet);
  return planet; // Return single object
};
