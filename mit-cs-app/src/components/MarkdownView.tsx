import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  content: string;
}

export default function MarkdownView({ content }: Props) {
  const { theme } = useTheme();

  const lines = content.split('\n');

  return (
    <View>
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return (
            <Text key={i} style={[styles.h3, { color: theme.text }]}>
              {line.slice(4)}
            </Text>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <Text key={i} style={[styles.h2, { color: theme.text }]}>
              {line.slice(3)}
            </Text>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <Text key={i} style={[styles.h1, { color: theme.text }]}>
              {line.slice(2)}
            </Text>
          );
        }
        if (line.startsWith('```')) {
          return null;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <View key={i} style={styles.bullet}>
              <Text style={[styles.bulletDot, { color: theme.subtext }]}>•</Text>
              <Text style={[styles.bulletText, { color: theme.text }]}>{line.slice(2)}</Text>
            </View>
          );
        }
        if (line.trim() === '') {
          return <View key={i} style={styles.spacer} />;
        }
        return (
          <Text key={i} style={[styles.body, { color: theme.text }]}>
            {renderInline(line, theme)}
          </Text>
        );
      })}
    </View>
  );
}

function renderInline(line: string, theme: any): React.ReactNode {
  const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <Text key={i} style={[styles.inlineCode, { backgroundColor: theme.inputBg, color: theme.codeText }]}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={[styles.bold, { color: theme.text }]}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', marginTop: 16, marginBottom: 8 },
  h2: { fontSize: 18, fontWeight: '700', marginTop: 14, marginBottom: 6 },
  h3: { fontSize: 15, fontWeight: '700', marginTop: 12, marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 22, marginBottom: 2 },
  bold: { fontWeight: '700' },
  inlineCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  bullet: { flexDirection: 'row', marginBottom: 4, paddingLeft: 8 },
  bulletDot: { fontSize: 14, marginRight: 8, lineHeight: 22 },
  bulletText: { fontSize: 14, lineHeight: 22, flex: 1 },
  spacer: { height: 8 },
});
