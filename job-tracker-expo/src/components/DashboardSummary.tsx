import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardStats } from '../types';

interface DashboardSummaryProps {
  stats: DashboardStats;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ stats }) => {
  const theme = useTheme();

  const getAchievementLevel = () => {
    const total = stats.total || 0;
    if (total >= 50) return { level: 'Expert', icon: 'trophy', color: '#FFD700' };
    if (total >= 25) return { level: 'Advanced', icon: 'star', color: '#FF9800' };
    if (total >= 10) return { level: 'Intermediate', icon: 'star-outline', color: '#2196F3' };
    return { level: 'Beginner', icon: 'star-outline', color: '#9E9E9E' };
  };

  const getMotivationalMessage = () => {
    const achievement = getAchievementLevel();
    const total = stats.total || 0;
    const offers = stats.offers || 0;

    if (offers > 0) {
      return `🎉 Congratulations! You have ${offers} offer${offers > 1 ? 's' : ''}!`;
    }

    if (stats.interviewing && stats.interviewing > 0) {
      return `🚀 Great job! You have ${stats.interviewing} interview${stats.interviewing > 1 ? 's' : ''} lined up.`;
    }

    if (stats.applied && stats.applied > 0) {
      return `📝 You've applied to ${stats.applied} job${stats.applied > 1 ? 's' : ''}. Keep going!`;
    }

    if (total > 0) {
      return `💼 You have ${total} job${total > 1 ? 's' : ''} in your tracker. Ready to apply?`;
    }

    return '🌟 Start your job search journey today!';
  };

  const achievement = getAchievementLevel();

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.achievementContainer}>
            <MaterialCommunityIcons 
              name={achievement.icon as any} 
              size={24} 
              color={achievement.color} 
            />
            <Text style={[styles.achievementLevel, { color: achievement.color }]}>
              {achievement.level}
            </Text>
          </View>
          <View style={styles.statsOverview}>
            <Text style={styles.totalJobs}>{stats.total || 0}</Text>
            <Text style={styles.totalJobsLabel}>Total Jobs</Text>
          </View>
        </View>

        <Text style={styles.motivationalMessage}>
          {getMotivationalMessage()}
        </Text>

        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={16} 
              color="#4CAF50" 
            />
            <Text style={styles.quickStatText}>
              {stats.applied || 0} Applied
            </Text>
          </View>
          <View style={styles.quickStat}>
            <MaterialCommunityIcons 
              name="account-tie" 
              size={16} 
              color="#FF9800" 
            />
            <Text style={styles.quickStatText}>
              {stats.interviewing || 0} Interviewing
            </Text>
          </View>
          <View style={styles.quickStat}>
            <MaterialCommunityIcons 
              name="trophy" 
              size={16} 
              color="#9C27B0" 
            />
            <Text style={styles.quickStatText}>
              {stats.offers || 0} Offers
            </Text>
          </View>
        </View>

        {stats.rejected && stats.rejected > 0 && (
          <View style={styles.rejectionNote}>
            <MaterialCommunityIcons 
              name="heart" 
              size={16} 
              color="#F44336" 
            />
            <Text style={styles.rejectionText}>
              Don't get discouraged by {stats.rejected} rejection{stats.rejected > 1 ? 's' : ''}. 
              Every 'no' brings you closer to 'yes'!
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsOverview: {
    alignItems: 'flex-end',
  },
  totalJobs: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  totalJobsLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  motivationalMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStatText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
  rejectionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  rejectionText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

export default DashboardSummary; 