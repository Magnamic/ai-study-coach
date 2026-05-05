import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';
import { Container, Card, Button } from '@/components/ui';
import { generateTextWithOpenAI } from '@/lib/openai';

export default function Dashboard() {
  const { data: motivation, isLoading: motivationLoading, refetch: refetchMotivation } = useQuery({
    queryKey: ['motivation'],
    queryFn: async () => {
      const result = await generateTextWithOpenAI({
        prompt: "Give me a short, powerful motivational message for a high school student who wants to succeed. Keep it to 1-2 sentences.",
        maxTokens: 50
      });
      return result.success ? result.text : 'You have the power to achieve your goals. Start today!';
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const onRefresh = React.useCallback(() => {
    refetchMotivation();
  }, [refetchMotivation]);

  return (
    <Container safeArea edges={['bottom']}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={motivationLoading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome Back!</Text>
          <Text style={styles.subGreeting}>Let's make today productive.</Text>
        </View>

        <Card variant="elevated" style={styles.motivationCard}>
          <Card.Content>
            <Ionicons name="sparkles" size={24} color={colors.accent} style={styles.sparkleIcon} />
            <Text style={styles.motivationText}>
              {motivationLoading ? 'Getting your daily boost...' : motivation}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Learn & Master</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Use our AI Study Coach to explain topics, summarize notes, and create study plans tailored to your needs.
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Button 
              variant="outline" 
              style={styles.actionButton}
              onPress={() => {}}
            >
              <Ionicons name="bulb-outline" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}> Explain</Text>
            </Button>
            <Button 
              variant="outline" 
              style={styles.actionButton}
              onPress={() => {}}
            >
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}> Summarize</Text>
            </Button>
          </View>
        </View>

        <Card style={styles.featureCard}>
          <Card.Content>
            <Ionicons name="flash" size={24} color={colors.accent} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Powered by AI</Text>
            <Text style={styles.featureDescription}>
              Our AI Study Coach uses advanced language models to provide personalized explanations, summaries, and study plans designed for high school students.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.display,
    color: colors.text,
  },
  subGreeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  motivationCard: {
    backgroundColor: colors.backgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    marginBottom: spacing.xl,
  },
  sparkleIcon: {
    marginBottom: spacing.sm,
  },
  motivationText: {
    ...typography.bodyBold,
    color: colors.text,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  quickActions: {
    marginBottom: spacing.xl,
  },
  actionGrid: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 60,
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.borderDarkMode,
  },
  actionButtonText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  featureCard: {
    backgroundColor: colors.backgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  featureDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
