import React, { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { GameState, Platform, Player } from '../types/game';
import { Zap } from 'lucide-react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const PLATFORM_COUNT = 6;
const PLAYER_SPEED = 5;
const PARTICLE_COUNT = 20;

const STARTING_PLATFORM_Y = CANVAS_HEIGHT - 100;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const initialPlayer: Player = {
  x: CANVAS_WIDTH / 2,
  y: STARTING_PLATFORM_Y - 30,
  width: 30,
  height: 30,
  velocityY: 0,
  velocityX: 0,
  isJumping: false,
};

const createPlatform = (x: number, y: number, forceMoving: boolean = false): Platform => ({
  x,
  y,
  width: 100,
  height: 20,
  type: forceMoving || Math.random() > 0.4 ? 'moving' : 'normal',
  direction: Math.random() > 0.5 ? 'left' : 'right',
  speed: Math.random() * 3 + 1,
  visible: true,
});

const generatePlatforms = () => {
  const platforms: Platform[] = [];
  
  platforms.push({
    x: CANVAS_WIDTH / 2 - 100,
    y: STARTING_PLATFORM_Y,
    width: 200,
    height: 20,
    type: 'normal',
    visible: true
  });

  for (let i = 1; i < PLATFORM_COUNT; i++) {
    const forceMoving = Math.random() > 0.3;
    const minY = CANVAS_HEIGHT * 0.2;
    const maxY = CANVAS_HEIGHT * 0.8;
    const y = minY + (maxY - minY) * ((i - 1) / (PLATFORM_COUNT - 1));
    
    platforms.push(
      createPlatform(
        Math.random() * (CANVAS_WIDTH - 100),
        y,
        forceMoving
      )
    );
  }
  return platforms;
};

const initialState: GameState = {
  score: 0,
  highScore: parseInt(localStorage.getItem('highScore') || '0'),
  isGameOver: false,
  isPaused: false,
  platforms: generatePlatforms(),
  player: initialPlayer,
  powerUps: [],
};

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [bgGradient, setBgGradient] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const particles = useRef<Particle[]>([]);
  const [showPowerEffect, setShowPowerEffect] = useState(false);

  const createParticle = (x: number, y: number) => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
    };
  };

  const handleJump = () => {
    if (!gameState.player.isJumping) {
      setShowPowerEffect(true);
      setTimeout(() => setShowPowerEffect(false), 300);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.current.push(
          createParticle(
            gameState.player.x + gameState.player.width / 2,
            gameState.player.y + gameState.player.height
          )
        );
      }

      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          velocityY: JUMP_FORCE,
          isJumping: true,
        },
      }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      if (e.code === 'Space') {
        handleJump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateGame = (deltaTime: number) => {
    if (gameState.isGameOver || gameState.isPaused) return;

    particles.current = particles.current
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02,
      }))
      .filter(p => p.life > 0);

    setGameState(prev => {
      const newPlayer = { ...prev.player };
      
      if (keysPressed.current.has('ArrowLeft')) {
        newPlayer.x = Math.max(0, newPlayer.x - PLAYER_SPEED);
      }
      if (keysPressed.current.has('ArrowRight')) {
        newPlayer.x = Math.min(CANVAS_WIDTH - newPlayer.width, newPlayer.x + PLAYER_SPEED);
      }

      newPlayer.velocityY += GRAVITY;
      newPlayer.y += newPlayer.velocityY;

      if (newPlayer.y < 0) {
        newPlayer.y = 0;
        newPlayer.velocityY = 0;
      }

      const newPlatforms = prev.platforms.map(platform => {
        if (platform.type === 'moving') {
          let newX = platform.x;
          if (platform.direction === 'right') {
            newX += (platform.speed || 2);
            if (newX > CANVAS_WIDTH - platform.width) {
              platform.direction = 'left';
            }
          } else {
            newX -= (platform.speed || 2);
            if (newX < 0) {
              platform.direction = 'right';
            }
          }
          return { ...platform, x: newX };
        }
        return platform;
      });

      let isOnPlatform = false;
      newPlatforms.forEach(platform => {
        if (
          newPlayer.y + newPlayer.height > platform.y &&
          newPlayer.y + newPlayer.height < platform.y + platform.height &&
          newPlayer.x + newPlayer.width > platform.x &&
          newPlayer.x < platform.x + platform.width &&
          newPlayer.velocityY > 0
        ) {
          isOnPlatform = true;
          newPlayer.y = platform.y - newPlayer.height;
          newPlayer.velocityY = 0;
          newPlayer.isJumping = false;
        }
      });

      if (newPlayer.y > CANVAS_HEIGHT) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        localStorage.setItem('highScore', newHighScore.toString());
        return { ...prev, isGameOver: true, highScore: newHighScore };
      }

      const newScore = Math.floor((CANVAS_HEIGHT - newPlayer.y) / 10);

      return {
        ...prev,
        player: newPlayer,
        platforms: newPlatforms,
        score: Math.max(newScore, prev.score),
      };
    });
  };

  useGameLoop(updateGame);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, `hsla(${bgGradient}, 70%, 15%, 1)`);
    gradient.addColorStop(1, `hsla(${(bgGradient + 60) % 360}, 70%, 5%, 1)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = `hsla(${bgGradient}, 70%, 50%, 0.1)`;
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let i = 0; i < CANVAS_WIDTH; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    gameState.platforms.forEach(platform => {
      const platformGradient = ctx.createLinearGradient(
        platform.x, platform.y,
        platform.x, platform.y + platform.height
      );
      platformGradient.addColorStop(0, platform.type === 'moving' ? '#00ff9d' : '#4287f5');
      platformGradient.addColorStop(1, platform.type === 'moving' ? '#00916f' : '#1a56b8');
      
      ctx.fillStyle = platformGradient;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      ctx.shadowColor = platform.type === 'moving' ? '#00ff9d' : '#4287f5';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = platform.type === 'moving' ? '#00ff9d' : '#4287f5';
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = '#00ff9d';
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
      gameState.player.x + gameState.player.width / 2,
      gameState.player.y + gameState.player.height / 2,
      gameState.player.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    particles.current.forEach(particle => {
      ctx.fillStyle = `hsla(${bgGradient}, 100%, 60%, ${particle.life})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#00ff9d';
    ctx.font = 'bold 24px "Press Start 2P", system-ui';
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = 10;
    ctx.fillText(`得分: ${gameState.score}`, 10, 30);
    ctx.fillText(`最高分: ${gameState.highScore}`, 10, 60);
    ctx.shadowBlur = 0;

  }, [gameState, bgGradient]);

  useEffect(() => {
    if (!gameState.isPaused && !gameState.isGameOver) {
      const timer = setInterval(() => {
        setBgGradient(prev => (prev + 0.5) % 360);
      }, 50);
      return () => clearInterval(timer);
    }
  }, [gameState.isPaused, gameState.isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleJump}
          className="border-4 border-[#00ff9d] rounded-lg shadow-lg shadow-[#00ff9d]/20"
        />
        {showPowerEffect && (
          <div className="absolute inset-0 animate-pulse bg-[#00ff9d]/10 rounded-lg" />
        )}
        {gameState.isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-[#00ff9d] mb-4 animate-pulse">游戏结束</h2>
            <p className="text-xl text-[#00ff9d] mb-4">得分: {gameState.score}</p>
            <button
              className="px-6 py-2 bg-[#00ff9d] text-black rounded-lg hover:bg-[#00ff9d]/80 transition-colors font-bold
                         shadow-lg shadow-[#00ff9d]/50 hover:shadow-[#00ff9d]/70"
              onClick={() => setGameState(initialState)}
            >
              重新开始
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Zap className="w-5 h-5 text-[#00ff9d]" />
        <p className="text-[#00ff9d] font-bold">空格键跳跃 | ← → 移动</p>
      </div>
    </div>
  );
};