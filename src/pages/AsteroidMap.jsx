import React, { useRef, useState, useEffect } from "react";
import { useAsteroidContext } from "../context/AsteroidContext";

const GALAXY_WIDTH = 1000;
const GALAXY_HEIGHT = 1000;

const AsteroidMap = () => {
  const mapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [wasDragging, setWasDragging] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);

  const { objects, selected, setSelected } = useAsteroidContext();

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handleWheel = (e) => {
      e.preventDefault();
      let newScale = scale + (e.deltaY < 0 ? 0.1 : -0.1);
      newScale = Math.max(0.5, Math.min(newScale, 3));
      setScale(newScale);
    };
    map.addEventListener("wheel", handleWheel, { passive: false });
    return () => map.removeEventListener("wheel", handleWheel);
  }, [scale]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setDragging(true);
    setWasDragging(false);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
    setWasDragging(true);
  };

  const handleMouseUp = () => setDragging(false);

  // Touch drag handlers
  const handleTouchStart = (e) => {
    setDragging(true);
    setWasDragging(false);
    const touch = e.touches[0];
    setStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - start.x,
      y: touch.clientY - start.y,
    });
    setWasDragging(true);
  };

  const handleTouchEnd = () => setDragging(false);

  // Show coordinates when clicking the map (not a marker)
  const handleClick = (e) => {
    if (wasDragging) return;
    const rect = mapRef.current.getBoundingClientRect();
    // Calculate coordinates relative to the transformed map
    const x = Math.round((e.clientX - rect.left - position.x) / scale);
    const y = Math.round((e.clientY - rect.top - position.y) / scale);
    if (x >= 0 && x <= GALAXY_WIDTH && y >= 0 && y <= GALAXY_HEIGHT) {
      setClickedCoords({ x, y });
      setSelected(null);
    }
  };

  // Marker click handler
  const handleMarkerClick = (obj) => {
    setSelected(obj);
    setClickedCoords(null);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        overflow: "hidden",
        position: "relative",
        background: "#000",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={mapRef}
    >
      {/* The transformed container */}
      <div
        style={{
          width: GALAXY_WIDTH,
          height: GALAXY_HEIGHT,
          position: "absolute",
          left: position.x,
          top: position.y,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <img
          src="/galaxy-map.png"
          alt="Galaxy Map"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
            position: "absolute",
            left: 0,
            top: 0,
          }}
          draggable={false}
        />
        {/* Render markers only inside galaxy map area */}
        {objects
          .filter(
            (obj) =>
              obj.x >= 0 &&
              obj.x <= GALAXY_WIDTH &&
              obj.y >= 0 &&
              obj.y <= GALAXY_HEIGHT
          )
          .map((obj) => (
            <div
              key={obj.id}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkerClick(obj);
              }}
              style={{
                position: "absolute",
                left: obj.x - (obj.type === "planet" ? 16 : 10),
                top: obj.y - (obj.type === "planet" ? 16 : 10),
                width: obj.type === "planet" ? 32 : 20,
                height: obj.type === "planet" ? 32 : 20,
                borderRadius: "50%",
                background: obj.type === "planet" ? "#4fc3f7" : "#bdbdbd",
                border:
                  obj.type === "planet"
                    ? "2px solid #1976d2"
                    : "1px solid #888",
                cursor: "pointer",
                boxShadow: "0 0 8px #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
              title={`${obj.name} (${obj.x}, ${obj.y})`}
            >
              {obj.type === "planet" ? "🪐" : "🪨"}
            </div>
          ))}
      </div>
      {/* Info popup for marker */}
      {selected && (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 20,
            background: "#222",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "8px",
            zIndex: 10,
            boxShadow: "0 2px 12px #000a",
          }}
        >
          <strong>{selected.name}</strong>
          <div>{selected.info}</div>
          <div>
            <small>
              Coordinates: ({selected.x}, {selected.y})
            </small>
          </div>
          <button
            style={{
              marginTop: "8px",
              background: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(null);
            }}
          >
            Close
          </button>
        </div>
      )}
      {/* Info popup for map click */}
      {clickedCoords && (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 70,
            background: "#222",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            zIndex: 10,
            boxShadow: "0 2px 12px #000a",
          }}
        >
          <strong>Coordinates</strong>
          <div>
            ({clickedCoords.x}, {clickedCoords.y})
          </div>
          <button
            style={{
              marginTop: "8px",
              background: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "4px 10px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setClickedCoords(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default AsteroidMap;
