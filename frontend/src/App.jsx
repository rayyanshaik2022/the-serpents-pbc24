import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { MainGame } from "./MainGame.js";
import { LandingScreen } from './LandingScreen.js';


function App() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'gl-container', // Specify the ID of the div element
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [LandingScreen, MainGame],
    };

    new Phaser.Game(config);

    // Cleanup function to destroy the game instance when the component unmounts
    return () => {
      if (window.game) {
        window.game.destroy(true);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <div className="flex items-center justify-center py-8 px-16 w-screen h-screen">
        <div id='gl-container' className="w-full h-full bg-blue-300">
          {/* Phaser game will be injected here */}
        </div>
      </div>
    </>
  );
}

export default App;
