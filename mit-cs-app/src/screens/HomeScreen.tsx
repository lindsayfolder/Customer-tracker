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
import { useTheme } from '../theme/ThemeContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import OfflineBanner from '../components/OfflineBanner';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { getCoursePct } = useProgress();
  const { theme, isDark } = useTheme();
  const { isOnline } = useNetworkStatus();

  function renderCourse({ item }: { item: Course }) {
    const pct = getCoursePct(item.id, item.lessons.length);
    const totalExercises = item.lessons.reduce((s, l) => s + l.exercises.length, 0);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderLeftColor: item.color }]}
        onPress={() => navigation.navigate('Course', { courseId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.courseCode, { color: theme.subtext }]}>{item.code}</Text>
            <Text style={[styles.courseTitle, { color: theme.text }]}>{item.title}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: item.color + '22' }]}>
            <Text style={[styles.diffText, { color: item.color }]}>{item.difficulty}</Text>
          </View>
        </View>

        <Text style={[styles.description, { color: theme.subtext }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.meta}>
          <Text style={[styles.metaText, { color: theme.subtext }]}>{item.lessons.length} lessons</Text>
          <Text style={[styles.metaDot, { color: theme.border }]}>·</Text>
          <Text style={[styles.metaText, { color: theme.subtext }]}>{totalExercises} exercises</Text>
          <Text style={[styles.metaDot, { color: theme.border }]}>·</Text>
          <Text style={[styles.metaText, { color: theme.subtext }]}>{item.language.toUpperCase()}</Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: theme.inputBg }]}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: item.color }]} />
        </View>
        <Text style={[styles.progressLabel, { color: theme.subtext }]}>{pct}% complete</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />
      <OfflineBanner isOnline={isOnline} />
      <View style={styles.header}>
        <Text style={[styles.logo, { color: theme.text }]}>CS Courses</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Learn computer science — algorithms, math, AI and more</Text>
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
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  logo: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
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
  courseCode: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  courseTitle: { fontSize: 16, fontWeight: '700', marginTop: 2, maxWidth: 200 },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  diffText: { fontSize: 11, fontWeight: '700' },
  description: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaText: { fontSize: 12 },
  metaDot: { fontSize: 12, marginHorizontal: 5 },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressLabel: { fontSize: 11, marginTop: 5 },
});
