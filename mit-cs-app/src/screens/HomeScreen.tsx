import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import courses, { Course } from '../data/courses';
import { useProgress } from '../hooks/useProgress';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { getCoursePct } = useProgress();

  function renderCourse({ item }: { item: Course }) {
    const pct = getCoursePct(item.id, item.lessons.length);
    const totalExercises = item.lessons.reduce((s, l) => s + l.exercises.length, 0);

    return (
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: item.color }]}
        onPress={() => navigation.navigate('Course', { courseId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.courseCode}>{item.code}</Text>
            <Text style={styles.courseTitle}>{item.title}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: item.color + '22' }]}>
            <Text style={[styles.diffText, { color: item.color }]}>{item.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{item.lessons.length} lessons</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{totalExercises} exercises</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.language.toUpperCase()}</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: item.color }]} />
        </View>
        <Text style={styles.progressLabel}>{pct}% complete</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <Text style={styles.logo}>MIT CS</Text>
        <Text style={styles.subtitle}>Learn computer science from MIT's curriculum</Text>
      </View>
      <FlatList
        data={courses}
        keyExtractor={(c) => c.id}
        renderItem={renderCourse}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  logo: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  courseCode: { fontSize: 12, fontWeight: '700', color: '#888', letterSpacing: 0.5 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginTop: 2, maxWidth: 200 },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  diffText: { fontSize: 11, fontWeight: '700' },
  description: { fontSize: 13, color: '#555', lineHeight: 19, marginBottom: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaText: { fontSize: 12, color: '#888' },
  metaDot: { fontSize: 12, color: '#ccc', marginHorizontal: 5 },
  progressBar: { height: 4, backgroundColor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressLabel: { fontSize: 11, color: '#aaa', marginTop: 5 },
});
