# models/ml_strategy.py

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from typing import Dict, Tuple

class MLStrategy:
    def __init__(self):
        self.scaler = StandardScaler()
        self.lstm_model = None
        self.rf_model = None
        self.xgb_model = None

    def prepare_features(self, data: pd.DataFrame, indicators: Dict) -> np.ndarray:
        """Prepare feature matrix for ML models"""
        features = []

        # Price features
        features.extend([
            data['close'].pct_change().fillna(0),
            data['high'].pct_change().fillna(0),
            data['low'].pct_change().fillna(0),
            data['volume'].pct_change().fillna(0)
        ])

        # Technical indicators
        for key, values in indicators.items():
            if len(values) == len(data):
                features.append(pd.Series(values).fillna(method='ffill'))

        feature_matrix = np.column_stack(features)
        return self.scaler.fit_transform(feature_matrix)

    def build_lstm_model(self, input_shape: Tuple[int, int]) -> tf.keras.Model:
        """Build LSTM model for time series prediction"""
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(25),
            Dense(1, activation='sigmoid')
        ])

        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        return model

    def train_lstm(self, X_train: np.ndarray, y_train: np.ndarray, 
                   X_val: np.ndarray, y_val: np.ndarray):
        """Train LSTM model"""
        self.lstm_model = self.build_lstm_model((X_train.shape[1], X_train.shape[2]))
        history = self.lstm_model.fit(
            X_train, y_train,
            epochs=100,
            batch_size=32,
            validation_data=(X_val, y_val),
            verbose=1
        )
        return history

    def train_ensemble_models(self, X_train: np.ndarray, y_train: np.ndarray):
        """Train Random Forest and XGBoost models"""
        self.rf_model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.rf_model.fit(X_train, y_train)

        self.xgb_model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        self.xgb_model.fit(X_train, y_train)

    def generate_ml_signals(self, X_current: np.ndarray) -> Dict[str, float]:
        """Generate signals from all ML models"""
        signals = {}

        if self.lstm_model:
            lstm_pred = self.lstm_model.predict(X_current.reshape(1, -1, X_current.shape[-1]))
            signals['lstm'] = lstm_pred[0][0]

        if self.rf_model:
            rf_pred = self.rf_model.predict_proba(X_current.reshape(1, -1))
            signals['random_forest'] = rf_pred[0][1]

        if self.xgb_model:
            xgb_pred = self.xgb_model.predict_proba(X_current.reshape(1, -1))
            signals['xgboost'] = xgb_pred[0][1]

        return signals
