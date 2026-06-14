import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import CourseScreen from './src/screens/CourseScreen';
import LessonScreen from './src/screens/LessonScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CoursesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Course" component={CourseScreen} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: '#aaa',
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: '#2a2a3e',
              backgroundColor: '#1e1e2e',
            },
            tabBarIcon: ({ color, size }) => {
              const icon = route.name === 'Courses' ? '📚' : '👤';
              return <Text style={{ fontSize: size - 4 }}>{icon}</Text>;
            },
          })}
        >
          <Tab.Screen name="Courses" component={CoursesStack} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
