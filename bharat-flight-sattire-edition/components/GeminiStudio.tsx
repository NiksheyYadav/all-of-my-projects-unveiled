import React, { useState } from 'react';
import { generateCampaignImage } from '../services/geminiService';
import { AspectRatio } from '../types';

interface GeminiStudioProps {
  onClose: () => void;
}

const GeminiStudio: React.FC<GeminiStudioProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);
    
    const fullPrompt = `Cartoon style digital art of ${prompt}, vibrant colors, indian political satire theme, high quality`;
    const result = await generateCampaignImage(fullPrompt, aspectRatio);
    
    setGeneratedImage(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
        
        {/* Controls */}
        <div className="w-full md:w-1/3 p-6 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Gemini Art Studio
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>

          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Creative Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A politician flying over the Lotus Temple..."
                className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(AspectRatio).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 px-3 text-xs rounded border ${
                      aspectRatio === ratio 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-4 mt-6 rounded-lg font-bold text-white shadow-lg transition-all ${
              loading || !prompt 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
            }`}
          >
            {loading ? 'Generating...' : 'Generate with Gemini'}
          </button>
        </div>

        {/* Preview */}
        <div className="w-full md:w-2/3 bg-gray-900 relative flex items-center justify-center p-8">
          {loading && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-400 animate-pulse">Creating masterpiece...</p>
            </div>
          )}
          
          {!loading && !generatedImage && (
            <div className="text-center text-gray-600">
              <span className="material-icons text-6xl mb-2 block">palette</span>
              <p>Enter a prompt to generate custom background art</p>
            </div>
          )}

          {generatedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={generatedImage} 
                alt="Generated Art" 
                className="max-w-full max-h-full object-contain rounded shadow-2xl"
              />
              <a 
                href={generatedImage} 
                download="campaign-poster.png"
                className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiStudio;