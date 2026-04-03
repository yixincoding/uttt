import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.LLM_API_KEY;
const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';
const BASE_URL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
const TIMEOUT_MS = 60000;

function buildPrompt(payload) {
  const { validMoves, boardDescription, currentPlayer } = payload;
  return {
    system: `You are an Ultimate Tic-Tac-Toe player. You will receive the current board state and a list of valid moves. Pick the best move from the list. Respond concisely with only JSON: { "boardIndex": number, "cellIndex": number, "reasoning": string }`,
    user: `You are playing as ${currentPlayer.toUpperCase()}.\n\nBoard state:\n${boardDescription}\n\nValid moves:\n${validMoves.map((m, i) => `${i + 1}. board ${m.boardIndex}, cell ${m.cellIndex}`).join('\n')}\n\nPick the best move and briefly explain your reasoning. Respond with only the JSON.`
  };
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
  });
  next();
});

app.post('/api/ai-move', async (req, res) => {
  if (!API_KEY) {
    console.error('[ERROR] LLM_API_KEY not configured');
    return res.status(500).json({ error: 'LLM_API_KEY not configured' });
  }

  const { validMoves, boardDescription, currentPlayer } = req.body;
  if (!validMoves || !boardDescription || !currentPlayer) {
    console.error('[ERROR] Missing required fields in request body');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = buildPrompt(req.body);
  const moveCount = validMoves.length;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[REQUEST] Player: ${currentPlayer.toUpperCase()}, Valid moves: ${moveCount}, Model: ${MODEL}`);
  console.log(`[PROMPT] System:\n${prompt.system}`);
  console.log(`[PROMPT] User:\n${prompt.user}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const llmStart = Date.now();
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
    const llmMs = Date.now() - llmStart;

    console.log(`[LLM] Response status: ${response.status}, Time: ${llmMs}ms`);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[LLM ERROR] ${response.status}: ${errText}`);
      return res.status(502).json({ error: 'LLM API error', details: errText });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log(`[LLM] Raw response:\n${content}`);

    const parsed = JSON.parse(content);
    console.log(`[LLM] Parsed move: board ${parsed.boardIndex}, cell ${parsed.cellIndex}`);
    if (parsed.reasoning) {
      console.log(`[LLM] Reasoning: ${parsed.reasoning}`);
    }

    const isValid = validMoves.some(
      m => m.boardIndex === parsed.boardIndex && m.cellIndex === parsed.cellIndex
    );

    if (!isValid) {
      console.warn(`[WARN] LLM returned invalid move (${parsed.boardIndex}, ${parsed.cellIndex}), triggering fallback`);
      return res.status(200).json({ move: null, fallback: true });
    }

    console.log(`[OK] Returning move: board ${parsed.boardIndex}, cell ${parsed.cellIndex}`);
    return res.status(200).json({ move: { boardIndex: parsed.boardIndex, cellIndex: parsed.cellIndex }, reasoning: parsed.reasoning || null });
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`[ERROR] LLM request timed out after ${TIMEOUT_MS}ms`);
      return res.status(200).json({ move: null, fallback: true, reason: 'timeout' });
    }
    console.error(`[ERROR] ${err.message}`);
    return res.status(200).json({ move: null, fallback: true, reason: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`UTTT AI server running on port ${PORT}`);
  console.log(`Model: ${MODEL}, Base URL: ${BASE_URL}, Timeout: ${TIMEOUT_MS}ms`);
  console.log(`API key: ${API_KEY ? '***' + API_KEY.slice(-4) : 'NOT SET'}`);
});
