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
import useApi from '../hooks/useApi';
import ErrorHandler from '../utils/errorHandler';
import { formatDistanceToNow } from 'date-fns';
import { 
  getResponsiveSpacing, 
  getResponsiveComponentSize, 
  getResponsiveBorderRadius,
  getResponsiveLayout,
  isSmallScreen,
  isLargeScreen,
  getScreenPadding
} from '../utils/responsive';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

const DashboardScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const responsiveLayout = getResponsiveLayout();
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
      case JobStatus.APPLIED: return colors.statusApplied;
      case JobStatus.INTERVIEWING: return colors.statusInterviewing;
      case JobStatus.OFFER: return colors.statusOffer;
      case JobStatus.REJECTED: return colors.statusRejected;
      case JobStatus.SAVED: return colors.statusSaved;
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
    if (progress >= 80) return colors.success;
    if (progress >= 60) return colors.warning;
    if (progress >= 40) return colors.info;
    return colors.gray500;
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
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Header */}
        <Card style={[styles.welcomeCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.welcomeContent}>
            <View style={styles.welcomeLeft}>
              <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
                Welcome back, {currentUser?.firstName || 'User'}! 👋
              </Text>
              <Text style={[styles.welcomeSubtext, { color: theme.colors.onSurfaceVariant }]}>
                {stats?.total ? `You have ${stats.total} jobs in your tracker` : 'Start tracking your job applications'}
              </Text>
            </View>
            <Avatar.Text 
              size={getResponsiveComponentSize(50, 'avatar')} 
              label={currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : 'U'} 
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            />
          </Card.Content>
        </Card>

        {/* Dashboard Summary */}
        {stats && <DashboardSummary stats={stats} />}

        {/* Progress Overview */}
        <Card style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.progressContent}>
            <View style={styles.progressHeader}>
              <Text variant="titleMedium" style={[styles.progressTitle, { color: theme.colors.onSurface }]}>
                Application Progress
              </Text>
              <Text style={[styles.progressPercentage, { color: getProgressColor() }]}>
                {calculateProgress()}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
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
                <Text style={[styles.progressStatLabel, { color: theme.colors.onSurfaceVariant }]}>Applied</Text>
                <Text style={[styles.progressStatValue, { color: theme.colors.onSurface }]}>{stats?.applied || 0}</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatLabel, { color: theme.colors.onSurfaceVariant }]}>Interviewing</Text>
                <Text style={[styles.progressStatValue, { color: theme.colors.onSurface }]}>{stats?.interviewing || 0}</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatLabel, { color: theme.colors.onSurfaceVariant }]}>Offers</Text>
                <Text style={[styles.progressStatValue, { color: theme.colors.onSurface }]}>{stats?.offers || 0}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={[styles.quickActionsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.quickActionsContent}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AddJob')}
                style={styles.quickActionButton}
                title="Add Job"
                icon="plus"
                variant="primary"
              />
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Jobs')}
                style={styles.quickActionButton}
                title="View All"
                icon="briefcase"
                variant="secondary"
              />
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Profile')}
                style={styles.quickActionButton}
                title="Profile"
                icon="account"
                variant="secondary"
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
            color={colors.statusApplied}
            onPress={() => navigation.navigate('Jobs')}
          />
          <DashboardWidget
            title="Interviewing"
            value={stats?.interviewing || 0}
            icon="account-tie"
            color={colors.statusInterviewing}
            onPress={() => navigation.navigate('Jobs')}
          />
          <DashboardWidget
            title="Offers"
            value={stats?.offers || 0}
            icon="trophy"
            color={colors.statusOffer}
            onPress={() => navigation.navigate('Jobs')}
          />
        </View>

        {/* Recent Activity */}
        <Card style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.activityContent}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Recent Activity
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Jobs')}
                style={styles.seeAllButton}
                labelStyle={[styles.seeAllButtonLabel, { color: theme.colors.primary }]}
                title="See All"
                variant="primary"
              />
            </View>
            
            {recentJobs && recentJobs.length > 0 ? (
              recentJobs.map((job, index) => (
                <View key={job.id}>
                  <View style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <MaterialCommunityIcons 
                        name={getStatusIcon(job.status)} 
                        size={getResponsiveComponentSize(20, 'button')} 
                        color={getStatusColor(job.status)} 
                      />
                    </View>
                    <View style={styles.activityItemContent}>
                      <Text style={[styles.activityTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {job.title}
                      </Text>
                      <Text style={[styles.activityCompany, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        {job.company}
                      </Text>
                      <View style={styles.activityMeta}>
                        <View style={[styles.statusChip, { backgroundColor: getStatusColor(job.status) }]}>
                          <Text style={styles.statusChipText}>
                            {job.status}
                          </Text>
                        </View>
                        <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant }]}>
                          {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : ''}
                        </Text>
                      </View>
                    </View>
                    <IconButton
                      icon="chevron-right"
                      size={getResponsiveComponentSize(20, 'button')}
                      onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
                      iconColor={theme.colors.onSurfaceVariant}
                    />
                  </View>
                  {index < recentJobs.length - 1 && <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="briefcase-outline" 
                  size={getResponsiveComponentSize(48, 'avatar')} 
                  color={theme.colors.outline} 
                />
                <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>No recent jobs found</Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
                  Start tracking your job applications to see them here
                </Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddJob')}
                  style={styles.addJobButton}
                  title="Add Your First Job"
                  variant="primary"
                />
              </View>
            )}
          </Card.Content>
        </Card>
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
    backgroundColor: colors.gray50,
  },
  scrollContent: {
    padding: getScreenPadding(),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    marginTop: getResponsiveSpacing(spacing.md),
    marginBottom: getResponsiveSpacing(spacing.md),
    borderRadius: getResponsiveBorderRadius(borderRadius.card),
    ...shadows.md,
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
    fontSize: getResponsiveSpacing(isSmallScreen() ? 18 : 20),
    fontWeight: 'bold',
    marginBottom: getResponsiveSpacing(spacing.xs),
  },
  welcomeSubtext: {
    fontSize: getResponsiveSpacing(isSmallScreen() ? 12 : 14),
  },
  avatar: {
    marginLeft: getResponsiveSpacing(spacing.md),
  },
  progressCard: {
    marginBottom: getResponsiveSpacing(spacing.md),
    borderRadius: getResponsiveBorderRadius(borderRadius.card),
    ...shadows.md,
  },
  progressContent: {
    padding: getResponsiveSpacing(spacing.lg),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(spacing.md),
  },
  progressTitle: {
    fontWeight: 'bold',
    fontSize: getResponsiveSpacing(16),
  },
  progressPercentage: {
    fontSize: getResponsiveSpacing(18),
    fontWeight: 'bold',
  },
  progressBar: {
    height: getResponsiveSpacing(8),
    borderRadius: getResponsiveBorderRadius(borderRadius.xs),
    marginBottom: getResponsiveSpacing(spacing.md),
  },
  progressFill: {
    height: '100%',
    borderRadius: getResponsiveBorderRadius(borderRadius.xs),
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatLabel: {
    fontSize: getResponsiveSpacing(12),
    marginBottom: getResponsiveSpacing(spacing.xs),
  },
  progressStatValue: {
    fontSize: getResponsiveSpacing(16),
    fontWeight: 'bold',
  },
  quickActionsCard: {
    marginBottom: getResponsiveSpacing(spacing.md),
    borderRadius: getResponsiveBorderRadius(borderRadius.card),
    ...shadows.md,
  },
  quickActionsContent: {
    padding: getResponsiveSpacing(spacing.lg),
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getResponsiveSpacing(spacing.md),
    gap: getResponsiveSpacing(spacing.sm),
  },
  quickActionButton: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: getResponsiveSpacing(spacing.md),
    gap: getResponsiveSpacing(spacing.sm),
  },
  activityCard: {
    borderRadius: getResponsiveBorderRadius(borderRadius.card),
    ...shadows.md,
  },
  activityContent: {
    padding: getResponsiveSpacing(spacing.lg),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(spacing.md),
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: getResponsiveSpacing(16),
  },
  seeAllButton: {
    padding: 0,
  },
  seeAllButtonLabel: {
    fontSize: getResponsiveSpacing(14),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(spacing.md),
  },
  activityIcon: {
    width: getResponsiveComponentSize(40, 'avatar'),
    height: getResponsiveComponentSize(40, 'avatar'),
    borderRadius: getResponsiveComponentSize(20, 'avatar'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveSpacing(spacing.md),
  },
  activityItemContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: getResponsiveSpacing(16),
    fontWeight: '600',
    marginBottom: getResponsiveSpacing(spacing.xs),
  },
  activityCompany: {
    fontSize: getResponsiveSpacing(14),
    marginBottom: getResponsiveSpacing(spacing.xs),
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: getResponsiveSpacing(spacing.sm),
    paddingVertical: getResponsiveSpacing(spacing.xs),
    borderRadius: getResponsiveBorderRadius(borderRadius.chip),
  },
  statusChipText: {
    color: colors.white,
    fontSize: getResponsiveSpacing(10),
    fontWeight: '600',
  },
  activityTime: {
    fontSize: getResponsiveSpacing(12),
  },
  divider: {
    marginLeft: getResponsiveComponentSize(52, 'avatar'),
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(spacing.xxl),
  },
  emptyText: {
    fontSize: getResponsiveSpacing(16),
    fontWeight: '600',
    marginTop: getResponsiveSpacing(spacing.md),
    marginBottom: getResponsiveSpacing(spacing.xs),
  },
  emptySubtext: {
    fontSize: getResponsiveSpacing(14),
    textAlign: 'center',
    marginBottom: getResponsiveSpacing(spacing.md),
  },
  addJobButton: {
    marginTop: getResponsiveSpacing(spacing.sm),
  },
});

export default DashboardScreen;