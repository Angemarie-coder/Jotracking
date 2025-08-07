import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, useWindowDimensions, Dimensions } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Text, 
  ActivityIndicator, 
  Chip, 
  useTheme, 
  Snackbar,
  Avatar,
  Divider,
  IconButton,
  Badge
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Job, JobStatus, NavigationProps, User } from '../types';
import apiService from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import DashboardAnalytics from '../components/DashboardAnalytics';
import DashboardWidget from '../components/DashboardWidget';
import DashboardSummary from '../components/DashboardSummary';
import ApiHealthCheck from '../components/ApiHealthCheck';
import useApi from '../hooks/useApi';
import ErrorHandler from '../utils/errorHandler';
import { formatDistanceToNow } from 'date-fns';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;
  const isSmallScreen = screenWidth < 375;
  const navigation = useNavigation<NavigationProps>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // API hooks
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    execute: loadStats,
    reset: resetStats
  } = useApi(apiService.getDashboardStats);

  const {
    data: recentJobs,
    loading: jobsLoading,
    error: jobsError,
    execute: loadJobs,
    reset: resetJobs
  } = useApi(() => apiService.getJobs({ limit: 5 }));

  const {
    data: user,
    loading: userLoading,
    error: userError,
    execute: loadUser
  } = useApi(apiService.getCurrentUser);

  const loadData = async () => {
    try {
      await Promise.all([
        loadStats(),
        loadJobs(),
        loadUser()
      ]);
    } catch (error) {
      const appError = ErrorHandler.handle(error, 'Dashboard Error');
      ErrorHandler.showAlert(appError);
    }
  };

  const onRefresh = async () => {
    resetStats();
    resetJobs();
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.APPLIED: return theme.colors.primary;
      case JobStatus.INTERVIEWING: return '#FF9800';
      case JobStatus.OFFER: return '#4CAF50';
      case JobStatus.REJECTED: return theme.colors.error;
      case JobStatus.SAVED: return theme.colors.surfaceVariant;
      default: return theme.colors.surfaceVariant;
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.APPLIED: return 'send';
      case JobStatus.INTERVIEWING: return 'account-tie';
      case JobStatus.OFFER: return 'trophy';
      case JobStatus.REJECTED: return 'close-circle';
      case JobStatus.SAVED: return 'bookmark';
      default: return 'briefcase';
    }
  };

  const calculateProgress = () => {
    if (!stats) return 0;
    const total = stats.total || 0;
    const applied = stats.applied || 0;
    const interviewing = stats.interviewing || 0;
    const offers = stats.offers || 0;
    
    if (total === 0) return 0;
    return Math.round(((applied + interviewing + offers) / total) * 100);
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress >= 80) return '#4CAF50';
    if (progress >= 60) return '#FF9800';
    if (progress >= 40) return '#2196F3';
    return '#9E9E9E';
  };

  const isLoading = statsLoading || jobsLoading || userLoading;
  const hasError = statsError || jobsError || userError;

  if (isLoading && !stats && !recentJobs) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* API Health Check - Temporary for debugging */}
          <ApiHealthCheck />

          {/* Welcome Header */}
          <Card style={styles.welcomeCard}>
            <Card.Content style={styles.welcomeContent}>
              <View style={styles.welcomeLeft}>
                <Text style={styles.welcomeText}>
                  Welcome back, {currentUser?.firstName || 'User'}! 👋
                </Text>
                <Text style={styles.welcomeSubtext}>
                  {stats?.total ? `You have ${stats.total} jobs in your tracker` : 'Start tracking your job applications'}
                </Text>
              </View>
              <Avatar.Text 
                size={50} 
                label={currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : 'U'} 
                style={styles.avatar}
              />
            </Card.Content>
          </Card>

          {/* Dashboard Summary */}
          {stats && <DashboardSummary stats={stats} />}

          {/* Progress Overview */}
          <Card style={styles.progressCard}>
            <Card.Content>
              <View style={styles.progressHeader}>
                <Text variant="titleMedium" style={styles.progressTitle}>
                  Application Progress
                </Text>
                <Text style={[styles.progressPercentage, { color: getProgressColor() }]}>
                  {calculateProgress()}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${calculateProgress()}%`,
                      backgroundColor: getProgressColor()
                    }
                  ]} 
                />
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatLabel}>Applied</Text>
                  <Text style={styles.progressStatValue}>{stats?.applied || 0}</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatLabel}>Interviewing</Text>
                  <Text style={styles.progressStatValue}>{stats?.interviewing || 0}</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatLabel}>Offers</Text>
                  <Text style={styles.progressStatValue}>{stats?.offers || 0}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card style={styles.quickActionsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Quick Actions
              </Text>
              <View style={styles.quickActions}>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddJob')}
                  style={styles.quickActionButton}
                  title="Add Job"
                  icon="plus"
                />
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Jobs')}
                  style={styles.quickActionButton}
                  title="View All"
                  icon="briefcase"
                />
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Profile')}
                  style={styles.quickActionButton}
                  title="Profile"
                  icon="account"
                />
              </View>
            </Card.Content>
          </Card>

          {/* Analytics Component */}
          {stats && <DashboardAnalytics stats={stats} />}

          {/* Stats Widgets */}
          <View style={styles.statsContainer}>
            <DashboardWidget
              title="Total Jobs"
              value={stats?.total || 0}
              icon="briefcase"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('Jobs')}
            />
            <DashboardWidget
              title="Applied"
              value={stats?.applied || 0}
              icon="send"
              color="#4CAF50"
              onPress={() => navigation.navigate('Jobs')}
            />
            <DashboardWidget
              title="Interviewing"
              value={stats?.interviewing || 0}
              icon="account-tie"
              color="#2196F3"
              onPress={() => navigation.navigate('Jobs')}
            />
            <DashboardWidget
              title="Offers"
              value={stats?.offers || 0}
              icon="trophy"
              color="#9C27B0"
              onPress={() => navigation.navigate('Jobs')}
            />
          </View>

          {/* Recent Activity */}
          <Card style={styles.activityCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Recent Activity
                </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Jobs')}
                  style={styles.seeAllButton}
                  labelStyle={styles.seeAllButtonLabel}
                  title="See All"
                />
              </View>
              
              {recentJobs && recentJobs.length > 0 ? (
                recentJobs.map((job, index) => (
                  <View key={job.id}>
                    <View style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <MaterialCommunityIcons 
                          name={getStatusIcon(job.status)} 
                          size={20} 
                          color={getStatusColor(job.status)} 
                        />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle} numberOfLines={1}>
                          {job.title}
                        </Text>
                        <Text style={styles.activityCompany} numberOfLines={1}>
                          {job.company}
                        </Text>
                        <View style={styles.activityMeta}>
                          <View style={[styles.statusChip, { backgroundColor: getStatusColor(job.status) }]}>
                            <Text style={styles.statusChipText}>
                              {job.status}
                            </Text>
                          </View>
                          <Text style={styles.activityTime}>
                            {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : ''}
                          </Text>
                        </View>
                      </View>
                      <IconButton
                        icon="chevron-right"
                        size={20}
                        onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
                      />
                    </View>
                    {index < recentJobs.length - 1 && <Divider style={styles.divider} />}
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons 
                    name="briefcase-outline" 
                    size={48} 
                    color={theme.colors.outline} 
                  />
                  <Text style={styles.emptyText}>No recent jobs found</Text>
                  <Text style={styles.emptySubtext}>
                    Start tracking your job applications to see them here
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('AddJob')}
                    style={styles.addJobButton}
                    title="Add Your First Job"
                  />
                </View>
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Error Snackbar */}
      <Snackbar
        visible={!!hasError}
        onDismiss={() => {
          if (statsError) resetStats();
          if (jobsError) resetJobs();
        }}
        action={{
          label: 'Retry',
          onPress: loadData,
        }}
      >
        {hasError?.message || 'An error occurred'}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  avatar: {
    backgroundColor: '#2196F3',
  },
  progressCard: {
    marginBottom: 16,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontWeight: 'bold',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  progressStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statTitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  activityCard: {
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  seeAllButton: {
    padding: 0,
  },
  seeAllButtonLabel: {
    fontSize: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityCompany: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusChipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  divider: {
    marginLeft: 52,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 16,
  },
  addJobButton: {
    marginTop: 8,
  },
});

export default DashboardScreen;