import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator, Chip, Searchbar, Menu, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Job, JobStatus, JobFilters, NavigationProps } from '../types';
import apiService from '../services/api';

const JobListScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | undefined>(undefined);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  const loadJobs = async () => {
    try {
      const filters: JobFilters = {
        search: searchQuery || undefined,
        status: statusFilter,
      };
      const jobsData = await apiService.getJobs(filters);
      setJobs(jobsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    loadJobs();
  }, [searchQuery, statusFilter]);

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

  const renderJobItem = ({ item }: { item: Job }) => (
    <Card style={styles.jobCard} onPress={() => (navigation as any).navigate('JobDetail', { jobId: item.id })}>
      <Card.Content>
        <View style={styles.jobHeader}>
          <View style={styles.jobInfo}>
            <Title style={styles.jobTitle}>{item.title}</Title>
            <Paragraph style={styles.jobCompany}>{item.company}</Paragraph>
            {item.location && (
              <Text style={styles.jobLocation}>{item.location}</Text>
            )}
          </View>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(item.status) }}
            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
          >
            {getStatusLabel(item.status)}
          </Chip>
        </View>
        
        {item.salary && (
          <Text style={styles.jobSalary}>Salary: {item.salary}</Text>
        )}
        
        {item.appliedDate && (
          <Text style={styles.jobDate}>Applied: {new Date(item.appliedDate).toLocaleDateString()}</Text>
        )}
      </Card.Content>
    </Card>
  );

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(undefined);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.title}>Job Applications</Title>
        <Button
          mode="contained"
          onPress={() => (navigation as any).navigate('AddJob')}
          icon="plus"
        >
          Add Job
        </Button>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search jobs..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setFilterMenuVisible(true)}
              icon="filter"
            >
              Filter
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setStatusFilter(undefined);
              setFilterMenuVisible(false);
            }}
            title="All Status"
          />
          <Divider />
          {Object.values(JobStatus).map((status) => (
            <Menu.Item
              key={status}
              onPress={() => {
                setStatusFilter(status);
                setFilterMenuVisible(false);
              }}
              title={getStatusLabel(status)}
            />
          ))}
        </Menu>
      </View>

      {/* Active Filters */}
      {(searchQuery || statusFilter) && (
        <View style={styles.activeFilters}>
          <Text style={styles.filterLabel}>Active filters:</Text>
          {searchQuery && (
            <Chip style={styles.filterChip} onClose={() => setSearchQuery('')}>
              Search: {searchQuery}
            </Chip>
          )}
          {statusFilter && (
            <Chip style={styles.filterChip} onClose={() => setStatusFilter(undefined)}>
              Status: {getStatusLabel(statusFilter)}
            </Chip>
          )}
          <Button mode="text" onPress={clearFilters} compact>
            Clear All
          </Button>
        </View>
      )}

      {/* Job List */}
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No jobs found</Text>
            <Button
              mode="contained"
              onPress={() => (navigation as any).navigate('AddJob')}
              style={styles.emptyButton}
            >
              Add Your First Job
            </Button>
          </View>
        }
      />
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    gap: 8,
  },
  searchbar: {
    flex: 1,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  filterLabel: {
    marginRight: 8,
    color: '#666',
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  jobCompany: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  jobSalary: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statusChip: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
});

export default JobListScreen; 