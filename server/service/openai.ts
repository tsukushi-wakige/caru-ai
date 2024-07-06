import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_BASE_URL } from './envValues';
export const openai = new OpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: OPENAI_API_KEY,
});
