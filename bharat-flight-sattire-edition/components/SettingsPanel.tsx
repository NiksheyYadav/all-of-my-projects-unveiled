import React, { useState } from 'react';
import { GameSettings, DEFAULT_SETTINGS } from '../types';

interface SettingsPanelProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'graphics' | 'audio' | 'gameplay' | 'accessibility'>('graphics');

  const update = (category: keyof GameSettings, key: string, value: any) => {
    onUpdateSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    });
  };

  const renderTabButton = (id: typeof activeTab, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors ${
        activeTab === id 
        ? 'bg-orange-600 text-white border-b-4 border-orange-800' 
        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="flex border-b border-gray-700">
          {renderTabButton('graphics', 'Graphics')}
          {renderTabButton('audio', 'Audio')}
          {renderTabButton('gameplay', 'Gameplay')}
          {renderTabButton('accessibility', 'Access')}
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'graphics' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quality Preset</label>
                <div className="grid grid-cols-4 gap-2">
                  {['low', 'medium', 'high', 'ultra'].map((q) => (
                    <button
                      key={q}
                      onClick={() => update('graphics', 'quality', q)}
                      className={`py-2 rounded text-sm capitalize ${
                        settings.graphics.quality === q ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Particle Effects</span>
                <input 
                  type="checkbox" 
                  checked={settings.graphics.particles} 
                  onChange={(e) => update('graphics', 'particles', e.target.checked)}
                  className="w-5 h-5 accent-blue-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Screen Shake</span>
                <input 
                  type="checkbox" 
                  checked={settings.graphics.screenShake} 
                  onChange={(e) => update('graphics', 'screenShake', e.target.checked)}
                  className="w-5 h-5 accent-blue-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Master Volume ({Math.round(settings.audio.masterVolume * 100)}%)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.audio.masterVolume}
                  onChange={(e) => update('audio', 'masterVolume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Music Selection</label>
                <select className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600">
                  <option>Bollywood Beats (Instrumental)</option>
                  <option>Classical Fusion</option>
                  <option>Pehla Nasha (Cover)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Audio Visualizer</span>
                <input 
                  type="checkbox" 
                  checked={settings.audio.visualizer} 
                  onChange={(e) => update('audio', 'visualizer', e.target.checked)}
                  className="w-5 h-5 accent-green-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'gameplay' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'normal', 'hard'].map((d) => (
                    <button
                      key={d}
                      onClick={() => update('gameplay', 'difficulty', d)}
                      className={`py-2 rounded text-sm capitalize ${
                        settings.gameplay.difficulty === d ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Show Trajectory (Assist)</span>
                <input 
                  type="checkbox" 
                  checked={settings.gameplay.showTrajectory} 
                  onChange={(e) => update('gameplay', 'showTrajectory', e.target.checked)}
                  className="w-5 h-5 accent-purple-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color Blind Mode</label>
                <select 
                  value={settings.accessibility.colorBlindMode}
                  onChange={(e) => update('accessibility', 'colorBlindMode', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
                >
                  <option value="none">None</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Reduced Motion</span>
                <input 
                  type="checkbox" 
                  checked={settings.accessibility.reducedMotion} 
                  onChange={(e) => update('accessibility', 'reducedMotion', e.target.checked)}
                  className="w-5 h-5 accent-yellow-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded shadow-lg"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;