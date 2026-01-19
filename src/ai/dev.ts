import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-codebase-for-errors.ts';
import '@/ai/flows/generate-commit-message.ts';
import '@/ai/flows/suggest-code-improvements.ts';