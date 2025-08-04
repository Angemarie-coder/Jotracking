import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Job, JobStatus, NavigationProps } from '../types';
import apiService from '../services/api';

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interviewing: 0,
    offers: 0,
    rejected: 0,
    saved: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const loadData = async () => {
    try {
      const [statsData, jobsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getJobs({ search: '', status: undefined })
      ]);
      
      setStats(statsData);
      setRecentJobs(jobsData.slice(0, 5)); // Show only 5 recent jobs
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.APPLIED: return '#2196F3';
      case JobStatus.INTERVIEWING: return '#FF9800';
      case JobStatus.OFFER: return '#4CAF50';
      case JobStatus.REJECTED: return '#F44336';
      case JobStatus.SAVED: return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case JobStatus.APPLIED: return 'Applied';
      case JobStatus.INTERVIEWING: return 'Interviewing';
      case JobStatus.OFFER: return 'Offer';
      case JobStatus.REJECTED: return 'Rejected';
      case JobStatus.SAVED: return 'Saved';
      default: return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.title}>Dashboard</Title>
        <Button
          mode="contained"
          onPress={() => (navigation as any).navigate('AddJob')}
          icon="plus"
        >
          Add Job
        </Button>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.total}</Title>
            <Paragraph>Total Applications</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.applied}</Title>
            <Paragraph>Applied</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.interviewing}</Title>
            <Paragraph>Interviewing</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.offers}</Title>
            <Paragraph>Offers</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Applications */}
      <Card style={styles.recentCard}>
        <Card.Content>
          <Title>Recent Applications</Title>
          {recentJobs.length === 0 ? (
            <Paragraph style={styles.emptyText}>No applications yet</Paragraph>
          ) : (
            recentJobs.map((job) => (
              <View key={job.id} style={styles.jobItem}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                  {job.location && (
                    <Text style={styles.jobLocation}>{job.location}</Text>
                  )}
                </View>
                <Chip
                  mode="outlined"
                  textStyle={{ color: getStatusColor(job.status) }}
                  style={[styles.statusChip, { borderColor: getStatusColor(job.status) }]}
                >
                  {getStatusLabel(job.status)}
                </Chip>
              </View>
            ))
          )}
          {recentJobs.length > 0 && (
            <Button
              mode="text"
              onPress={() => (navigation as any).navigate('Jobs')}
              style={styles.viewAllButton}
            >
              View All Applications
            </Button>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  recentCard: {
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  jobItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  jobCompany: {
    fontSize: 14,
    color: '#666',
  },
  jobLocation: {
    fontSize: 12,
    color: '#999',
  },
  statusChip: {
    marginLeft: 8,
  },
  viewAllButton: {
    marginTop: 16,
  },
});

export default DashboardScreen; 