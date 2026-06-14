import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import courses from '../data/courses';
import { useProgress } from '../hooks/useProgress';

export default function ProfileScreen() {
  const { progress } = useProgress();

  const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0);
  const totalExercises = courses.reduce(
    (s, c) => s + c.lessons.reduce((ls, l) => ls + l.exercises.length, 0),
    0
  );
  const doneLessons = progress.completedLessons.size;
  const doneExercises = progress.completedExercises.size;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>My Progress</Text>

        <View style={styles.overviewRow}>
          <StatCard label="Lessons Done" value={`${doneLessons}/${totalLessons}`} color="#4CAF50" />
          <StatCard label="Exercises Done" value={`${doneExercises}/${totalExercises}`} color="#2196F3" />
        </View>

        <Text style={styles.sectionTitle}>By Course</Text>
        {courses.map((course) => {
          const courseLessons = course.lessons.length;
          const courseDoneLessons = course.lessons.filter((l) =>
            progress.completedLessons.has(l.id)
          ).length;
          const courseExercises = course.lessons.reduce((s, l) => s + l.exercises.length, 0);
          const courseDoneExercises = course.lessons.reduce(
            (s, l) => s + l.exercises.filter((e) => progress.completedExercises.has(e.id)).length,
            0
          );
          const pct = courseLessons > 0 ? Math.round((courseDoneLessons / courseLessons) * 100) : 0;

          return (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View style={[styles.dot, { backgroundColor: course.color }]} />
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.coursePct}>{pct}%</Text>
              </View>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.bar}>
                <View style={[styles.fill, { width: `${pct}%`, backgroundColor: course.color }]} />
              </View>
              <View style={styles.courseStats}>
                <Text style={styles.courseStat}>{courseDoneLessons}/{courseLessons} lessons</Text>
                <Text style={styles.courseStat}>{courseDoneExercises}/{courseExercises} exercises</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', marginBottom: 20 },
  overviewRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  courseCode: { fontSize: 12, fontWeight: '700', color: '#888', flex: 1 },
  coursePct: { fontSize: 14, fontWeight: '700', color: '#333' },
  courseTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 10 },
  bar: { height: 5, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  fill: { height: '100%', borderRadius: 3 },
  courseStats: { flexDirection: 'row', gap: 16 },
  courseStat: { fontSize: 12, color: '#888' },
});
