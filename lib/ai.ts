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
  console.log('Max tokens:', maxTokens);
  console.log('Temperature:', temperature);

  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (prompt.length > 5000) {
      throw new Error('Prompt is too long (max 5000 characters)');
    }

    console.log('✅ Input validation passed');

    // Call Blink AI
    console.log('📞 Calling blink.ai.generateText()...');
    
    let response: any;
    try {
      response = await (blink.ai?.generateText || blink.generateText)?.({
        prompt,
        maxTokens,
        temperature,
      });
    } catch (sdkError) {
      console.error('❌ SDK method not found or failed', sdkError);
      throw new Error('AI service not properly configured');
    }

    console.log('📦 Raw response received:', response);

    // Handle various response formats
    if (!response) {
      throw new Error('Empty response from API');
    }

    // Check for error in response
    if (response.error) {
      const errorMsg = typeof response.error === 'object' 
        ? response.error.message || JSON.stringify(response.error)
        : response.error;
      throw new Error(`API Error: ${errorMsg}`);
    }

    // Extract text from response
    const generatedText = response.text || response.content || response.data?.text;

    if (!generatedText) {
      console.warn('⚠️ Response received but no text field found');
      console.warn('Response keys:', Object.keys(response));
      throw new Error('No text in API response');
    }

    console.log('✅ Successfully generated text, length:', generatedText.length);

    return {
      success: true,
      text: generatedText,
      source: 'api',
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error('❌ AI Generation Error:', errorMessage);
    console.error('Full error:', error);

    // Return error with meaningful message
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
  try {
    const str = JSON.stringify(error);
    if (str && str !== '{}' && str.length < 200) {
      return str;
    }
  } catch (e) {
    // Ignore
  }

  return 'Text generation failed. Please try again.';
}
