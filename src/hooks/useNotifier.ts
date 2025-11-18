import { useState } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import { View } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const tools: FunctionDeclaration[] = [
  {
    name: 'navigateToView',
    parameters: {
      type: Type.OBJECT,
      description: 'Navigates to a specific view in the application.',
      properties: {
        view: {
          type: Type.STRING,
          description: 'The view to navigate to.',
          enum: Object.values(View),
        },
      },
      required: ['view'],
    },
  },
  {
    name: 'addMedication',
    parameters: {
        type: Type.OBJECT,
        description: 'Adds a new medication to the user\'s schedule.',
        properties: {
            name: { type: Type.STRING, description: 'The name of the medication.' },
            dosage: { type: Type.STRING, description: 'The dosage, e.g., "1 pill", "10ml".' },
            time: { type: Type.STRING, description: 'The time to take the medication in HH:MM format.' },
        },
        required: ['name', 'dosage', 'time'],
    },
  },
  {
    name: 'markMedicationAsTaken',
    parameters: {
        type: Type.OBJECT,
        description: 'Marks a specific medication as taken for the day.',
        properties: {
            name: { type: Type.STRING, description: 'The name of the medication to mark as taken.' },
        },
        required: ['name'],
    },
  },
  {
    name: 'addAppointment',
    parameters: {
        type: Type.OBJECT,
        description: 'Adds a new appointment to the calendar. The date should be in YYYY-MM-DD format.',
        properties: {
            title: { type: Type.STRING, description: 'The title of the appointment.' },
            date: { type: Type.STRING, description: 'The date of the appointment in YYYY-MM-DD format.' },
            time: { type: Type.STRING, description: 'The time of the appointment in HH:MM format.' },
            location: { type: Type.STRING, description: 'The location of the appointment.' },
        },
        required: ['title', 'date', 'time'],
    },
  },
  {
    name: 'getDailySummary',
    parameters: {
        type: Type.OBJECT,
        description: 'Reads a summary of today\'s remaining medications and upcoming appointments.',
        properties: {},
        required: [],
    },
  },
];

export function useGeminiAssistant() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processTranscript = async (transcript: string) => {
    setIsProcessing(true);
    try {
      const prompt = `The current date is ${new Date().toDateString()}. The user says: "${transcript}"`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: "You are a helpful assistant for a senior care application. Your role is to understand the user's voice commands and translate them into specific function calls. Be concise. Infer dates and times from phrases like 'tomorrow' or 'next week'.",
          tools: [{ functionDeclarations: tools }],
        },
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        return response.functionCalls.map(fc => ({ name: fc.name, args: fc.args }));
      }
      
      if (response.text) {
        return [{ name: 'speak', args: { message: response.text } }];
      }

      return [{ name: 'speak', args: { message: "Sorry, I couldn't understand that. Please try again." } }];

    } catch (error) {
      console.error('Error processing transcript with Gemini:', error);
      return [{ name: 'speak', args: { message: "I'm having trouble connecting. Please try again later." } }];
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, processTranscript };
}