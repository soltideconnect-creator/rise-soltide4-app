export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'moving' | 'bonus';
  direction?: 'left' | 'right';
  speed?: number;
  visible?: boolean;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  platforms: Platform[];
  player: Player;
  powerUps: PowerUp[];
}

export interface PowerUp {
  x: number;
  y: number;
  type: 'shield' | 'coin' | 'slowdown';
  active: boolean;
}