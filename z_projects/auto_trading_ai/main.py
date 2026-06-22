from data.data_manager import DataManager
from strategies.rule_based import TechnicalIndicators, RuleBasedStrategy

# Get and clean historical data
data_manager = DataManager()
df = data_manager.get_historical_data(symbol="RELIANCE", days=100)

# Calculate indicators
indicators = TechnicalIndicators(df).calculate_indicators()

# Apply strategy
strategy = RuleBasedStrategy(name="EMA_Crossover")
signal = strategy.ema_crossover_strategy(indicators)

print(f"Trade signal: {signal}")



from models.ml_strategy import MLStrategy

data_manager = DataManager()
df = data_manager.get_historical_data("RELIANCE", days=100)

# Extract indicators
indicators = TechnicalIndicators(df).calculate_indicators()

# Prepare features
ml = MLStrategy()
X = ml.prepare_features(df, indicators)

# Split and train (mocked labels for example)
y = (df['close'].pct_change().shift(-1) > 0).astype(int).fillna(0)  # Binary target
ml.train_ensemble_models(X[:-1], y[:-1])

# Generate signals from last row
signal = ml.generate_ml_signals(X[-1])
print("ML Signals:", signal)
