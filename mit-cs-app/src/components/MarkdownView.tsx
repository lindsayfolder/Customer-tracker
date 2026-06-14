import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface Props {
  content: string;
}

export default function MarkdownView({ content }: Props) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('# ')) {
      elements.push(<Text key={i} style={styles.h1}>{line.slice(2)}</Text>);
    } else if (line.startsWith('## ')) {
      elements.push(<Text key={i} style={styles.h2}>{line.slice(3)}</Text>);
    } else if (line.startsWith('### ')) {
      elements.push(<Text key={i} style={styles.h3}>{line.slice(4)}</Text>);
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <View key={i} style={styles.codeBlock}>
          {lang ? <Text style={styles.codeLang}>{lang}</Text> : null}
          <Text style={styles.codeText}>{codeLines.join('\n')}</Text>
        </View>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{renderInline(line.slice(2))}</Text>
        </View>
      );
    } else if (line.startsWith('| ')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!lines[i].match(/^\|[-| ]+\|$/)) {
          rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()));
        }
        i++;
      }
      elements.push(
        <View key={`table-${i}`} style={styles.table}>
          {rows.map((row, ri) => (
            <View key={ri} style={[styles.tableRow, ri === 0 && styles.tableHeader]}>
              {row.map((cell, ci) => (
                <Text key={ci} style={[styles.tableCell, ri === 0 && styles.tableCellHeader]}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      );
      continue;
    } else if (line.trim() === '') {
      elements.push(<View key={i} style={{ height: 6 }} />);
    } else {
      elements.push(
        <Text key={i} style={styles.para}>{renderInline(line)}</Text>
      );
    }
    i++;
  }

  return <View>{elements}</View>;
}

function renderInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`(.+?)`/g, '$1');
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 12, marginTop: 4 },
  h2: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginTop: 16, marginBottom: 8 },
  h3: { fontSize: 15, fontWeight: '600', color: '#333', marginTop: 12, marginBottom: 6 },
  para: { fontSize: 14, color: '#333', lineHeight: 22, marginBottom: 6 },
  codeBlock: {
    backgroundColor: '#1e1e2e',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  codeLang: {
    fontSize: 10,
    color: '#888',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#cdd6f4',
    lineHeight: 18,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 5, paddingLeft: 4 },
  bullet: { fontSize: 14, color: '#555', marginRight: 8, lineHeight: 22 },
  bulletText: { fontSize: 14, color: '#333', lineHeight: 22, flex: 1 },
  table: { borderRadius: 8, overflow: 'hidden', marginVertical: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tableHeader: { backgroundColor: '#f5f5f5' },
  tableCell: { flex: 1, padding: 8, fontSize: 13, color: '#333' },
  tableCellHeader: { fontWeight: '700', color: '#1a1a2e' },
});
