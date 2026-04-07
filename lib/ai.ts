/**
 * AI Generation Utility
 * Wrapper around Blink SDK with better error handling and fallback support
 */

import { blink } from './blink';

export interface AIGenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIGenerationResult {
  success: boolean;
  text?: string;
  error?: string;
  source: 'api' | 'fallback';
}

/**
 * Generate text using Blink AI with comprehensive error handling
 */
export async function generateTextWithFallback(
  options: AIGenerationOptions
): Promise<AIGenerationResult> {
  const { prompt, maxTokens = 800, temperature = 0.7 } = options;

  console.log('🚀 Starting AI text generation');
  console.log('Prompt length:', prompt.length);

  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (prompt.length > 5000) {
      throw new Error('Prompt is too long (max 5000 characters)');
    }

    console.log('✅ Input validation passed');
    console.log('Blink object:', typeof blink);
    console.log('Blink keys:', Object.keys(blink || {}).slice(0, 10));

    // Try multiple ways to call the API
    let response: any = null;

    try {
      // Try method 1: blink.ai.generateText()
      if (blink?.ai?.generateText) {
        console.log('📞 Trying blink.ai.generateText()...');
        response = await blink.ai.generateText({
          prompt,
          maxTokens,
          temperature,
        });
      }
      // Try method 2: blink.generateText()
      else if (typeof blink?.generateText === 'function') {
        console.log('📞 Trying blink.generateText()...');
        response = await blink.generateText({
          prompt,
          maxTokens,
          temperature,
        });
      }
      // Try method 3: Direct API call (if exposed)
      else if (blink?.api?.generateText) {
        console.log('📞 Trying blink.api.generateText()...');
        response = await blink.api.generateText({
          prompt,
          maxTokens,
          temperature,
        });
      }
      else {
        console.warn('⚠️ No generateText method found on blink object');
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(blink || {})));
        throw new Error('AI service not available - method not found');
      }
    } catch (methodError) {
      console.error('❌ Method call failed:', methodError);
      throw methodError;
    }

    console.log('📦 Raw response received:', response);
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response || {}).slice(0, 10));

    // Handle empty response
    if (!response) {
      throw new Error('Empty response from API');
    }

    // Check for error in response
    if (response.error) {
      const errorMsg = typeof response.error === 'object' 
        ? response.error.message || JSON.stringify(response.error)
        : String(response.error);
      throw new Error(`API Error: ${errorMsg}`);
    }

    // Try multiple text extraction paths
    const generatedText = 
      response.text ||
      response.content ||
      response.message ||
      response.data?.text ||
      response.data?.content ||
      response.result ||
      response.output ||
      (typeof response === 'string' ? response : null);

    if (!generatedText) {
      console.warn('⚠️ Response received but no text field found');
      console.warn('Response keys:', Object.keys(response));
      console.warn('Full response:', JSON.stringify(response));
      throw new Error('No text in API response - response format not recognized');
    }

    console.log('✅ Successfully generated text, length:', String(generatedText).length);

    return {
      success: true,
      text: String(generatedText),
      source: 'api',
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error('❌ AI Generation Error:', errorMessage);
    console.error('Full error object:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'N/A');

    // Return error result (caller will use fallback)
    return {
      success: false,
      error: errorMessage,
      source: 'fallback',
    };
  }
}

/**
 * Extract meaningful error message from various error formats
 */
function extractErrorMessage(error: any): string {
  try {
    // String error
    if (typeof error === 'string') {
      return error;
    }

    // Error object
    if (error instanceof Error) {
      return error.message;
    }

    // Object with message property
    if (error?.message) {
      return String(error.message);
    }

    // Object with text property
    if (error?.text) {
      return String(error.text);
    }

    // Nested error object
    if (error?.error) {
      if (typeof error.error === 'string') {
        return String(error.error);
      }
      if (error.error?.message) {
        return String(error.error.message);
      }
    }

    // Response error
    if (error?.response) {
      if (error.response.message) {
        return String(error.response.message);
      }
      if (error.response.text) {
        return String(error.response.text);
      }
      if (error.response.error) {
        return extractErrorMessage(error.response.error);
      }
    }

    // Try JSON stringify as last resort
    const str = JSON.stringify(error);
    if (str && str !== '{}' && str.length < 300) {
      return str;
    }
  } catch (e) {
    // Ignore stringify errors
  }

  return 'Text generation failed. Please try again.';
}
