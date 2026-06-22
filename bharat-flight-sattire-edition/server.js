import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Image generation endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
      {
        headers: { Authorization: `Bearer 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` },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message || 'Image generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
