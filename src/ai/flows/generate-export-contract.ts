'use server';
/**
 * @fileOverview A flow to generate a proforma invoice for an export shipment.
 *
 * - generateExportContract - A function that handles the contract generation process.
 * - GenerateExportContractOutput - The return type for the generateExportContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// No input schema needed for this specific request, as the scenario is fixed.

const GenerateExportContractOutputSchema = z.object({
  contractText: z.string().describe('The generated proforma invoice text in markdown format.'),
});
export type GenerateExportContractOutput = z.infer<typeof GenerateExportContractOutputSchema>;

export async function generateExportContract(): Promise<GenerateExportContractOutput> {
  return generateExportContractFlow();
}

const prompt = ai.definePrompt({
  name: 'generateExportContractPrompt',
  output: {schema: GenerateExportContractOutputSchema},
  prompt: `You are an expert in international trade and logistics, specializing in agricultural exports from Egypt to Jordan. Your name is "Nile Key AI Assistant".

  Your task is to generate a professional Proforma Invoice for a shipment of fresh produce.

  **Company:** شركة مفتاح النيل للاستثمار والتجارة الدولية (ذ.م.م)
  **Client:** (A client in Amman, Jordan)
  **Shipment:** Fresh Lettuce and Cabbage
  **Incoterms:** FOB (Free on Board)

  Please generate a detailed Proforma Invoice in Arabic. The invoice should include:
  1.  Header with the company name "شركة مفتاح النيل للاستثمار والتجارة الدولية (ذ.م.م)".
  2.  A section for Buyer and Seller details (leave Buyer details blank for now).
  3.  A table with the following columns: Description, Quantity (kg), Unit Price ($), Total Price ($).
  4.  Populate the table with two items: 'خس طازج' and 'كرنب (كابوتشا)'. Leave quantity and prices blank for manual entry, represented by '______'.
  5.  A section for estimated costs including:
      - تكلفة الشحن الجوي المقدرة (Estimated Air Freight Cost): Leave blank '______'.
      - تكلفة التخليص الجمركي المقدرة (Estimated Customs Clearance Cost): Leave blank '______'.
  6.  A section for bank details for payment. Use placeholder information.
  7.  A signature section for the exporter.
  8.  The document should be titled "فاتورة مبدئية (Proforma Invoice)".
  9.  Use Markdown for formatting, especially for the table.
  `,
});

const generateExportContractFlow = ai.defineFlow(
  {
    name: 'generateExportContractFlow',
    outputSchema: GenerateExportContractOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
