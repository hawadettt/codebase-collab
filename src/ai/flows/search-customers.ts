'use server';
/**
 * @fileOverview A flow to search for potential customers online.
 *
 * - searchCustomers - A function that handles the customer search process.
 * - SearchCustomersInput - The input type for the searchCustomers function.
 * - SearchCustomersOutput - The return type for the searchCustomers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleSearch } from '@genkit-ai/google-genai';

const SearchCustomersInputSchema = z.object({
  query: z.string().describe('Search query for potential customers (e.g., "fruit importers in Jordan").'),
});
export type SearchCustomersInput = z.infer<typeof SearchCustomersInputSchema>;

const CustomerSchema = z.object({
    clientName: z.string().describe("The name of the trader or customer company."),
    country: z.string().describe("The target country, e.g., Jordan."),
    details: z.string().describe("Additional details about the customer, including potential products of interest."),
    source: z.string().describe("The source URL where the information was found.")
});

const SearchCustomersOutputSchema = z.object({
  customers: z.array(CustomerSchema).describe('A list of potential customers found.'),
});
export type SearchCustomersOutput = z.infer<typeof SearchCustomersOutputSchema>;


export async function searchCustomers(input: SearchCustomersInput): Promise<SearchCustomersOutput> {
  return searchCustomersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchCustomersPrompt',
  input: {schema: SearchCustomersInputSchema},
  output: {schema: SearchCustomersOutputSchema},
  tools: [googleSearch],
  prompt: `You are an expert research assistant for the agricultural import/export industry.
Your task is to find potential customers based on a search query.
Search the web for companies that match the query: "{{query}}".
For each customer you find, provide their company name, their country, any other relevant details, and the source URL.
Present the results as a structured list.`,
});

const searchCustomersFlow = ai.defineFlow(
  {
    name: 'searchCustomersFlow',
    inputSchema: SearchCustomersInputSchema,
    outputSchema: SearchCustomersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
