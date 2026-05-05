import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Container, Card, Button, Input } from '@/components/ui';
import { generateTextWithOpenAI } from '@/lib/openai';

type Mode = 'explain' | 'summarize';

export default function LearnScreen() {
  const [mode, setMode] = useState<Mode>('explain');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    if (!input.trim()) {
      setError('Please enter some text first');
      return;
    }

    setError('');
    setIsProcessing(true);
    setResult('');

    try {
      const prompt = mode === 'explain' 
        ? `Explain the following topic in simple, easy-to-understand terms suitable for a high school student. Use examples, bullet points, and analogies to make it clear:\n\n"${input}"`
        : `Summarize the following text into key bullet points. Reduce the content by about 50% while keeping all essential facts. Format as bullet points for easy memorization:\n\n"${input}"`;

      const aiResult = await generateTextWithOpenAI({ 
        prompt,
        maxTokens: 800,
        temperature: 0.7,
      });

      if (aiResult.success && aiResult.text) {
        console.log('✅ Generated response');
        setResult(aiResult.text);
      } else {
        setError(aiResult.error || 'Could not generate response');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setInput('');
    setResult('');
    setError('');
  };

  return (
    <Container safeArea edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Study Coach</Text>
          <Text style={styles.subtitle}>Get instant explanations and summaries</Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <Pressable 
            style={[styles.modeButton, mode === 'explain' && styles.modeButtonActive]} 
            onPress={() => { setMode('explain'); setResult(''); setError(''); }}
          >
            <Ionicons name="bulb-outline" size={20} color={mode === 'explain' ? colors.white : colors.textSecondary} />
            <Text style={[styles.modeButtonText, mode === 'explain' && styles.modeButtonTextActive]}>Explain</Text>
          </Pressable>
          <Pressable 
            style={[styles.modeButton, mode === 'summarize' && styles.modeButtonActive]} 
            onPress={() => { setMode('summarize'); setResult(''); setError(''); }}
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

        {/* Error/Info Display */}
        {error && !isProcessing && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.errorContent}>
                <Ionicons name="information-circle" size={20} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Loading State */}
        {isProcessing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Generating response...</Text>
          </View>
        )}

        {/* Result Display */}
        {result && !isProcessing && (
          <Card style={styles.resultCard}>
            <Card.Header>
              <View style={styles.resultHeader}>
                <Ionicons name="sparkles" size={20} color={colors.accent} />
                <Text style={styles.resultTitle}>
                  {mode === 'explain' ? 'Explanation' : 'Summary'}
                </Text>
              </View>
            </Card.Header>
            <Card.Content>
              <Text style={styles.resultText}>{result}</Text>
            </Card.Content>
            <Card.Footer>
              <Button variant="outline" size="sm" onPress={reset}>Try Another</Button>
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
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
  infoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.error,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    flex: 1,
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
  resultText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
});
