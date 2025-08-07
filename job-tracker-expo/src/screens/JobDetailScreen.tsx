import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform } from 'react-native';
import { Card, Title, Paragraph, Text, ActivityIndicator, Chip, IconButton, Menu, Divider, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Job, JobStatus, UpdateJobRequest, NavigationProps } from '../types';
import apiService from '../services/api';
import Button from '../components/Button';
import { format } from 'date-fns';

const JobDetailScreen = () => {
  const theme = useTheme();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const navigation = useNavigation<NavigationProps>();
  const jobId = (route.params as any)?.jobId;

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      const jobData = await apiService.getJob(jobId);
      setJob(jobData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load job details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: JobStatus) => {
    if (!job) return;

    setUpdating(true);
    try {
      const updatedJob = await apiService.updateJob(job.id, { status: newStatus });
      setJob(updatedJob);
      Alert.alert('Success', 'Status updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!job) return;

    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteJob(job.id);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  const openURL = (url: string) => {
    if (!url) return;
    
    // Add https:// if missing
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    Linking.canOpenURL(formattedUrl).then(supported => {
      if (supported) {
        Linking.openURL(formattedUrl);
      } else {
        Alert.alert('Error', 'Could not open the URL');
      }
    });
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.APPLIED: return '#4CAF50';
      case JobStatus.INTERVIEWING: return '#2196F3';
      case JobStatus.OFFER: return '#9C27B0';
      case JobStatus.REJECTED: return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.container}>
        <Text>Job not found</Text>
        <Button 
          onPress={() => navigation.goBack()} 
          style={styles.button}
          title="Go Back"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Title style={styles.title}>{job.title}</Title>
                <Chip 
                  style={[
                    styles.statusChip, 
                    { 
                      backgroundColor: `${getStatusColor(job.status)}20`,
                      borderColor: getStatusColor(job.status),
                    }
                  ]}
                  textStyle={{ color: getStatusColor(job.status) }}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Chip>
              </View>
              
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    onPress={() => setMenuVisible(true)}
                    style={styles.menuButton}
                  />
                }
              >
                <Menu.Item 
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('EditJob', { jobId: job.id });
                  }} 
                  title="Edit" 
                  leadingIcon="pencil"
                />
                <Divider />
                <Menu.Item 
                  onPress={() => {
                    setMenuVisible(false);
                    handleDelete();
                  }} 
                  title="Delete" 
                  leadingIcon="delete"
                  titleStyle={{ color: theme.colors.error }}
                />
              </Menu>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company</Text>
              <Text style={styles.companyName}>{job.company}</Text>
              
              {(job.location || job.url) && (
                <View style={styles.metaContainer}>
                  {job.location && (
                    <View style={styles.metaItem}>
                      <IconButton
                        icon="map-marker"
                        size={16}
                        iconColor={theme.colors.onSurfaceVariant}
                        style={styles.metaIcon}
                      />
                      <Text style={styles.metaText}>{job.location}</Text>
                    </View>
                  )}
                  
                  {job.url && (
                    <Button 
                      mode="text" 
                      onPress={() => openURL(job.url as string)}
                      style={styles.urlButton}
                      textColor={theme.colors.primary}
                      title="View Job Posting"
                    />
                  )}
                </View>
              )}
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Applied Date</Text>
                <Text style={styles.detailValue}>
                  {job.appliedDate ? formatDate(job.appliedDate) : 'Not specified'}
                </Text>
              </View>
              
              {job.salary && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Salary</Text>
                  <Text style={styles.detailValue}>{job.salary}</Text>
                </View>
              )}
            </View>

            {job.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text style={styles.description}>{job.description}</Text>
              </View>
            )}

            {job.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notes}>{job.notes}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Update Status</Text>
          <View style={styles.statusButtons}>
            {['saved', 'applied', 'interviewing', 'offer', 'rejected'].map((status) => (
              <Button
                key={status}
                mode={job.status === status ? 'contained' : 'outlined'}
                onPress={() => handleStatusUpdate(status as JobStatus)}
                loading={updating && job.status === status}
                disabled={updating}
                style={[
                  styles.statusButton,
                  job.status === status && { 
                    backgroundColor: getStatusColor(status as JobStatus),
                    borderColor: getStatusColor(status as JobStatus),
                  },
                ]}
                textColor={job.status === status ? 'white' : undefined}
                title={status.charAt(0).toUpperCase() + status.slice(1)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuButton: {
    margin: -8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaIcon: {
    margin: 0,
    marginRight: 4,
    width: 20,
    height: 20,
  },
  metaText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  urlButton: {
    marginLeft: -8,
    height: 36,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  detailItem: {
    width: '50%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.9)',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.7)',
    fontStyle: 'italic',
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
  },
  statusButton: {
    margin: 4,
    flex: 1,
    minWidth: 100,
  },
  button: {
    marginTop: 16,
  },
});

export default JobDetailScreen;