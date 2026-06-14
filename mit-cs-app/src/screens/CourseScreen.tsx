import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import courses, { Lesson } from '../data/courses';
import { useProgress } from '../hooks/useProgress';
import { useTheme } from '../theme/ThemeContext';

export default function CourseScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { courseId } = route.params;
  const course = courses.find((c) => c.id === courseId)!;
  const { progress } = useProgress();
  const { theme } = useTheme();

  function renderLesson({ item, index }: { item: Lesson; index: number }) {
    const isDone = progress.completedLessons.has(item.id);
    const doneExercises = item.exercises.filter((e) =>
      progress.completedExercises.has(e.id)
    ).length;

    return (
      <TouchableOpacity
        style={[styles.lessonRow, { backgroundColor: theme.card }, isDone && styles.lessonDone]}
        onPress={() =>
          navigation.navigate('Lesson', { courseId, lessonId: item.id })
        }
        activeOpacity={0.8}
      >
        <View style={[styles.lessonNum, { backgroundColor: isDone ? course.color : theme.inputBg }]}>
          {isDone ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            <Text style={[styles.numText, { color: course.color }]}>{index + 1}</Text>
          )}
        </View>

        <View style={styles.lessonInfo}>
          <Text style={[styles.lessonTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.exerciseCount, { color: theme.subtext }]}>
            {doneExercises}/{item.exercises.length} exercises done
          </Text>
        </View>

        <Text style={[styles.arrow, { color: theme.border }]}>›</Text>
      </TouchableOpacity>
    );
  }

  const totalExercises = course.lessons.reduce((s, l) => s + l.exercises.length, 0);
  const doneExercises = course.lessons.reduce(
    (s, l) => s + l.exercises.filter((e) => progress.completedExercises.has(e.id)).length,
    0
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.hero, { backgroundColor: course.color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heroCode}>{course.code}</Text>
        <Text style={styles.heroTitle}>{course.title}</Text>
        <Text style={styles.heroSub}>{course.description}</Text>
        <View style={styles.stats}>
          <Stat label="Lessons" value={String(course.lessons.length)} />
          <Stat label="Exercises" value={`${doneExercises}/${totalExercises}`} />
          <Stat label="Language" value={course.language.toUpperCase()} />
        </View>
      </View>

      <FlatList
        data={course.lessons}
        keyExtractor={(l) => l.id}
        renderItem={renderLesson}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { padding: 20, paddingTop: 12, paddingBottom: 24 },
  back: { marginBottom: 12 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 16 },
  heroCode: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 4, marginBottom: 8 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 19 },
  stats: { flexDirection: 'row', marginTop: 18, gap: 16 },
  statBox: { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  list: { padding: 16 },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lessonDone: { opacity: 0.85 },
  lessonNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkmark: { color: '#fff', fontSize: 16, fontWeight: '700' },
  numText: { fontSize: 14, fontWeight: '700' },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 15, fontWeight: '600' },
  exerciseCount: { fontSize: 12, marginTop: 3 },
  arrow: { fontSize: 22 },
});
