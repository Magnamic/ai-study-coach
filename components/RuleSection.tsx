import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

const RuleSection = () => {
  return (
    <div style={{
      backgroundColor: colors.backgroundSecondary,
      padding: spacing.medium,
      borderRadius: borderRadius.small,
      boxShadow: shadows.small
    }}>
      <h2 style={{ color: colors.text, fontSize: typography.headline }}>Section Title</h2>
      <ul>
        <li style={{ color: colors.primary }}>Bullet Point
        </li>
        <li style={{ color: colors.primary }}>Bullet Point
        </li>
      </ul>
      <p style={{ color: colors.text, fontSize: typography.body }}>Rule Text</p>
    </div>
  );
};

export default RuleSection;