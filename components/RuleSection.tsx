import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

interface RuleSectionProps {
  title: string;
  rules: string[];
}

export function RuleSection({ title, rules }: RuleSectionProps) {
  return (
    <Animated.View 
      style={styles.section}
      entering={FadeInDown.duration(400).delay(200)}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      {rules.map((rule, index) => (
        <View key={index} style={styles.ruleContainer}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.ruleText}>{rule}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  ruleContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    paddingRight: spacing.sm,
  },
  bulletPoint: {
    fontSize: 14,
    marginRight: spacing.sm,
    color: colors.primary,
    top: 2,
  },
  ruleText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
});
