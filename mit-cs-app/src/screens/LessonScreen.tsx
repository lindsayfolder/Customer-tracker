import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import courses from '../data/courses';
import { useProgress } from '../hooks/useProgress';
import MarkdownView from '../components/MarkdownView';

export default function LessonScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { courseId, lessonId } = route.params;

  const course = courses.find((c) => c.id === courseId)!;
  const lesson = course.lessons.find((l) => l.id === lessonId)!;
  const { progress, markLessonComplete } = useProgress();

  const [tab, setTab] = useState<'content' | 'exercises'>('content');
  const isDone = progress.completedLessons.has(lesson.id);
  const doneCount = lesson.exercises.filter((e) =>
    progress.completedExercises.has(e.id)
  ).length;

  async function handleMarkDone() {
    await markLessonComplete(lesson.id);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>{lesson.title}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'content' && { borderBottomColor: course.color, borderBottomWidth: 2 }]}
          onPress={() => setTab('content')}
        >
          <Text style={[styles.tabText, tab === 'content' && { color: course.color, fontWeight: '700' }]}>
            Lesson
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'exercises' && { borderBottomColor: course.color, borderBottomWidth: 2 }]}
          onPress={() => setTab('exercises')}
        >
          <Text style={[styles.tabText, tab === 'exercises' && { color: course.color, fontWeight: '700' }]}>
            Exercises ({doneCount}/{lesson.exercises.length})
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'content' ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPad}>
          <MarkdownView content={lesson.content} />
          {!isDone && (
            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: course.color }]}
              onPress={handleMarkDone}
            >
              <Text style={styles.doneBtnText}>Mark Lesson Complete</Text>
            </TouchableOpacity>
          )}
          {isDone && (
            <View style={[styles.completedBanner, { borderColor: course.color }]}>
              <Text style={[styles.completedText, { color: course.color }]}>✓ Lesson completed</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.exercisesBtn, { borderColor: course.color }]}
            onPress={() => setTab('exercises')}
          >
            <Text style={[styles.exercisesBtnText, { color: course.color }]}>
              Go to Exercises →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPad}>
          {lesson.exercises.map((exercise, idx) => {
            const exDone = progress.completedExercises.has(exercise.id);
            return (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseCard, exDone && styles.exerciseCardDone]}
                onPress={() =>
                  navigation.navigate('Exercise', {
                    courseId,
                    lessonId,
                    exerciseId: exercise.id,
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.exRow}>
                  <View style={[styles.exNum, { backgroundColor: exDone ? course.color : '#eee' }]}>
                    {exDone ? (
                      <Text style={styles.exCheck}>✓</Text>
                    ) : (
                      <Text style={[styles.exNumText, { color: course.color }]}>{idx + 1}</Text>
                    )}
                  </View>
                  <View style={styles.exInfo}>
                    <Text style={styles.exTitle}>{exercise.title}</Text>
                    <Text style={styles.exLang}>{exercise.language.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </View>
                <Text style={styles.exDesc} numberOfLines={2}>
                  {exercise.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  back: { width: 32 },
  backText: { fontSize: 24, color: '#333' },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 14, color: '#888' },
  content: { flex: 1 },
  contentPad: { padding: 16, paddingBottom: 40 },
  doneBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  completedBanner: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    marginTop: 20,
  },
  completedText: { fontSize: 14, fontWeight: '700' },
  exercisesBtn: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    marginTop: 12,
  },
  exercisesBtnText: { fontSize: 14, fontWeight: '600' },
  exerciseCard: {
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
  exerciseCardDone: { opacity: 0.8 },
  exRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  exNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exCheck: { color: '#fff', fontSize: 14, fontWeight: '700' },
  exNumText: { fontSize: 13, fontWeight: '700' },
  exInfo: { flex: 1 },
  exTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  exLang: { fontSize: 11, color: '#aaa', marginTop: 2 },
  arrow: { fontSize: 22, color: '#ccc' },
  exDesc: { fontSize: 13, color: '#666', lineHeight: 18, paddingLeft: 44 },
});
