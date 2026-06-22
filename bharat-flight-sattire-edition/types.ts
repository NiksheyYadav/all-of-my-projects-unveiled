export enum GameState {
  MENU,
  PLAYING,
  PAUSED,
  GAME_OVER
}

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT_2_3 = "2:3",
  LANDSCAPE_3_2 = "3:2",
  PORTRAIT_3_4 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_9_16 = "9:16",
  LANDSCAPE_16_9 = "16:9",
  CINEMATIC_21_9 = "21:9"
}

export interface GameSettings {
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    particles: boolean;
    screenShake: boolean;
    parallaxLayers: number;
  };
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    visualizer: boolean;
  };
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard';
    showTrajectory: boolean;
  };
  accessibility: {
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

export const DEFAULT_SETTINGS: GameSettings = {
  graphics: { quality: 'high', particles: true, screenShake: true, parallaxLayers: 3 },
  audio: { masterVolume: 0.8, musicVolume: 0.6, sfxVolume: 0.8, visualizer: true },
  gameplay: { difficulty: 'normal', showTrajectory: false },
  accessibility: { colorBlindMode: 'none', reducedMotion: false, highContrast: false }
};

export interface HighScore {
  score: number;
  date: string;
}