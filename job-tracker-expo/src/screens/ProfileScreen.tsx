import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Avatar, List, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { NavigationProps } from '../types';
import { spacing, typography, colors, borderRadius, shadows } from '../theme';

const ProfileScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const generateInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>User not found</Text>
        <Button 
          onPress={() => navigation.navigate('Login')} 
          style={styles.button}
          title="Go to Login"
        />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Header */}
      <Card style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={96}
              label={generateInitials(user.firstName, user.lastName)}
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.avatarText}
            />
          </View>
          
          <Title style={[styles.userName, { color: theme.colors.onSurface }]}>
            {user.firstName} {user.lastName}
          </Title>
          
          <Text style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
            {user.email}
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Applied</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Interviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Offers</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Account Section */}
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Account
          </Title>
          
          <List.Item
            title="Edit Profile"
            description="Update your personal information"
            left={props => <List.Icon {...props} icon="account-edit" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          
          <List.Item
            title="Change Password"
            description="Update your password"
            left={props => <List.Icon {...props} icon="lock-reset" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('ChangePassword')}
            style={styles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Card.Content>
      </Card>

      {/* App Section */}
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            App Settings
          </Title>
          
          <List.Item
            title="Notifications"
            description="Manage your notification preferences"
            left={props => <List.Icon {...props} icon="bell" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('NotificationSettings')}
            style={styles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          
          <List.Item
            title="Theme"
            description="Change app theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('ThemeSettings')}
            style={styles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Card.Content>
      </Card>

      {/* Support Section */}
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Support
          </Title>
          
          <List.Item
            title="Help & Support"
            description="Get help with the app"
            left={props => <List.Icon {...props} icon="help-circle" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('HelpSupport')}
            style={styles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          
          <List.Item
            title="About"
            description="App version and information"
            left={props => <List.Icon {...props} icon="information" color={theme.colors.primary} />}
            onPress={() => navigation.navigate('About')}
            style={styles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: theme.colors.error }]}
          textColor={theme.colors.error}
          title="Logout"
        />
      </View>

      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.onSurfaceVariant }]}>
          v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginTop: 16,
  },
  profileCard: {
    margin: 16,
    borderRadius: borderRadius.card,
    ...shadows.md,
  },
  profileContent: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    ...typography.body1,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 8,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.h5,
    fontWeight: '600',
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  divider: {
    marginLeft: 56,
  },
  logoutContainer: {
    margin: 16,
    marginTop: 8,
  },
  logoutButton: {
    borderWidth: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  versionText: {
    ...typography.caption,
  },
});

export default ProfileScreen;