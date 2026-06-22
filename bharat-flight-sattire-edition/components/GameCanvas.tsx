import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, GameSettings } from '../types';
import { audioService } from '../services/audioService';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  settings: GameSettings;
  score: number;
  setScore: (s: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  setGameState, 
  settings,
  score,
  setScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Game Physics State (Refs for performance)
  const birdY = useRef(300);
  const birdVelocity = useRef(0);
  const birdRotation = useRef(0);
  const pipes = useRef<{x: number, y: number, passed: boolean}[]>([]);
  const particles = useRef<{x: number, y: number, vx: number, vy: number, life: number, color: string}[]>([]);
  const backgroundOffset = useRef(0);

  // Constants based on settings
  const GRAVITY = 1200;
  const JUMP_STRENGTH = -450;
  const PIPE_SPEED = settings.gameplay.difficulty === 'hard' ? 250 : settings.gameplay.difficulty === 'easy' ? 160 : 200;
  const PIPE_SPAWN_RATE = settings.gameplay.difficulty === 'hard' ? 1500 : 2000;
  const PIPE_GAP = settings.gameplay.difficulty === 'hard' ? 140 : settings.gameplay.difficulty === 'easy' ? 200 : 170;
  
  const lastPipeTime = useRef(0);

  // Helper to draw the bird (The "Leader")
  const drawBird = (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Body
    ctx.fillStyle = '#FF9933'; // Saffron
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Jacket
    ctx.fillStyle = '#FFF'; // White Kurta
    ctx.beginPath();
    ctx.arc(0, 5, 10, 0, Math.PI, false);
    ctx.fill();

    // Beard (White)
    ctx.fillStyle = '#EEE';
    ctx.beginPath();
    ctx.arc(5, 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Glasses
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(8, -2, 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(8, -2, 1, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#E58020';
    ctx.beginPath();
    ctx.ellipse(-5, 5, 10, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawPipe = (ctx: CanvasRenderingContext2D, x: number, y: number, gap: number, height: number) => {
    const pipeWidth = 60;
    
    // Draw generic "Opposition" obstacle style (Blue/Cardboard cutout feel)
    ctx.fillStyle = '#1E3A8A'; // Dark Blue
    
    // Top Pipe
    ctx.fillRect(x, 0, pipeWidth, y);
    // Bottom Pipe
    ctx.fillRect(x, y + gap, pipeWidth, height - (y + gap));

    // Decorative borders
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, 0, pipeWidth, y);
    ctx.strokeRect(x, y + gap, pipeWidth, height - (y + gap));

    // Satirical text on pipe
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px sans-serif';
    ctx.fillText("OPPOSITION", x + 2, y - 20);
  };

  const createExplosion = (x: number, y: number) => {
    if (!settings.graphics.particles) return;
    for (let i = 0; i < 20; i++) {
      particles.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 300,
        vy: (Math.random() - 0.5) * 300,
        life: 1.0,
        color: Math.random() > 0.5 ? '#FF9933' : '#138808'
      });
    }
  };

  const resetGame = useCallback(() => {
    birdY.current = 300;
    birdVelocity.current = 0;
    birdRotation.current = 0;
    pipes.current = [];
    particles.current = [];
    backgroundOffset.current = 0;
    lastPipeTime.current = 0;
    setScore(0);
  }, [setScore]);

  // The Game Loop
  const update = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1); // Cap dt for lag
    lastTimeRef.current = time;

    if (gameState !== GameState.PLAYING) {
       // If not playing, just render idle state (or handled by React UI overlay)
       if (gameState === GameState.MENU) {
         // Bobbing animation
         birdY.current = 300 + Math.sin(time / 300) * 10;
       }
    } else {
      // Physics
      birdVelocity.current += GRAVITY * dt;
      birdY.current += birdVelocity.current * dt;
      
      // Rotation based on velocity
      birdRotation.current = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (birdVelocity.current * 0.002)));

      // Floor/Ceiling Collision
      const canvas = canvasRef.current;
      if (canvas) {
         if (birdY.current + 15 > canvas.height || birdY.current - 15 < 0) {
            audioService.playCollision();
            setGameState(GameState.GAME_OVER);
            if (settings.graphics.screenShake) {
               // Simple visual shake logic handled in draw
            }
         }
      }

      // Pipes
      if (time - lastPipeTime.current > PIPE_SPAWN_RATE) {
        const canvasHeight = canvasRef.current?.height || 600;
        const minPipeY = 50;
        const maxPipeY = canvasHeight - PIPE_GAP - 50;
        const pipeY = Math.random() * (maxPipeY - minPipeY) + minPipeY;
        
        pipes.current.push({
          x: canvasRef.current?.width || 800,
          y: pipeY,
          passed: false
        });
        lastPipeTime.current = time;
      }

      // Move Pipes & Collision
      pipes.current.forEach(pipe => {
        pipe.x -= PIPE_SPEED * dt;

        // AABB Collision
        // Bird is approx circle r=20 centered at 100, birdY.current
        const birdX = 100;
        const pipeWidth = 60;
        
        // Check horizontal overlap
        if (birdX + 15 > pipe.x && birdX - 15 < pipe.x + pipeWidth) {
           // Check vertical overlap (hit top pipe OR hit bottom pipe)
           if ((birdY.current - 10 < pipe.y) || (birdY.current + 10 > pipe.y + PIPE_GAP)) {
             createExplosion(birdX, birdY.current);
             audioService.playCollision();
             setGameState(GameState.GAME_OVER);
           }
        }

        // Scoring
        if (!pipe.passed && birdX > pipe.x + pipeWidth) {
          pipe.passed = true;
          setScore(score + 1); // This works because score is in dependency or we use functional update
          audioService.playScore();
        }
      });

      // Cleanup Pipes
      pipes.current = pipes.current.filter(p => p.x > -100);
    }

    // Update Particles
    particles.current.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    });
    particles.current = particles.current.filter(p => p.life > 0);
    
    // Background scroll
    backgroundOffset.current += (PIPE_SPEED * 0.5) * dt;
  }, [gameState, settings, score, setScore, setGameState, GRAVITY, JUMP_STRENGTH, PIPE_SPEED, PIPE_SPAWN_RATE, PIPE_GAP]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background (Parallax Layer 1 - Sky)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Background (Parallax Layer 2 - Monuments)
    // Simplified silhouette drawing
    ctx.fillStyle = '#A7F3D0'; // Light Green tint
    const bgX = -(backgroundOffset.current % canvas.width);
    // Draw generic monument shapes
    ctx.beginPath();
    ctx.moveTo(bgX, canvas.height);
    ctx.lineTo(bgX + 100, canvas.height - 100); // Pyramid/Temple
    ctx.lineTo(bgX + 200, canvas.height);
    ctx.lineTo(bgX + 300, canvas.height - 150); // India Gate-ish
    ctx.lineTo(bgX + 400, canvas.height);
    ctx.lineTo(bgX + 500, canvas.height - 80); // Dome
    ctx.arc(bgX + 550, canvas.height - 80, 50, Math.PI, 0);
    ctx.lineTo(bgX + 600, canvas.height);
    ctx.lineTo(bgX + canvas.width, canvas.height);
    ctx.lineTo(bgX + canvas.width, canvas.height);
    ctx.fill();
    // Draw duplicate for seamless loop
    ctx.beginPath();
    ctx.moveTo(bgX + canvas.width, canvas.height);
    ctx.lineTo(bgX + canvas.width + 100, canvas.height - 100);
    ctx.lineTo(bgX + canvas.width + 200, canvas.height);
    ctx.fill();


    // Pipes
    pipes.current.forEach(pipe => {
      drawPipe(ctx, pipe.x, pipe.y, PIPE_GAP, canvas.height);
    });

    // Trajectory Line (Assist)
    if (settings.gameplay.showTrajectory && gameState === GameState.PLAYING) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(100, birdY.current);
      // Simple projection
      let simY = birdY.current;
      let simVel = birdVelocity.current;
      for(let i=0; i<20; i++) {
         simVel += GRAVITY * 0.016;
         simY += simVel * 0.016;
         ctx.lineTo(100 + (PIPE_SPEED * 0.016 * i * 10), simY);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Bird
    drawBird(ctx, 100, birdY.current, birdRotation.current);

    // Particles
    particles.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

  }, [settings, gameState, GRAVITY, PIPE_SPEED, PIPE_GAP]);

  const loop = useCallback((time: number) => {
    requestRef.current = requestAnimationFrame(loop);
    update(time);
    draw();
  }, [update, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]);

  // Controls
  useEffect(() => {
    const handleInput = () => {
      if (gameState === GameState.MENU || gameState === GameState.GAME_OVER) {
        resetGame();
        setGameState(GameState.PLAYING);
        audioService.playFlap(); // Start sound
      } else if (gameState === GameState.PLAYING) {
        birdVelocity.current = JUMP_STRENGTH;
        audioService.playFlap();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleInput();
      }
    };

    const handleTouch = (e: TouchEvent) => {
        e.preventDefault(); // Prevent scrolling
        handleInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Canvas click listener is better than window click to avoid UI clicks triggering game
    const canvas = canvasRef.current;
    if(canvas) {
        canvas.addEventListener('mousedown', handleInput);
        canvas.addEventListener('touchstart', handleTouch, {passive: false});
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if(canvas) {
          canvas.removeEventListener('mousedown', handleInput);
          canvas.removeEventListener('touchstart', handleTouch);
      }
    };
  }, [gameState, setGameState, resetGame, JUMP_STRENGTH]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="block w-full h-full bg-gray-800"
    />
  );
};

export default GameCanvas;