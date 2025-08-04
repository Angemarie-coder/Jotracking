import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Avatar, List, Divider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
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
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={generateInitials(user.firstName, user.lastName)}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Title style={styles.userName}>
              {user.firstName} {user.lastName}
            </Title>
            <Paragraph style={styles.userEmail}>{user.email}</Paragraph>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Account Status:</Text>
              <Text style={[styles.statusText, { color: user.isVerified ? '#4CAF50' : '#FF9800' }]}>
                {user.isVerified ? 'Verified' : 'Pending Verification'}
              </Text>
            </View>
            {user.isAdmin && (
              <Text style={styles.adminBadge}>Administrator</Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Account Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Information</Title>
          <List.Item
            title="Full Name"
            description={`${user.firstName} ${user.lastName}`}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          <Divider />
          <List.Item
            title="Email Address"
            description={user.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Member Since"
            description={new Date(user.createdAt).toLocaleDateString()}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <Divider />
          <List.Item
            title="Last Updated"
            description={new Date(user.updatedAt).toLocaleDateString()}
            left={(props) => <List.Icon {...props} icon="update" />}
          />
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Settings</Title>
          <List.Item
            title="Change Password"
            description="Update your account password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Password change feature will be available soon')}
          />
          <Divider />
          <List.Item
            title="Notification Settings"
            description="Manage your notification preferences"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
          />
          <Divider />
          <List.Item
            title="Privacy Settings"
            description="Manage your privacy and data settings"
            left={(props) => <List.Icon {...props} icon="shield" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon')}
          />
        </Card.Content>
      </Card>

      {/* Support */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Support</Title>
          <List.Item
            title="Help & FAQ"
            description="Get help and find answers to common questions"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Help section will be available soon')}
          />
          <Divider />
          <List.Item
            title="Contact Support"
            description="Get in touch with our support team"
            left={(props) => <List.Icon {...props} icon="message" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Contact support will be available soon')}
          />
          <Divider />
          <List.Item
            title="About"
            description="Learn more about Job Tracker"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('About', 'Job Tracker v1.0.0\nA React Native app for tracking job applications')}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            textColor="#F44336"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#007AFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  adminBadge: {
    backgroundColor: '#FF9800',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});

export default ProfileScreen; 