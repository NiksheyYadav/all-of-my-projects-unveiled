import numpy as np
from stable_baselines3 import PPO
from train_rl_football import FootballEnv
import json

# Load the trained model
model = PPO.load("ppo_football.zip")

# Create the environment
env = FootballEnv()

obs = env.reset()
done = False
total_reward = 0
step_count = 0
trajectory = []
MAX_STEPS = 5000  # Prevent infinite loops

while not done and step_count < MAX_STEPS:
    action, _states = model.predict(obs, deterministic=True)
    obs_next, reward, done, info = env.step(action)
    trajectory.append({
        'step': step_count,
        'obs': obs.tolist(),
        'action': action.tolist() if hasattr(action, 'tolist') else list(action),
        'reward': reward,
        'done': done
    })
    obs = obs_next
    total_reward += reward
    step_count += 1
    print(f"Step: {step_count}, Obs: {obs}, Reward: {reward}, Done: {done}")

if step_count >= MAX_STEPS:
    print(f"Stopped after {MAX_STEPS} steps to prevent infinite loop.")

print(f"Episode finished in {step_count} steps with total reward {total_reward}")

# Export trajectory to JSON
with open('ppo_football_trajectory.json', 'w') as f:
    json.dump(trajectory, f)
print('Trajectory saved to ppo_football_trajectory.json')
