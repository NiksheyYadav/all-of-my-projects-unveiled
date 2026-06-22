import gym
from gym import spaces
import numpy as np
from stable_baselines3 import PPO
import math

class FootballEnv(gym.Env):
    def __init__(self):
        super(FootballEnv, self).__init__()
        self.action_space = spaces.MultiDiscrete([4, 10])  # Action: [action_type, strength]
        self.observation_space = spaces.Box(low=0, high=800, shape=(8,), dtype=np.float32)
        self.player_a_pos = [100, 300]
        self.player_b_pos = [700, 300]
        self.ball_pos = [400, 300]
        self.ball_velocity = [0, 0]
        self.score_a = 0
        self.score_b = 0
        self.field_width = 800
        self.field_height = 600
        self.player_radius = 10
        self.ball_radius = 5
        self.goal_a = (50, self.field_height // 2)
        self.goal_b = (self.field_width - 50, self.field_height // 2)
        self.ball_friction = 0.98

    def reset(self):
        self.player_a_pos = [100, 300]
        self.player_b_pos = [700, 300]
        self.ball_pos = [400, 300]
        self.ball_velocity = [0, 0]
        self.score_a = 0
        self.score_b = 0
        return np.array(self.player_a_pos + self.player_b_pos + self.ball_pos + self.ball_velocity)

    def step(self, action):
        action_type, strength = action
        reward = 0
        done = False
        # Simple opponent AI
        opponent_action = 3  # Attack
        opponent_target = self.ball_pos
        self.move_player(self.player_b_pos, opponent_target, 5)

        # Player A action
        if action_type == 0:  # Kick
            if self.distance(self.player_a_pos, self.ball_pos) < self.player_radius + self.ball_radius:
                self.kick_ball(self.player_a_pos, self.ball_pos, self.goal_b, strength)
                reward += 0.5
        elif action_type == 1:  # Hold
            self.move_player(self.player_a_pos, self.ball_pos, 3)
            reward += 0.1
        elif action_type == 2:  # Defend
            self.move_player(self.player_a_pos, self.player_b_pos, 5)
            reward += 0.2
        else:  # Attack
            self.move_player(self.player_a_pos, self.ball_pos, 6)
            reward += 0.1

        self.update_ball()
        if self.is_goal(self.goal_a):
            self.score_b += 1
            reward -= 100
            done = True
        elif self.is_goal(self.goal_b):
            self.score_a += 1
            reward += 100
            done = True

        return np.array(self.player_a_pos + self.player_b_pos + self.ball_pos + self.ball_velocity), reward, done, {}

    def distance(self, pos1, pos2):
        return math.hypot(pos1[0] - pos2[0], pos1[1] - pos2[1])

    def move_player(self, player_pos, target_pos, speed):
        dx = target_pos[0] - player_pos[0]
        dy = target_pos[1] - player_pos[1]
        dist = math.hypot(dx, dy)
        if dist > 1:
            dx, dy = dx / dist * speed, dy / dist * speed
            player_pos[0] += dx
            player_pos[1] += dy
        player_pos[0] = max(self.player_radius, min(self.field_width - self.player_radius, player_pos[0]))
        player_pos[1] = max(self.player_radius, min(self.field_height - self.player_radius, player_pos[1]))

    def kick_ball(self, player_pos, ball_pos, goal_pos, strength):
        if self.distance(player_pos, ball_pos) < self.player_radius + self.ball_radius:
            direction_x = goal_pos[0] - ball_pos[0]
            direction_y = goal_pos[1] - ball_pos[1]
            magnitude = math.hypot(direction_x, direction_y)
            if magnitude != 0:
                self.ball_velocity[0] = strength * direction_x / magnitude
                self.ball_velocity[1] = strength * direction_y / magnitude

    def update_ball(self):
        self.ball_pos[0] += self.ball_velocity[0]
        self.ball_pos[1] += self.ball_velocity[1]
        self.ball_velocity[0] *= self.ball_friction
        self.ball_velocity[1] *= self.ball_friction
        if self.ball_pos[0] < self.ball_radius:
            self.ball_pos[0] = self.ball_radius
            self.ball_velocity[0] = -self.ball_velocity[0]
        if self.ball_pos[0] > self.field_width - self.ball_radius:
            self.ball_pos[0] = self.field_width - self.ball_radius
            self.ball_velocity[0] = -self.ball_velocity[0]
        if self.ball_pos[1] < self.ball_radius:
            self.ball_pos[1] = self.ball_radius
            self.ball_velocity[1] = -self.ball_velocity[1]
        if self.ball_pos[1] > self.field_height - self.ball_radius:
            self.ball_pos[1] = self.field_height - self.ball_radius
            self.ball_velocity[1] = -self.ball_velocity[1]

    def is_goal(self, goal_pos):
        return (goal_pos[0] - 20 // 2 <= self.ball_pos[0] <= goal_pos[0] + 20 // 2 and
                goal_pos[1] - 100 // 2 <= self.ball_pos[1] <= goal_pos[1] + 100 // 2)

# Train PPO model
env = FootballEnv()
model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=100000)
model.save("ppo_football")