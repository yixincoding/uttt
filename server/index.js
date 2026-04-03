import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.LLM_API_KEY;
const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';
const BASE_URL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
const TIMEOUT_MS = 10000;

function buildPrompt(payload) {
  const { validMoves, boardDescription, currentPlayer } = payload;
  return {
    system: `You are an Ultimate Tic-Tac-Toe player. You will receive the current board state and a list of valid moves. Pick the best move from the list. Respond concisely with only JSON: { "boardIndex": number, "cellIndex": number }`,
    user: `You are playing as ${currentPlayer.toUpperCase()}.\n\nBoard state:\n${boardDescription}\n\nValid moves:\n${validMoves.map((m, i) => `${i + 1}. board ${m.boardIndex}, cell ${m.cellIndex}`).join('\n')}\n\nPick the best move. Respond with only the JSON.`
  };
}

app.post('/api/ai-move', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'LLM_API_KEY not configured' });
  }

  const { validMoves, boardDescription, currentPlayer } = req.body;
  if (!validMoves || !boardDescription || !currentPlayer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = buildPrompt(req.body);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'LLM API error', details: errText });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    const isValid = validMoves.some(
      m => m.boardIndex === parsed.boardIndex && m.cellIndex === parsed.cellIndex
    );

    if (!isValid) {
      return res.status(200).json({ move: null, fallback: true });
    }

    return res.status(200).json({ move: parsed });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(200).json({ move: null, fallback: true, reason: 'timeout' });
    }
    return res.status(200).json({ move: null, fallback: true, reason: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`UTTT AI server running on port ${PORT}`);
});
