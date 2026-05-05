import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { Container, Card, Button, Input, Avatar } from '@/components/ui';
import { generateTextWithOpenAI } from '@/lib/openai';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const [availableTime, setAvailableTime] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [grade, setGrade] = useState('');
  const [studyGoals, setStudyGoals] = useState('');

  const suggestStudyPlanMutation = useMutation({
    mutationFn: async () => {
      setIsSuggesting(true);
      const prompt = `I am a ${grade || 'high school'} student with ${availableTime} minutes available to study.
      My study goals are: ${studyGoals || 'general learning'}.
      Give me a specific, personalized study plan for these ${availableTime} minutes.
      Format with bullet points and be encouraging and motivating.`;

      const result = await generateTextWithOpenAI({ 
        prompt, 
        maxTokens: 300 
      });
      
      if (result.success && result.text) {
        setSuggestion(result.text);
      } else {
        setSuggestion('');
        // Error will be handled by the component
      }
      setIsSuggesting(false);
    },
    onError: () => setIsSuggesting(false),
  });

  return (
    <Container safeArea edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          <Avatar 
            name="Student" 
            size="xl" 
            containerStyle={styles.avatar}
          />
          <Text style={styles.profileName}>AI Study Coach</Text>
          <Text style={styles.profileRole}>Your Personal Learning Assistant</Text>
        </View>

        <Card style={styles.sectionCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Student Profile</Text>
          </Card.Header>
          <Card.Content>
            <Input
              label="Grade / Year"
              placeholder="e.g., Grade 11, Junior"
              value={grade}
              onChangeText={setGrade}
              containerStyle={styles.input}
            />
            <Input
              label="Study Goals"
              placeholder="e.g., Improve Math, Prepare for exams"
              value={studyGoals}
              onChangeText={setStudyGoals}
              multiline
              containerStyle={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.suggestionCard} variant="elevated">
          <Card.Header>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="timer-outline" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Smart Study Plan</Text>
            </View>
          </Card.Header>
          <Card.Content>
            <Text style={styles.label}>How many minutes do you have to study?</Text>
            <Input
              placeholder="e.g., 45, 90, 120"
              keyboardType="numeric"
              value={availableTime}
              onChangeText={setAvailableTime}
              containerStyle={styles.input}
            />
            <Button 
              variant="primary" 
              onPress={() => suggestStudyPlanMutation.mutate()}
              loading={isSuggesting}
              disabled={!availableTime || isSuggesting}
            >
              Generate AI Study Plan
            </Button>

            {suggestion ? (
              <View style={styles.suggestionContainer}>
                <Text style={styles.suggestionTitle}>Your Personalized Study Plan:</Text>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Button variant="ghost" onPress={() => {}}>Settings</Button>
          <Text style={styles.versionText}>AI Study Coach v2.0</Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  avatar: {
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  profileName: {
    ...typography.h2,
    color: colors.text,
  },
  profileRole: {
    ...typography.body,
    color: colors.textSecondary,
  },
  sectionCard: {
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderDarkMode,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  input: {
    marginBottom: spacing.md,
  },
  suggestionCard: {
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.xxl,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  suggestionContainer: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderDarkMode,
  },
  suggestionTitle: {
    ...typography.bodyBold,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  suggestionText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  versionText: {
    ...typography.tiny,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
});
