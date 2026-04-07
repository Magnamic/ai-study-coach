import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Container, Card, Button, Input } from '@/components/ui';
import { generateTextWithFallback } from '@/lib/ai';

type Mode = 'explain' | 'summarize';

// Fallback responses for demo purposes
const generateFallbackResponse = (mode: Mode, input: string): string => {
  if (mode === 'explain') {
    return `📚 Explanation of "${input.substring(0, 50)}"\n\n` +
      `Here's a simple breakdown:\n\n` +
      `• Key Concept 1: This is an important foundational idea\n` +
      `• Key Concept 2: This builds upon the first concept\n` +
      `• Real-World Example: Think of it like an everyday situation you know\n` +
      `• Why It Matters: Understanding this helps you grasp related concepts\n` +
      `• Pro Tip: The main idea is easier to remember when you connect it to what you already know\n\n` +
      `Feel free to ask if you need more details or examples!`;
  } else {
    const firstLine = input.split('\n')[0]?.substring(0, 80) || 'Main topic';
    return `📝 Summary\n\n` +
      `Main Points:\n` +
      `• ${firstLine}\n` +
      `• This represents another important takeaway from the text\n` +
      `��� Additional key information to remember\n` +
      `• Final important concept to understand\n` +
      `• How these ideas connect together\n\n` +
      `💡 Key Takeaway: Focus on understanding how these main ideas relate and support each other.`;
  }
};

export default function LearnScreen() {
  const [mode, setMode] = useState<Mode>('explain');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [usedFallback, setUsedFallback] = useState(false);

  const handleAction = async () => {
    if (!input.trim()) {
      setError('Please enter some text first');
      return;
    }

    setError('');
    setIsProcessing(true);
    setResult('');
    setUsedFallback(false);

    try {
      const prompt = mode === 'explain' 
        ? `Explain the following topic in simple, easy-to-understand terms suitable for a high school student. Use examples, bullet points, and analogies to make it clear:\n\n"${input}"`
        : `Summarize the following text into key bullet points. Reduce the content by about 50% while keeping all essential facts. Format as bullet points for easy memorization:\n\n"${input}"`;

      // Call our AI utility function
      const aiResult = await generateTextWithFallback({ 
        prompt,
        maxTokens: 800,
        temperature: 0.7,
      });

      if (aiResult.success && aiResult.text) {
        console.log('✅ Using API response');
        setResult(aiResult.text);
      } else {
        console.log('⚠️ API failed, using fallback');
        setError(aiResult.error || 'Could not reach AI service');
        setResult(generateFallbackResponse(mode, input));
        setUsedFallback(true);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setResult(generateFallbackResponse(mode, input));
      setUsedFallback(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setInput('');
    setResult('');
    setError('');
    setUsedFallback(false);
  };

  return (
    <Container safeArea edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <Pressable 
            style={[styles.modeButton, mode === 'explain' && styles.modeButtonActive]} 
            onPress={() => { setMode('explain'); setResult(''); setError(''); setUsedFallback(false); }}
          >
            <Ionicons name="bulb-outline" size={20} color={mode === 'explain' ? colors.white : colors.textSecondary} />
            <Text style={[styles.modeButtonText, mode === 'explain' && styles.modeButtonTextActive]}>Explain</Text>
          </Pressable>
          <Pressable 
            style={[styles.modeButton, mode === 'summarize' && styles.modeButtonActive]} 
            onPress={() => { setMode('summarize'); setResult(''); setError(''); setUsedFallback(false); }}
          >
            <Ionicons name="document-text-outline" size={20} color={mode === 'summarize' ? colors.white : colors.textSecondary} />
            <Text style={[styles.modeButtonText, mode === 'summarize' && styles.modeButtonTextActive]}>Summarize</Text>
          </Pressable>
        </View>

        {/* Input Card */}
        <Card style={styles.inputCard}>
          <Card.Content>
            <Text style={styles.label}>
              {mode === 'explain' ? 'Enter a topic to understand:' : 'Paste your long notes here:'}
            </Text>
            <Input
              multiline
              numberOfLines={6}
              placeholder={mode === 'explain' ? "e.g., Photosynthesis, Calculus limits, WWII causes..." : "Paste your text here..."}
              value={input}
              onChangeText={setInput}
              textAlignVertical="top"
              containerStyle={styles.input}
            />
            <View style={styles.actions}>
              <Button variant="ghost" onPress={reset}>Clear</Button>
              <Button 
                variant="primary" 
                onPress={handleAction} 
                loading={isProcessing}
                disabled={!input.trim() || isProcessing}
              >
                {mode === 'explain' ? 'Explain It' : 'Summarize'}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Error Display */}
        {error && !isProcessing && (
          <Card style={styles.errorCard}>
            <Card.Content>
              <View style={styles.errorContent}>
                <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
              {usedFallback && (
                <Text style={styles.errorNote}>Showing demo response instead</Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Loading State */}
        {isProcessing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}

        {/* Result Display */}
        {result && !isProcessing && (
          <Card style={styles.resultCard} variant="elevated">
            <Card.Header>
              <View style={styles.resultHeader}>
                <Ionicons name="sparkles" size={20} color={colors.accent} />
                <Text style={styles.resultTitle}>
                  {mode === 'explain' ? 'Simple Explanation' : 'Smart Summary'}
                </Text>
                {usedFallback && (
                  <View style={styles.demoBadge}>
                    <Text style={styles.demoBadgeText}>Demo</Text>
                  </View>
                )}
              </View>
            </Card.Header>
            <Card.Content>
              <Text style={styles.resultText}>{result}</Text>
            </Card.Content>
            <Card.Footer>
              <Button variant="outline" size="sm" onPress={reset}>New Input</Button>
            </Card.Footer>
          </Card>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderDarkMode,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: colors.white,
  },
  inputCard: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.borderDarkMode,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.borderDarkMode,
    borderWidth: 1,
    minHeight: 120,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  errorCard: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: '#FF3B30',
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: '#FF3B30',
    flex: 1,
  },
  errorNote: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  resultCard: {
    backgroundColor: colors.backgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  demoBadge: {
    backgroundColor: colors.warningTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  demoBadgeText: {
    ...typography.tiny,
    color: colors.warning,
    fontWeight: '600',
  },
  resultText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
});
