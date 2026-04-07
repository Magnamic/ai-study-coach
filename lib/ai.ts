/**
 * AI Generation Utility
 * For now, uses fallback responses since Blink AI SDK is not properly configured
 * in the Blink Editor environment
 */

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
 * Generate demo/fallback responses 
 * Note: Real API integration pending proper Blink SDK setup
 */
export async function generateTextWithFallback(
  options: AIGenerationOptions
): Promise<AIGenerationResult> {
  const { prompt } = options;

  console.log('🚀 AI Generation Request');
  console.log('Prompt length:', prompt.length);

  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (prompt.length > 5000) {
      throw new Error('Prompt is too long (max 5000 characters)');
    }

    // For now, return demo responses
    // This allows the app to function while Blink API is configured
    console.log('📝 Using demo response (API integration pending)');

    const demoResponse = generateDemoResponse(prompt);

    return {
      success: true,
      text: demoResponse,
      source: 'fallback',
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.error('❌ Error:', errorMessage);

    return {
      success: false,
      error: errorMessage,
      source: 'fallback',
    };
  }
}

/**
 * Generate intelligent demo responses based on the prompt
 */
function generateDemoResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  const topic = extractTopic(prompt);

  // Check if it's an explain request
  if (prompt.includes('Explain') || lower.includes('simple')) {
    return `📚 **Explanation of ${topic}**\n\n` +
      `**Key Concepts:**\n` +
      `• **Foundational Idea**: ${topic} is built on several important principles that work together\n` +
      `• **Core Mechanism**: The main way ${topic} works involves understanding how different parts connect\n` +
      `• **Real-World Application**: In everyday life, you might encounter ${topic} when...\n` +
      `• **Why It Matters**: Understanding ${topic} helps you grasp related concepts and see patterns\n` +
      `• **Common Misconception**: Many people think ${topic} is just one thing, but it's actually more complex\n\n` +
      `**Pro Tips for Learning:**\n` +
      `→ Break it down into smaller pieces\n` +
      `→ Look for connections to things you already know\n` +
      `→ Practice applying it in different contexts\n\n` +
      `Feel free to ask for clarification on any part!`;
  }

  // Check if it's a summarize request
  if (prompt.includes('Summarize') || lower.includes('summary') || lower.includes('bullet')) {
    return `📝 **Summary of Key Points**\n\n` +
      `**Main Ideas:**\n` +
      `• **Primary Point**: ${topic} is centered around one or more key ideas\n` +
      `• **Supporting Evidence**: These ideas are supported by research and examples\n` +
      `• **Practical Application**: This applies to real situations and problems\n` +
      `• **Related Concepts**: Similar ideas include related fields or topics\n` +
      `• **Conclusion**: Understanding these points gives you a solid foundation\n\n` +
      `**Quick Reference:**\n` +
      `✓ Remember the main 3-4 concepts\n` +
      `✓ See how they connect to each other\n` +
      `✓ Think of real examples you know\n\n` +
      `**💡 Key Takeaway**: Focus on understanding the relationships between ideas rather than memorizing individual facts.`;
  }

  // Default response
  return `📚 **Response about ${topic}**\n\n` +
    `**Overview:**\n` +
    `• Main concept relates to the topic you asked about\n` +
    `• Multiple aspects work together to create understanding\n` +
    `• Different perspectives can enhance learning\n` +
    `• Practical examples help cement understanding\n` +
    `• Building connections strengthens memory\n\n` +
    `**Learning Approach:**\n` +
    `1. Start with the basics\n` +
    `2. Gradually add complexity\n` +
    `3. Connect to existing knowledge\n` +
    `4. Practice with examples\n` +
    `5. Teach it to someone else\n\n` +
    `This demo response shows what real explanations will look like once the AI service is fully integrated!`;
}

/**
 * Extract the main topic from the prompt
 */
function extractTopic(prompt: string): string {
  // Remove common words and extract main topic
  const cleaned = prompt
    .replace(/explain|summarize|describe|discuss|topic|text|note/gi, '')
    .replace(/["\n]/g, '')
    .trim();

  if (cleaned.length === 0) {
    return 'the subject';
  }

  // Take first meaningful chunk
  const words = cleaned.split(/\s+/);
  return words.slice(0, Math.min(3, words.length)).join(' ');
}

/**
 * Extract meaningful error message from various error formats
 */
function extractErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error?.message) {
    return String(error.message);
  }

  return 'Unable to process request. Please try again.';
}
