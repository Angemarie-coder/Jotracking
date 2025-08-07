import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, useWindowDimensions, ScrollView } from 'react-native';
import { Searchbar, Card, Title, Paragraph, ActivityIndicator, useTheme, Text, Chip, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Job, JobStatus, NavigationProps, JobFilters } from '../types';
import apiService from '../services/api';
import Button from '../components/Button';
import useApi from '../hooks/useApi';
import ErrorHandler from '../utils/errorHandler';

const JobListScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation<NavigationProps>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>('all');
  const [filters, setFilters] = useState<JobFilters>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // API hook for jobs
  const {
    data: jobs,
    loading,
    error,
    execute: loadJobs,
    reset: resetJobs,
    setData: setJobs
  } = useApi<Job[]>(() => apiService.getJobs(filters));

  const loadJobsWithFilters = async (newFilters: JobFilters, resetPage: boolean = false) => {
    const currentPage = resetPage ? 1 : page;
    const updatedFilters = { ...newFilters, page: currentPage, limit: 20 };
    
    try {
      const result = await apiService.getJobs(updatedFilters);
      if (resetPage || currentPage === 1) {
        setJobs(result);
      } else {
        setJobs(prev => prev ? [...prev, ...result] : result);
      }
      setHasMore(result.length === 20);
      setPage(currentPage + 1);
    } catch (error) {
      const appError = ErrorHandler.handle(error, 'Jobs Error');
      ErrorHandler.showAlert(appError);
    }
  };

  const onRefresh = async () => {
    setPage(1);
    setHasMore(true);
    resetJobs();
    await loadJobsWithFilters(filters, true);
  };

  const loadMore = async () => {
    if (!loading && hasMore) {
      await loadJobsWithFilters(filters);
    }
  };

  useEffect(() => {
    const newFilters: JobFilters = {};
    if (searchQuery) newFilters.search = searchQuery;
    if (selectedStatus !== 'all') newFilters.status = selectedStatus;
    
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
    loadJobsWithFilters(newFilters, true);
  }, [searchQuery, selectedStatus]);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SAVED:
        return '#4CAF50';
      case JobStatus.APPLIED:
        return '#2196F3';
      case JobStatus.INTERVIEWING:
        return '#FF9800';
      case JobStatus.OFFER:
        return '#9C27B0';
      case JobStatus.REJECTED:
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const statusFilters: Array<{ label: string; value: JobStatus | 'all' }> = [
    { label: 'All', value: 'all' },
    { label: 'Saved', value: JobStatus.SAVED },
    { label: 'Applied', value: JobStatus.APPLIED },
    { label: 'Interview', value: JobStatus.INTERVIEWING },
    { label: 'Offer', value: JobStatus.OFFER },
    { label: 'Rejected', value: JobStatus.REJECTED },
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
  };

  if (loading && !jobs) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search jobs..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            iconColor={theme.colors.onSurfaceVariant}
            inputStyle={{ color: theme.colors.onSurface }}
          />
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddJob')}
            style={styles.addButton}
            title="Add Job"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statusFilter}
          contentContainerStyle={styles.statusFilterContent}
        >
          {statusFilters.map((filter) => (
            <Chip
              key={filter.value}
              mode={selectedStatus === filter.value ? 'flat' : 'outlined'}
              selected={selectedStatus === filter.value}
              onPress={() => setSelectedStatus(filter.value)}
              style={[
                styles.statusChip,
                selectedStatus === filter.value && {
                  backgroundColor: filter.value === 'all' 
                    ? theme.colors.primary 
                    : getStatusColor(filter.value as JobStatus),
                  borderColor: 'transparent',
                },
              ]}
              textStyle={{
                color: selectedStatus === filter.value 
                  ? '#FFFFFF' 
                  : theme.colors.onSurface,
              }}
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>

        <FlatList
          data={jobs || []}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading && page === 1}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loading && page > 1 ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingMoreText}>Loading more jobs...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery || selectedStatus !== 'all' 
                  ? 'No jobs match your filters' 
                  : 'No jobs found'
                }
              </Text>
              {searchQuery || selectedStatus !== 'all' ? (
                <Button
                  mode="outlined"
                  onPress={clearFilters}
                  style={styles.clearFiltersButton}
                  title="Clear Filters"
                />
              ) : (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddJob')}
                  style={styles.addFirstJobButton}
                  title="Add Your First Job"
                />
              )}
            </View>
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card
              style={styles.jobCard}
              onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
            >
              <Card.Content>
                <View style={styles.jobHeader}>
                  <Title style={styles.jobTitle} numberOfLines={1}>
                    {item.title}
                  </Title>
                  <Chip
                    compact
                    style={[
                      styles.statusChip,
                      { 
                        backgroundColor: `${getStatusColor(item.status)}20`,
                        borderColor: getStatusColor(item.status),
                      },
                    ]}
                    textStyle={{
                      color: getStatusColor(item.status),
                      fontSize: 12,
                    }}
                  >
                    {item.status}
                  </Chip>
                </View>
                
                <Paragraph style={styles.companyName} numberOfLines={1}>
                  {item.company}
                </Paragraph>
                
                <View style={styles.jobMeta}>
                  {item.location && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaText} numberOfLines={1}>
                        📍 {item.location}
                      </Text>
                    </View>
                  )}
                  
                  {item.createdAt && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaText} numberOfLines={1}>
                        📅 {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  )}

                  {item.salary && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaText} numberOfLines={1}>
                        💰 {item.salary}
                      </Text>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          )}
        />
      </View>

      {/* Error Snackbar */}
      <Snackbar
        visible={!!error}
        onDismiss={() => resetJobs()}
        action={{
          label: 'Retry',
          onPress: onRefresh,
        }}
      >
        {error?.message || 'An error occurred'}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flex: 1,
    marginRight: 12,
    height: 48,
    borderRadius: 8,
    elevation: 2,
  },
  addButton: {
    height: 48,
    justifyContent: 'center',
    borderRadius: 8,
  },
  statusFilter: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  statusFilterContent: {
    paddingHorizontal: 8,
  },
  statusChip: {
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  jobCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  jobTitle: {
    flex: 1,
    marginRight: 8,
    fontSize: 18,
    lineHeight: 24,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  metaItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  clearFiltersButton: {
    marginTop: 16,
    borderColor: '#666',
  },
  addFirstJobButton: {
    marginTop: 16,
  },
  loadingMore: {
    padding: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
});

export default JobListScreen;