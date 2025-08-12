import React, { useRef, useEffect, useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useERC404, useStaking } from '../hooks/index.js';

const AsteroidMap = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(); // Moved to top level
  const { walletAddress, signer } = useContext(AppContext);
  const planet = useERC404(signer); // Single planet object
  const { stakeResources, asteroid } = useStaking(signer); // Single asteroid object
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [galaxyData, setGalaxyData] = useState({ planet: {}, asteroid: {} }); // Single objects
  const [imageLoaded, setImageLoaded] = useState(false);

  const galaxyImage = new Image();
  galaxyImage.src = 'public/galaxy-map.png'; // Verify this path
  galaxyImage.onload = () => {
    console.log('Galaxy image loaded successfully at:', galaxyImage.src);
    setImageLoaded(true);
  };
  galaxyImage.onerror = () => console.error('Failed to load galaxy-map.png. Check path:', galaxyImage.src);

  // Update galaxyData only when planet or asteroid changes
  useEffect(() => {
    console.log('AsteroidMap planet:', planet);
    console.log('AsteroidMap asteroid:', asteroid);
    console.log('AsteroidMap galaxyData before update:', galaxyData);
    setGalaxyData({
      planet: planet || {},
      asteroid: asteroid || {},
    });
    console.log('AsteroidMap galaxyData after update:', galaxyData);
  }, [planet, asteroid]); // Only on planet/asteroid change

  // Handle canvas rendering and events
  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    const handleWheel = (event) => {
      event.preventDefault();
      const zoomSpeed = 0.1;
      const newScale = scale + event.deltaY * -zoomSpeed * 0.01;
      setScale(Math.min(Math.max(0.5, newScale), 2));
    };

    const handleMouseDown = (event) => {
      setIsDragging(true);
      setStartX(event.clientX - offsetX);
      setStartY(event.clientY - offsetY);
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        const newOffsetX = event.clientX - startX;
        const newOffsetY = event.clientY - startY;
        setOffsetX(newOffsetX);
        setOffsetY(newOffsetY);
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      if (imageLoaded) {
        ctx.drawImage(galaxyImage, 0, 0, 1200, 900, -offsetX / scale, -offsetY / scale, 1200 / scale, 900 / scale);
      }

      // Draw single planet
      if (galaxyData.planet && typeof galaxyData.planet.x === 'number' && typeof galaxyData.planet.y === 'number') {
        ctx.beginPath();
        ctx.arc(galaxyData.planet.x, galaxyData.planet.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = galaxyData.planet.owner === walletAddress ? 'green' : 'blue';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(galaxyData.planet.name || 'Unnamed', galaxyData.planet.x - 10, galaxyData.planet.y - 25);
      }

      // Draw single asteroid
      if (galaxyData.asteroid && typeof galaxyData.asteroid.x === 'number' && typeof galaxyData.asteroid.y === 'number') {
        ctx.beginPath();
        ctx.arc(galaxyData.asteroid.x, galaxyData.asteroid.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = galaxyData.asteroid.owner === walletAddress ? 'green' : 'gray';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(galaxyData.asteroid.name || 'Unnamed', galaxyData.asteroid.x - 10, galaxyData.asteroid.y - 15);
      }

      ctx.restore();
    };

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - offsetX) / scale;
      const y = (event.clientY - rect.top - offsetY) / scale;
      console.log('Click event - x:', x, 'y:', y);

      const performAction = (type, data, action) => {
        if (data && typeof data === 'object' && data.id && data.name && typeof data.x === 'number' && typeof data.y === 'number') {
          console.log('Selected object data:', data);
          if (walletAddress && !data.owner) {
            (async () => {
              try {
                await action();
                setGalaxyData(prev => ({
                  ...prev,
                  [type]: { ...prev[type], owner: walletAddress },
                }));
              } catch (error) {
                console.error(`Error ${type === 'planet' ? 'staking' : 'claiming'}:`, error);
              }
            })();
          }
        } else {
          console.error('Invalid data selected:', data);
        }
      };

      // Check for planet click
      if (galaxyData.planet && typeof galaxyData.planet.x === 'number' && typeof galaxyData.planet.y === 'number') {
        const distance = Math.sqrt((x - galaxyData.planet.x) ** 2 + (y - galaxyData.planet.y) ** 2);
        if (distance < 20) {
          performAction('planet', galaxyData.planet, () => stakeResources({ args: [galaxyData.planet.id, 10] }));
        }
      }

      // Check for asteroid click
      if (galaxyData.asteroid && typeof galaxyData.asteroid.x === 'number' && typeof galaxyData.asteroid.y === 'number') {
        const distance = Math.sqrt((x - galaxyData.asteroid.x) ** 2 + (y - galaxyData.asteroid.y) ** 2);
        if (distance < 10) {
          performAction('asteroid', galaxyData.asteroid, () => stakeResources({ args: [galaxyData.asteroid.id, 5] }));
        }
      }
    };

    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    // Use requestAnimationFrame with ref
    const animate = () => {
      drawMap();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, [imageLoaded]); // Only re-run when image loads

  return (
    <div className="text-center">
      <h2>Asteroid Map</h2>
      <canvas ref={canvasRef} style={{ border: '1px solid white' }} />
    </div>
  );
};

export default AsteroidMap;