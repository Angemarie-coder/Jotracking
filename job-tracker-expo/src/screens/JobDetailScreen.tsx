import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator, Chip, IconButton, Menu, Divider } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Job, JobStatus, UpdateJobRequest, RouteProps, NavigationProps } from '../types';
import apiService from '../services/api';

const JobDetailScreen = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
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

  const handleDelete = () => {
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
              await apiService.deleteJob(job!.id);
              Alert.alert('Success', 'Job deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  const openJobUrl = () => {
    if (job?.url) {
      Linking.openURL(job.url);
    }
  };

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

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Text>Job not found</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Actions */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Title style={styles.jobTitle}>{job.title}</Title>
          <Paragraph style={styles.jobCompany}>{job.company}</Paragraph>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(job.status) }}
            style={[styles.statusChip, { borderColor: getStatusColor(job.status) }]}
          >
            {getStatusLabel(job.status)}
          </Chip>
        </View>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              (navigation as any).navigate('EditJob', { jobId: job.id });
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
            titleStyle={{ color: '#F44336' }}
          />
        </Menu>
      </View>

      {/* Job Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Job Details</Title>
          
          {job.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{job.location}</Text>
            </View>
          )}
          
          {job.salary && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Salary:</Text>
              <Text style={styles.detailValue}>{job.salary}</Text>
            </View>
          )}
          
          {job.appliedDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Applied Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(job.appliedDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          {job.url && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Job URL:</Text>
              <Button mode="text" onPress={openJobUrl} compact>
                Open Link
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Description */}
      {job.description && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Job Description</Title>
            <Paragraph>{job.description}</Paragraph>
          </Card.Content>
        </Card>
      )}

      {/* Notes */}
      {job.notes && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notes</Title>
            <Paragraph>{job.notes}</Paragraph>
          </Card.Content>
        </Card>
      )}

      {/* Status Update */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Update Status</Title>
          <View style={styles.statusButtons}>
            {Object.values(JobStatus).map((status) => (
              <Button
                key={status}
                mode={job.status === status ? 'contained' : 'outlined'}
                onPress={() => handleStatusUpdate(status)}
                style={styles.statusButton}
                loading={updating}
                disabled={updating || job.status === status}
              >
                {getStatusLabel(status)}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Timestamps */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Timestamps</Title>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>
              {new Date(job.createdAt).toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Updated:</Text>
            <Text style={styles.detailValue}>
              {new Date(job.updatedAt).toLocaleString()}
            </Text>
          </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContent: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusButton: {
    marginBottom: 8,
  },
});

export default JobDetailScreen; 