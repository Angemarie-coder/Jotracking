import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Title, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CreateJobRequest, JobStatus } from '../types';
import apiService from '../services/api';

const AddJobScreen = () => {
  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    company: '',
    location: '',
    url: '',
    salary: '',
    status: JobStatus.SAVED,
    appliedDate: '',
    description: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!formData.title || !formData.company) {
      Alert.alert('Error', 'Please fill in the required fields (Title and Company)');
      return;
    }

    setLoading(true);
    try {
      await apiService.createJob(formData);
      Alert.alert('Success', 'Job application added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add job application');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof CreateJobRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SAVED: return 'Saved';
      case JobStatus.APPLIED: return 'Applied';
      case JobStatus.INTERVIEWING: return 'Interviewing';
      case JobStatus.OFFER: return 'Offer';
      case JobStatus.REJECTED: return 'Rejected';
      default: return status;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Add New Job Application</Title>
            
            {/* Required Fields */}
            <TextInput
              label="Job Title *"
              value={formData.title}
              onChangeText={(value) => updateFormData('title', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Company *"
              value={formData.company}
              onChangeText={(value) => updateFormData('company', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Location"
              value={formData.location}
              onChangeText={(value) => updateFormData('location', value)}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Job URL"
              value={formData.url}
              onChangeText={(value) => updateFormData('url', value)}
              mode="outlined"
              style={styles.input}
              keyboardType="url"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Salary"
              value={formData.salary}
              onChangeText={(value) => updateFormData('salary', value)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., $50,000 - $70,000"
            />
            
            {/* Status Selection */}
            <Text style={styles.label}>Application Status</Text>
            <SegmentedButtons
              value={formData.status}
              onValueChange={(value) => updateFormData('status', value as JobStatus)}
              buttons={Object.values(JobStatus).map(status => ({
                value: status,
                label: getStatusLabel(status),
              }))}
              style={styles.segmentedButton}
            />
            
            <TextInput
              label="Applied Date"
              value={formData.appliedDate}
              onChangeText={(value) => updateFormData('appliedDate', value)}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />
            
            <TextInput
              label="Job Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
            />
            
            <TextInput
              label="Notes"
              value={formData.notes}
              onChangeText={(value) => updateFormData('notes', value)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Any additional notes about this application..."
            />
            
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={[styles.button, styles.cancelButton]}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                Add Job
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  segmentedButton: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    marginRight: 8,
  },
});

export default AddJobScreen; 