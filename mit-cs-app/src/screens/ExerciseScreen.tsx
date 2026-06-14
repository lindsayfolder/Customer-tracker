import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import courses from '../data/courses';
import { runCode, checkTestCases, TestResult } from '../utils/codeRunner';
import { useProgress } from '../hooks/useProgress';
import { useTheme } from '../theme/ThemeContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function ExerciseScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { courseId, lessonId, exerciseId } = route.params;

  const course = courses.find((c) => c.id === courseId)!;
  const lesson = course.lessons.find((l) => l.id === lessonId)!;
  const exercise = lesson.exercises.find((e) => e.id === exerciseId)!;

  const { progress, markExerciseComplete } = useProgress();
  const { theme } = useTheme();
  const { isOnline } = useNetworkStatus();
  const isDone = progress.completedExercises.has(exercise.id);

  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'output'>('code');

  async function handleRun() {
    if (!isOnline) {
      setActiveTab('output');
      setOutput('No internet connection. Code execution requires internet.');
      return;
    }
    setRunning(true);
    setActiveTab('output');
    setTestResults([]);
    const result = await runCode(code, exercise.language);
    setOutput(result.error ? `Error:\n${result.error}` : result.stdout || '(no output)');
    setRunning(false);
  }

  async function handleSubmit() {
    if (!isOnline) {
      setActiveTab('output');
      setOutput('No internet connection. Code execution requires internet.');
      return;
    }
    setSubmitting(true);
    setActiveTab('output');
    const result = await runCode(code, exercise.language);
    const actualOutput = result.error ? '' : result.stdout;
    const results = checkTestCases(actualOutput, exercise.testCases);
    setTestResults(results);
    const allPassed = results.every((r) => r.passed);
    const score = Math.round((results.filter((r) => r.passed).length / results.length) * 100);
    setOutput(result.error ? `Error:\n${result.error}` : actualOutput);
    if (allPassed) {
      await markExerciseComplete(exercise.id, score);
    }
    setSubmitting(false);
  }

  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={[styles.backText, { color: theme.text }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: theme.text }]} numberOfLines={1}>{exercise.title}</Text>
          {isDone && <Text style={[styles.donePill, { backgroundColor: course.color }]}>✓</Text>}
        </View>

        <ScrollView style={[styles.desc, { backgroundColor: theme.card }]}>
          <Text style={[styles.descText, { color: theme.text }]}>{exercise.description}</Text>
          {exercise.hint && (
            <TouchableOpacity onPress={() => setShowHint(!showHint)} style={styles.hintToggle}>
              <Text style={[styles.hintToggleText, { color: course.color }]}>
                {showHint ? '▼ Hide hint' : '▶ Show hint'}
              </Text>
            </TouchableOpacity>
          )}
          {showHint && exercise.hint && (
            <View style={[styles.hintBox, { borderLeftColor: course.color }]}>
              <Text style={[styles.hintText, { color: theme.subtext }]}>{exercise.hint}</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.tabs, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'code' && { borderBottomColor: course.color, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('code')}
          >
            <Text style={[styles.tabText, { color: theme.subtext }, activeTab === 'code' && { color: course.color, fontWeight: '700' }]}>
              Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'output' && { borderBottomColor: course.color, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('output')}
          >
            <Text style={[styles.tabText, { color: theme.subtext }, activeTab === 'output' && { color: course.color, fontWeight: '700' }]}>
              Output
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'code' ? (
          <View style={[styles.editorWrapper, { backgroundColor: theme.codeEditor }]}>
            <ScrollView style={styles.editorScroll} horizontal={false}>
              <TextInput
                style={[styles.editor, { color: theme.codeText }]}
                value={code}
                onChangeText={setCode}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                scrollEnabled={false}
                placeholder="Write your code here..."
                placeholderTextColor="#555"
              />
            </ScrollView>
          </View>
        ) : (
          <ScrollView style={[styles.outputArea, { backgroundColor: theme.codeEditor }]}>
            {(running || submitting) && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={course.color} />
                <Text style={styles.loadingText}>
                  {submitting ? 'Running test cases...' : 'Running...'}
                </Text>
              </View>
            )}
            {output !== '' && !running && !submitting && (
              <Text style={styles.outputText}>{output}</Text>
            )}
            {testResults.length > 0 && (
              <View style={styles.testResults}>
                <Text style={styles.testHeader}>Test Results</Text>
                {testResults.map((r, i) => (
                  <View key={i} style={[styles.testRow, { borderLeftColor: r.passed ? '#4CAF50' : '#f44336' }]}>
                    <Text style={styles.testStatus}>{r.passed ? '✓' : '✗'}</Text>
                    <Text style={[styles.testDesc, { color: r.passed ? '#2e7d32' : '#c62828' }]}>
                      {r.description}
                    </Text>
                  </View>
                ))}
                {allPassed && (
                  <View style={styles.successBanner}>
                    <Text style={styles.successText}>All tests passed! 🎉</Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        )}

        <View style={[styles.actions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.btn, styles.runBtn]}
            onPress={handleRun}
            disabled={running || submitting}
          >
            <Text style={styles.btnText}>▶ Run</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: course.color }]}
            onPress={handleSubmit}
            disabled={running || submitting}
          >
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.inputBg }]}
            onPress={() => setShowSolution(!showSolution)}
          >
            <Text style={[styles.btnText, { color: theme.subtext }]}>Solution</Text>
          </TouchableOpacity>
        </View>

        {showSolution && (
          <View style={[styles.solutionBox, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
            <Text style={[styles.solutionLabel, { color: theme.subtext }]}>Solution</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={[styles.solutionCode, { color: theme.text, backgroundColor: theme.bg }]}>{exercise.solution}</Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.applyBtn, { borderColor: course.color }]}
              onPress={() => { setCode(exercise.solution); setShowSolution(false); }}
            >
              <Text style={[styles.applyText, { color: course.color }]}>Apply Solution</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  back: { width: 32 },
  backText: { fontSize: 24 },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700' },
  donePill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
  },
  desc: { maxHeight: 140, paddingHorizontal: 16, paddingTop: 12 },
  descText: { fontSize: 14, lineHeight: 20 },
  hintToggle: { marginTop: 8, marginBottom: 8 },
  hintToggleText: { fontSize: 13, fontWeight: '600' },
  hintBox: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 10,
  },
  hintText: { fontSize: 13, fontStyle: 'italic' },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { fontSize: 14 },
  editorWrapper: { flex: 1 },
  editorScroll: { flex: 1 },
  editor: {
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    padding: 14,
    textAlignVertical: 'top',
    minHeight: 300,
  },
  outputArea: { flex: 1, padding: 14 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingText: { color: '#aaa', fontSize: 13 },
  outputText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    color: '#a6e3a1',
    lineHeight: 20,
  },
  testResults: { marginTop: 16 },
  testHeader: { color: '#cdd6f4', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 8,
    gap: 8,
  },
  testStatus: { fontSize: 14, color: '#fff' },
  testDesc: { fontSize: 13, flex: 1 },
  successBanner: {
    marginTop: 12,
    backgroundColor: '#1e3a1e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  successText: { color: '#a6e3a1', fontSize: 15, fontWeight: '700' },
  actions: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  runBtn: { backgroundColor: '#333' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  solutionBox: {
    borderTopWidth: 1,
    padding: 14,
    maxHeight: 220,
  },
  solutionLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  solutionCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    padding: 10,
    borderRadius: 6,
  },
  applyBtn: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  applyText: { fontSize: 13, fontWeight: '700' },
});
