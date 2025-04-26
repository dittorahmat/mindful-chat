'use server';
/**
 * @fileOverview An AI agent that provides supportive and personalized feedback based on user chat messages.
 *
 * - provideAiFeedback - A function that handles the process of providing AI feedback.
 * - ProvideAiFeedbackInput - The input type for the provideAiFeedback function.
 * - ProvideAiFeedbackOutput - The return type for the provideAiFeedback function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ProvideAiFeedbackInputSchema = z.object({
  chatMessages: z
    .string()
    .describe('The complete history of chat messages from the user.'),
});
export type ProvideAiFeedbackInput = z.infer<typeof ProvideAiFeedbackInputSchema>;

const ProvideAiFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'Supportive and personalized feedback based on the user\'s chat messages, offering insights and coping strategies.'
    ),
});
export type ProvideAiFeedbackOutput = z.infer<typeof ProvideAiFeedbackOutputSchema>;

export async function provideAiFeedback(input: ProvideAiFeedbackInput): Promise<ProvideAiFeedbackOutput> {
  return provideAiFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAiFeedbackPrompt',
  input: {
    schema: z.object({
      chatMessages: z
        .string()
        .describe('The complete history of chat messages from the user.'),
    }),
  },
  output: {
    schema: z.object({
      feedback: z
        .string()
        .describe(
          'Supportive and personalized feedback based on the user\'s chat messages, offering insights and coping strategies.'
        ),
    }),
  },
  prompt: `You are a mental health therapy assistant. Analyze the user's chat messages and provide supportive and personalized feedback, offering insights and coping strategies.

Chat Messages: {{{chatMessages}}}

Feedback:`,
});

const provideAiFeedbackFlow = ai.defineFlow<
  typeof ProvideAiFeedbackInputSchema,
  typeof ProvideAiFeedbackOutputSchema
>({
  name: 'provideAiFeedbackFlow',
  inputSchema: ProvideAiFeedbackInputSchema,
  outputSchema: ProvideAiFeedbackOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
