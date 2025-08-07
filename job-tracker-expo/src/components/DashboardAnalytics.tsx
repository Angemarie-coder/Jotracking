import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardStats } from '../types';

interface DashboardAnalyticsProps {
  stats: DashboardStats;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ stats }) => {
  const theme = useTheme();

  const calculateApplicationRate = () => {
    if (!stats.total || stats.total === 0) return 0;
    return Math.round((stats.applied / stats.total) * 100);
  };

  const calculateInterviewRate = () => {
    if (!stats.applied || stats.applied === 0) return 0;
    return Math.round((stats.interviewing / stats.applied) * 100);
  };

  const calculateOfferRate = () => {
    if (!stats.interviewing || stats.interviewing === 0) return 0;
    return Math.round((stats.offers / stats.interviewing) * 100);
  };

  const getRateColor = (rate: number) => {
    if (rate >= 80) return '#4CAF50';
    if (rate >= 60) return '#FF9800';
    if (rate >= 40) return '#2196F3';
    return '#9E9E9E';
  };

  const getRateIcon = (rate: number) => {
    if (rate >= 80) return 'trending-up';
    if (rate >= 60) return 'trending-neutral';
    return 'trending-down';
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Analytics & Insights
        </Text>
        
        <View style={styles.analyticsGrid}>
          {/* Application Rate */}
          <View style={styles.analyticsItem}>
            <View style={styles.analyticsHeader}>
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={styles.analyticsLabel}>Application Rate</Text>
            </View>
            <View style={styles.analyticsValue}>
              <Text style={[styles.rateValue, { color: getRateColor(calculateApplicationRate()) }]}>
                {calculateApplicationRate()}%
              </Text>
              <MaterialCommunityIcons 
                name={getRateIcon(calculateApplicationRate())} 
                size={16} 
                color={getRateColor(calculateApplicationRate())} 
              />
            </View>
            <Text style={styles.analyticsSubtext}>
              {stats.applied} of {stats.total} jobs applied
            </Text>
          </View>

          {/* Interview Rate */}
          <View style={styles.analyticsItem}>
            <View style={styles.analyticsHeader}>
              <MaterialCommunityIcons 
                name="account-tie" 
                size={20} 
                color="#FF9800" 
              />
              <Text style={styles.analyticsLabel}>Interview Rate</Text>
            </View>
            <View style={styles.analyticsValue}>
              <Text style={[styles.rateValue, { color: getRateColor(calculateInterviewRate()) }]}>
                {calculateInterviewRate()}%
              </Text>
              <MaterialCommunityIcons 
                name={getRateIcon(calculateInterviewRate())} 
                size={16} 
                color={getRateColor(calculateInterviewRate())} 
              />
            </View>
            <Text style={styles.analyticsSubtext}>
              {stats.interviewing} of {stats.applied} applications
            </Text>
          </View>

          {/* Offer Rate */}
          <View style={styles.analyticsItem}>
            <View style={styles.analyticsHeader}>
              <MaterialCommunityIcons 
                name="trophy" 
                size={20} 
                color="#9C27B0" 
              />
              <Text style={styles.analyticsLabel}>Offer Rate</Text>
            </View>
            <View style={styles.analyticsValue}>
              <Text style={[styles.rateValue, { color: getRateColor(calculateOfferRate()) }]}>
                {calculateOfferRate()}%
              </Text>
              <MaterialCommunityIcons 
                name={getRateIcon(calculateOfferRate())} 
                size={16} 
                color={getRateColor(calculateOfferRate())} 
              />
            </View>
            <Text style={styles.analyticsSubtext}>
              {stats.offers} of {stats.interviewing} interviews
            </Text>
          </View>

          {/* Success Rate */}
          <View style={styles.analyticsItem}>
            <View style={styles.analyticsHeader}>
              <MaterialCommunityIcons 
                name="chart-line" 
                size={20} 
                color="#4CAF50" 
              />
              <Text style={styles.analyticsLabel}>Success Rate</Text>
            </View>
            <View style={styles.analyticsValue}>
              <Text style={[styles.rateValue, { color: getRateColor(calculateOfferRate()) }]}>
                {Math.round((stats.offers / Math.max(stats.total, 1)) * 100)}%
              </Text>
              <MaterialCommunityIcons 
                name="star" 
                size={16} 
                color="#FFD700" 
              />
            </View>
            <Text style={styles.analyticsSubtext}>
              {stats.offers} offers from {stats.total} total
            </Text>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text variant="titleSmall" style={styles.insightsTitle}>
            💡 Insights
          </Text>
          <View style={styles.insightsList}>
            {stats.total === 0 && (
              <Text style={styles.insightText}>
                • Start by adding your first job application
              </Text>
            )}
            {stats.total > 0 && stats.applied === 0 && (
              <Text style={styles.insightText}>
                • You have {stats.saved} saved jobs. Consider applying to some!
              </Text>
            )}
            {stats.applied > 0 && calculateApplicationRate() < 50 && (
              <Text style={styles.insightText}>
                • Try applying to more of your saved jobs to increase your chances
              </Text>
            )}
            {stats.interviewing > 0 && calculateInterviewRate() > 70 && (
              <Text style={styles.insightText}>
                • Great interview rate! Keep up the momentum
              </Text>
            )}
            {stats.offers > 0 && (
              <Text style={styles.insightText}>
                • Congratulations! You have {stats.offers} offer{stats.offers > 1 ? 's' : ''}
              </Text>
            )}
            {stats.rejected > 0 && (
              <Text style={styles.insightText}>
                • Don't get discouraged by {stats.rejected} rejection{stats.rejected > 1 ? 's' : ''}. Keep applying!
              </Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  analyticsItem: {
    width: '48%',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  analyticsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  analyticsSubtext: {
    fontSize: 10,
    opacity: 0.7,
  },
  insightsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  insightsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  insightsList: {
    gap: 4,
  },
  insightText: {
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 16,
  },
});

export default DashboardAnalytics; 