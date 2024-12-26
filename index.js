import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const app = express();
const port = 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// configure a Genkit instance
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // set default model
});

const codeFlow = ai.defineFlow('customSolidityAndCairo', async (input) => {
  // make a generation request
  const { text } = await ai.generate(input);
  return text;
});

app.post('/generate', async (req, res) => {
  const input = req.body.input;
  if (!input) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await codeFlow(input);
    res.json({ response: result });
  } catch (error) {
    res.status(500).json({ error: 'Error generating text' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
