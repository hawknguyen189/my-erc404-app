import React, { createContext, useContext, useState } from "react";

const GALAXY_WIDTH = 1000;
const GALAXY_HEIGHT = 1000;

const AsteroidContext = createContext();

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const sampleObjects = [
  {
    id: "planet-1",
    type: "planet",
    name: "Planet Alpha",
    info: "A lush, habitable world.",
    x: 200,
    y: 120,
  },
  {
    id: "asteroid-1",
    type: "asteroid",
    name: "Asteroid Zeta",
    info: "Rich in minerals.",
    x: 400,
    y: 300,
  },
  {
    id: "planet-2",
    type: "planet",
    name: "Planet Beta",
    info: "A desert planet.",
    x: 700,
    y: 220,
  },
];

export function AsteroidProvider({ children }) {
  // Clamp all objects on init
  const [objects, setObjects] = useState(
    sampleObjects.map((obj) => ({
      ...obj,
      x: clamp(obj.x, 0, GALAXY_WIDTH),
      y: clamp(obj.y, 0, GALAXY_HEIGHT),
    }))
  );
  const [selected, setSelected] = useState(null);

  // Optionally: function to move an object and clamp its position
  const moveObject = (id, newX, newY) => {
    setObjects((objs) =>
      objs.map((obj) =>
        obj.id === id
          ? {
              ...obj,
              x: clamp(newX, 0, GALAXY_WIDTH),
              y: clamp(newY, 0, GALAXY_HEIGHT),
            }
          : obj
      )
    );
  };

  return (
    <AsteroidContext.Provider
      value={{ objects, selected, setSelected, moveObject }}
    >
      {children}
    </AsteroidContext.Provider>
  );
}

export function useAsteroidContext() {
  return useContext(AsteroidContext);
}
