import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, useWindowDimensions, ScrollView, StatusBar, Modal } from 'react-native';
import { Searchbar, Card, Title, Paragraph, ActivityIndicator, useTheme, Text, Chip, Snackbar, Portal, Button as PaperButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Job, JobStatus, NavigationProps, JobFilters } from '../types';
import apiService from '../services/api';
import Button from '../components/Button';
import useApi from '../hooks/useApi';
import ErrorHandler from '../utils/errorHandler';
import { 
  getResponsiveSpacing, 
  getResponsiveComponentSize, 
  getResponsiveBorderRadius,
  getResponsiveLayout,
  isSmallScreen,
  isLargeScreen,
  getScreenPadding,
  getSafeAreaTop
} from '../utils/responsive';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const JobListScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const responsiveLayout = getResponsiveLayout();
  const navigation = useNavigation<NavigationProps>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>('all');
  const [filters, setFilters] = useState<JobFilters>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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
        setJobs((prev: Job[] | null) => prev ? [...prev, ...result] : result);
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
        return colors.statusSaved;
      case JobStatus.APPLIED:
        return colors.statusApplied;
      case JobStatus.INTERVIEWING:
        return colors.statusInterviewing;
      case JobStatus.OFFER:
        return colors.statusOffer;
      case JobStatus.REJECTED:
        return colors.statusRejected;
      default:
        return colors.gray500;
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SAVED:
        return 'bookmark';
      case JobStatus.APPLIED:
        return 'send';
      case JobStatus.INTERVIEWING:
        return 'account-tie';
      case JobStatus.OFFER:
        return 'trophy';
      case JobStatus.REJECTED:
        return 'close-circle';
      default:
        return 'briefcase';
    }
  };

  const getStatusLabel = (status: JobStatus | 'all') => {
    switch (status) {
      case 'all':
        return 'All Jobs';
      case JobStatus.SAVED:
        return 'Saved';
      case JobStatus.APPLIED:
        return 'Applied';
      case JobStatus.INTERVIEWING:
        return 'Interviewing';
      case JobStatus.OFFER:
        return 'Offers';
      case JobStatus.REJECTED:
        return 'Rejected';
      default:
        return 'All Jobs';
    }
  };

  const statusFilters: Array<{ 
    label: string; 
    value: JobStatus | 'all'; 
    icon: string;
    color: string;
  }> = [
    { 
      label: 'All Jobs', 
      value: 'all', 
      icon: 'briefcase-outline',
      color: theme.colors.primary
    },
    { 
      label: 'Saved', 
      value: JobStatus.SAVED, 
      icon: 'bookmark-outline',
      color: colors.statusSaved
    },
    { 
      label: 'Applied', 
      value: JobStatus.APPLIED, 
      icon: 'send',
      color: colors.statusApplied
    },
    { 
      label: 'Interview', 
      value: JobStatus.INTERVIEWING, 
      icon: 'account-tie',
      color: colors.statusInterviewing
    },
    { 
      label: 'Offer', 
      value: JobStatus.OFFER, 
      icon: 'trophy',
      color: colors.statusOffer
    },
    { 
      label: 'Rejected', 
      value: JobStatus.REJECTED, 
      icon: 'close-circle',
      color: colors.statusRejected
    },
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setFilterModalVisible(false);
  };

  const handleStatusFilter = (status: JobStatus | 'all') => {
    setSelectedStatus(status);
    setFilterModalVisible(false);
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const getCurrentFilterInfo = () => {
    const currentFilter = statusFilters.find(filter => filter.value === selectedStatus);
    return currentFilter || statusFilters[0];
  };

  if (loading && !jobs) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const currentFilter = getCurrentFilterInfo();

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={theme.colors.background} 
        translucent={false}
      />
      
      <View style={styles.container}>
        {/* Fixed Header with Search and Add Button */}
        <View style={styles.header}>
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
              icon="plus"
              variant="primary"
            />
          </View>
        </View>

        {/* Filter Button */}
        <View style={styles.filterButtonContainer}>
          <Button
            mode="outlined"
            onPress={openFilterModal}
            style={styles.filterButton}
            title={getStatusLabel(selectedStatus)}
            icon={currentFilter.icon}
            iconPosition="left"
            variant="secondary"
            size="medium"
          />
          
          {(searchQuery || selectedStatus !== 'all') && (
            <Button
              mode="text"
              onPress={clearFilters}
              style={styles.clearFiltersButton}
              title="Clear"
              icon="close"
              variant="secondary"
              size="small"
            />
          )}
        </View>

        {/* Jobs List */}
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
                <Text style={[styles.loadingMoreText, { color: theme.colors.onSurfaceVariant }]}>
                  Loading more jobs...
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="briefcase-outline" 
                size={getResponsiveComponentSize(64, 'avatar')} 
                color={theme.colors.outline} 
              />
              <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
                {searchQuery || selectedStatus !== 'all' 
                  ? 'No jobs match your filters' 
                  : 'No jobs found'
                }
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery || selectedStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start tracking your job applications'
                }
              </Text>
              {searchQuery || selectedStatus !== 'all' ? (
                <Button
                  mode="outlined"
                  onPress={clearFilters}
                  style={styles.clearFiltersButton}
                  title="Clear Filters"
                  variant="secondary"
                />
              ) : (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddJob')}
                  style={styles.addFirstJobButton}
                  title="Add Your First Job"
                  icon="plus"
                  variant="primary"
                />
              )}
            </View>
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card
              style={[styles.jobCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
            >
              <Card.Content style={styles.jobCardContent}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Title style={[styles.jobTitle, { color: theme.colors.onSurface }]} numberOfLines={2}>
                      {item.title}
                    </Title>
                    <View style={styles.jobMeta}>
                      <MaterialCommunityIcons 
                        name={getStatusIcon(item.status)} 
                        size={getResponsiveComponentSize(16, 'button')} 
                        color={getStatusColor(item.status)} 
                      />
                      <Text style={[styles.jobStatus, { color: getStatusColor(item.status) }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <MaterialCommunityIcons 
                      name={getStatusIcon(item.status)} 
                      size={getResponsiveComponentSize(12, 'button')} 
                      color={colors.white} 
                    />
                  </View>
                </View>
                
                <Paragraph style={[styles.companyName, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                  {item.company}
                </Paragraph>
                
                <View style={styles.jobDetails}>
                  {item.location && (
                    <View style={[styles.detailItem, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <MaterialCommunityIcons 
                        name="map-marker" 
                        size={getResponsiveComponentSize(14, 'button')} 
                        color={theme.colors.onSurfaceVariant} 
                      />
                      <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                  )}
                  
                  {item.createdAt && (
                    <View style={[styles.detailItem, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <MaterialCommunityIcons 
                        name="calendar" 
                        size={getResponsiveComponentSize(14, 'button')} 
                        color={theme.colors.onSurfaceVariant} 
                      />
                      <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  )}

                  {item.salary && (
                    <View style={[styles.detailItem, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <MaterialCommunityIcons 
                        name="currency-usd" 
                        size={getResponsiveComponentSize(14, 'button')} 
                        color={theme.colors.onSurfaceVariant} 
                      />
                      <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        {item.salary}
                      </Text>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          )}
        />
      </View>

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={filterModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeFilterModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                  Filter Jobs
                </Text>
                <PaperButton
                  icon="close"
                  onPress={closeFilterModal}
                  mode="text"
                  compact
                >
                  Close
                </PaperButton>
              </View>
              
              <ScrollView style={styles.filterList}>
                {statusFilters.map((filter) => (
                  <View key={filter.value} style={styles.filterOption}>
                    <Button
                      mode={selectedStatus === filter.value ? 'contained' : 'outlined'}
                      onPress={() => handleStatusFilter(filter.value)}
                      style={[
                        styles.filterOptionButton,
                        selectedStatus === filter.value && {
                          backgroundColor: filter.color,
                          borderColor: filter.color,
                        }
                      ]}
                      title={filter.label}
                      icon={filter.icon}
                      iconPosition="left"
                      variant={selectedStatus === filter.value ? 'primary' : 'secondary'}
                      size="medium"
                      fullWidth
                    />
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <Button
                  mode="outlined"
                  onPress={clearFilters}
                  style={styles.modalClearButton}
                  title="Clear All Filters"
                  variant="secondary"
                  fullWidth
                />
              </View>
            </View>
          </View>
        </Modal>
      </Portal>

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
    backgroundColor: colors.gray50,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: getScreenPadding(),
    paddingTop: getSafeAreaTop() + getResponsiveSpacing(spacing.sm),
    paddingBottom: getResponsiveSpacing(spacing.md),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    ...shadows.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSpacing(spacing.sm),
  },
  searchBar: {
    flex: 1,
    height: getResponsiveComponentSize(48, 'input'),
    borderRadius: getResponsiveBorderRadius(borderRadius.input),
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  addButton: {
    height: getResponsiveComponentSize(48, 'input'),
    justifyContent: 'center',
    borderRadius: getResponsiveBorderRadius(borderRadius.button),
    minWidth: getResponsiveSpacing(100),
  },
  filterButtonContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: getScreenPadding(),
    paddingVertical: getResponsiveSpacing(spacing.md),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginRight: getResponsiveSpacing(spacing.sm),
  },
  clearFiltersButton: {
    minWidth: getResponsiveSpacing(60),
  },
  listContent: {
    padding: getScreenPadding(),
    paddingTop: getResponsiveSpacing(spacing.md),
  },
  jobCard: {
    marginBottom: getResponsiveSpacing(spacing.md),
    borderRadius: getResponsiveBorderRadius(borderRadius.card),
    ...shadows.md,
  },
  jobCardContent: {
    padding: getResponsiveSpacing(spacing.lg),
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getResponsiveSpacing(spacing.sm),
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: getResponsiveSpacing(spacing.sm),
  },
  jobTitle: {
    fontSize: getResponsiveSpacing(18),
    lineHeight: getResponsiveSpacing(24),
    marginBottom: getResponsiveSpacing(spacing.xs),
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSpacing(spacing.xs),
  },
  jobStatus: {
    fontSize: getResponsiveSpacing(12),
    fontWeight: '600',
  },
  statusBadge: {
    width: getResponsiveComponentSize(24, 'avatar'),
    height: getResponsiveComponentSize(24, 'avatar'),
    borderRadius: getResponsiveComponentSize(12, 'avatar'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyName: {
    fontSize: getResponsiveSpacing(16),
    marginBottom: getResponsiveSpacing(spacing.md),
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveSpacing(spacing.sm),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(spacing.sm),
    paddingVertical: getResponsiveSpacing(spacing.xs),
    borderRadius: getResponsiveBorderRadius(borderRadius.chip),
    gap: getResponsiveSpacing(spacing.xs),
  },
  detailText: {
    fontSize: getResponsiveSpacing(12),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getResponsiveSpacing(spacing.xxl),
  },
  emptyText: {
    fontSize: getResponsiveSpacing(18),
    fontWeight: '600',
    marginTop: getResponsiveSpacing(spacing.md),
    marginBottom: getResponsiveSpacing(spacing.sm),
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: getResponsiveSpacing(14),
    textAlign: 'center',
    marginBottom: getResponsiveSpacing(spacing.lg),
  },
  addFirstJobButton: {
    marginTop: getResponsiveSpacing(spacing.sm),
  },
  loadingMore: {
    padding: getResponsiveSpacing(spacing.md),
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: getResponsiveSpacing(spacing.sm),
    fontSize: getResponsiveSpacing(14),
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: getResponsiveBorderRadius(borderRadius.xl),
    borderTopRightRadius: getResponsiveBorderRadius(borderRadius.xl),
    paddingTop: getResponsiveSpacing(spacing.lg),
    maxHeight: '70%',
    ...shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getScreenPadding(),
    paddingBottom: getResponsiveSpacing(spacing.md),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: getResponsiveSpacing(20),
    fontWeight: 'bold',
  },
  filterList: {
    paddingHorizontal: getScreenPadding(),
    paddingVertical: getResponsiveSpacing(spacing.md),
  },
  filterOption: {
    marginBottom: getResponsiveSpacing(spacing.sm),
  },
  filterOptionButton: {
    borderRadius: getResponsiveBorderRadius(borderRadius.button),
  },
  modalFooter: {
    paddingHorizontal: getScreenPadding(),
    paddingVertical: getResponsiveSpacing(spacing.md),
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  modalClearButton: {
    borderRadius: getResponsiveBorderRadius(borderRadius.button),
  },
});

export default JobListScreen;