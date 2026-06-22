import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import SettingsPanel from './components/SettingsPanel';
import DisclaimerModal from './components/DisclaimerModal';
import GeminiStudio from './components/GeminiStudio';
import { GameState, GameSettings, DEFAULT_SETTINGS } from './types';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showGeminiStudio, setShowGeminiStudio] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('highScore');
    if (stored) setHighScore(parseInt(stored));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('highScore', score.toString());
    }
  }, [score, highScore]);

  // Update Audio Service when settings change
  useEffect(() => {
    audioService.setVolume(settings.audio.masterVolume);
  }, [settings.audio.masterVolume]);

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans select-none">
      {/* The Game Layer */}
      <GameCanvas 
        gameState={gameState} 
        setGameState={setGameState} 
        settings={settings}
        score={score}
        setScore={setScore}
      />

      {/* Disclaimer */}
      <DisclaimerModal onAccept={() => {}} />

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* HUD: Score */}
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          <span className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] stroke-black">
            {score}
          </span>
          {gameState === GameState.MENU && highScore > 0 && (
            <div className="text-xl text-yellow-400 font-bold mt-2 shadow-black drop-shadow-md">
              High Score: {highScore}
            </div>
          )}
        </div>

        {/* HUD: FPS / Stats (Optional based on settings) */}
        <div className="absolute top-2 left-2 text-xs text-green-400 font-mono">
           FPS: 60 (UL)
        </div>

        {/* Main Menu UI */}
        {gameState === GameState.MENU && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 pointer-events-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 via-white to-green-500 drop-shadow-2xl mb-8 text-center px-4">
              BHARAT FLIGHT
            </h1>
            
            <p className="text-white text-lg mb-8 animate-pulse font-bold">Tap or Space to Fly</p>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                Settings
              </button>
              <button 
                onClick={() => setShowGeminiStudio(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <span className="material-icons text-sm">sparkles</span> Gemini Studio
              </button>
            </div>
          </div>
        )}

        {/* Game Over UI */}
        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
            <h2 className="text-4xl font-bold text-red-500 mb-4 drop-shadow-lg">GAME OVER</h2>
            <div className="bg-white/10 p-6 rounded-xl mb-6 text-center border border-white/20">
              <div className="text-gray-300 text-sm uppercase tracking-widest">Score</div>
              <div className="text-4xl font-bold text-white mb-4">{score}</div>
              <div className="text-gray-300 text-sm uppercase tracking-widest">Best</div>
              <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {
                    setGameState(GameState.MENU);
                    setScore(0);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                Try Again
              </button>
              <button 
                 onClick={() => setShowGeminiStudio(true)}
                 className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
                 title="Make Art"
              >
                  🎨
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 pointer-events-auto">
          <SettingsPanel 
            settings={settings} 
            onUpdateSettings={setSettings} 
            onClose={() => setShowSettings(false)} 
          />
        </div>
      )}

      {/* Gemini Studio Modal */}
      {showGeminiStudio && (
        <div className="absolute inset-0 z-50 pointer-events-auto">
          <GeminiStudio onClose={() => setShowGeminiStudio(false)} />
        </div>
      )}
    </div>
  );
};

export default App;