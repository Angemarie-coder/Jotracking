import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import JobListScreen from '../screens/JobListScreen';
import AddJobScreen from '../screens/AddJobScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import EditJobScreen from '../screens/EditJobScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' } 
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      headerShown: false,
      tabBarStyle: {
        paddingVertical: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
    })}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Jobs" 
      component={JobListScreen}
      options={{
        tabBarLabel: 'Jobs',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="briefcase-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#007AFF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="AddJob" 
      component={AddJobScreen}
      options={{ 
        title: 'Add New Job',
        headerBackTitle: 'Back'
      }}
    />
    <Stack.Screen 
      name="JobDetail" 
      component={JobDetailScreen}
      options={({ route }) => ({ 
        title: 'Job Details',
        headerBackTitle: 'Back'
      })}
    />
    <Stack.Screen 
      name="EditJob" 
      component={EditJobScreen}
      options={{ 
        title: 'Edit Job',
        headerBackTitle: 'Back'
      }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Handle deep links when app is already running
    const handleDeepLink = (url: string) => {
      if (url.startsWith('jobtracker://verify-email')) {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get('token');
        const email = urlObj.searchParams.get('email');
        
        if (token && email) {
          // Navigate to EmailVerification screen with params
          // This will be handled by the EmailVerificationScreen component
        }
      }
    };

    // Listen for deep links
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={{
        prefixes: ['jobtracker://'],
        config: {
          screens: {
            EmailVerification: {
              path: 'verify-email',
              parse: {
                token: (token: string) => token,
                email: (email: string) => email,
              },
            },
          },
        },
      }}
    >
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;