import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import JobListScreen from '../screens/JobListScreen';
import AddJobScreen from '../screens/AddJobScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color, size }) => (
          <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
        ),
      }}
    />
    <Tab.Screen 
      name="Jobs" 
      component={JobListScreen}
      options={{
        tabBarLabel: 'Jobs',
        tabBarIcon: ({ color, size }) => (
          <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
        ),
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
        ),
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AddJob" 
      component={AddJobScreen}
      options={{ title: 'Add Job' }}
    />
    <Stack.Screen 
      name="JobDetail" 
      component={JobDetailScreen}
      options={{ title: 'Job Details' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator; 