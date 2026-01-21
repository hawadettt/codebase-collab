'use server';
/**
 * @fileOverview A flow to search for potential suppliers online.
 *
 * - searchSuppliers - A function that handles the supplier search process.
 * - SearchSuppliersInput - The input type for the searchSuppliers function.
 * - SearchSuppliersOutput - The return type for the searchSuppliers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchSuppliersInputSchema = z.object({
  query: z.string().describe('Search query for agricultural suppliers (e.g., "lettuce farms in Egypt").'),
});
export type SearchSuppliersInput = z.infer<typeof SearchSuppliersInputSchema>;

const SupplierSchema = z.object({
    farmName: z.string().describe("The name of the farm or supplier."),
    cropType: z.string().describe("The type of crop they supply."),
    location: z.string().describe("Geographical location of the supplier."),
    contactNumber: z.string().describe("Contact phone number for the supplier (if available)."),
    source: z.string().describe("The source URL where the information was found.")
});

const SearchSuppliersOutputSchema = z.object({
  suppliers: z.array(SupplierSchema).describe('A list of potential suppliers found.'),
});
export type SearchSuppliersOutput = z.infer<typeof SearchSuppliersOutputSchema>;


export async function searchSuppliers(input: SearchSuppliersInput): Promise<SearchSuppliersOutput> {
  return searchSuppliersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchSuppliersPrompt',
  input: {schema: SearchSuppliersInputSchema},
  output: {schema: SearchSuppliersOutputSchema},
  prompt: `You are an expert research assistant for the agricultural import/export industry.
Your task is to find potential suppliers based on a search query.
Search the web for agricultural suppliers that match the query: "{{query}}".
For each supplier you find, provide their farm name, the crops they supply, their location, a contact number if available, and the source URL.
Present the results as a structured list.`,
});

const searchSuppliersFlow = ai.defineFlow(
  {
    name: 'searchSuppliersFlow',
    inputSchema: SearchSuppliersInputSchema,
    outputSchema: SearchSuppliersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
