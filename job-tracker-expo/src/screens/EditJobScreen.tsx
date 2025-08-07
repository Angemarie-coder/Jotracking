import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Text, Card, Title, SegmentedButtons, ActivityIndicator, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Job, JobStatus, UpdateJobRequest, NavigationProps } from '../types';
import apiService from '../services/api';
import Button from '../components/Button';

const EditJobScreen = () => {
  const theme = useTheme();
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<UpdateJobRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
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
      setFormData({
        title: jobData.title,
        company: jobData.company,
        location: jobData.location || '',
        url: jobData.url || '',
        salary: jobData.salary || '',
        status: jobData.status,
        appliedDate: jobData.appliedDate || '',
        description: jobData.description || '',
        notes: jobData.notes || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load job details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.company) {
      Alert.alert('Error', 'Please fill in the required fields (Title and Company)');
      return;
    }

    setSaving(true);
    try {
      // Clean up the form data - remove empty strings for optional fields
      const cleanFormData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        status: formData.status,
        ...(formData.location?.trim() && { location: formData.location.trim() }),
        ...(formData.url?.trim() && { url: formData.url.trim() }),
        ...(formData.salary?.trim() && { salary: formData.salary.trim() }),
        ...(formData.appliedDate?.trim() && { appliedDate: formData.appliedDate.trim() }),
        ...(formData.description?.trim() && { description: formData.description.trim() }),
        ...(formData.notes?.trim() && { notes: formData.notes.trim() }),
      };

      console.log('Updating job data:', cleanFormData);
      const result = await apiService.updateJob(jobId, cleanFormData);
      console.log('Job updated successfully:', result);
      Alert.alert('Success', 'Job updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Job update error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to update job';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map((e: any) => e.msg).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: keyof UpdateJobRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Edit Job</Title>
            
            <TextInput
              label="Job Title *"
              value={formData.title || ''}
              onChangeText={(text) => updateFormData('title', text)}
              style={styles.input}
              mode="outlined"
              disabled={saving}
            />
            
            <TextInput
              label="Company *"
              value={formData.company || ''}
              onChangeText={(text) => updateFormData('company', text)}
              style={styles.input}
              mode="outlined"
              disabled={saving}
            />
            
            <TextInput
              label="Location"
              value={formData.location || ''}
              onChangeText={(text) => updateFormData('location', text)}
              style={styles.input}
              mode="outlined"
              disabled={saving}
            />
            
            <TextInput
              label="Job URL"
              value={formData.url || ''}
              onChangeText={(text) => updateFormData('url', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="url"
              autoCapitalize="none"
              disabled={saving}
            />
            
            <TextInput
              label="Salary"
              value={formData.salary || ''}
              onChangeText={(text) => updateFormData('salary', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              disabled={saving}
            />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <SegmentedButtons
                value={formData.status || 'saved'}
                onValueChange={(value: string) => updateFormData('status', value as JobStatus)}
                buttons={[
                  { value: 'saved', label: 'Saved', disabled: saving },
                  { value: 'applied', label: 'Applied', disabled: saving },
                  { value: 'interviewing', label: 'Interview', disabled: saving },
                  { value: 'offer', label: 'Offer', disabled: saving },
                  { value: 'rejected', label: 'Rejected', disabled: saving },
                ]}
                style={styles.segmentedButtons}
              />
            </View>
            
            <TextInput
              label="Applied Date"
              value={formData.appliedDate || ''}
              onChangeText={(text) => updateFormData('appliedDate', text)}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
              disabled={saving}
            />
            
            <TextInput
              label="Job Description"
              value={formData.description || ''}
              onChangeText={(text) => updateFormData('description', text)}
              style={[styles.input, styles.textArea]}
              mode="outlined"
              multiline
              numberOfLines={4}
              disabled={saving}
            />
            
            <TextInput
              label="Notes"
              value={formData.notes || ''}
              onChangeText={(text) => updateFormData('notes', text)}
              style={[styles.input, styles.textArea]}
              mode="outlined"
              multiline
              numberOfLines={3}
              disabled={saving}
            />
            
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={saving}
                disabled={saving}
                style={styles.submitButton}
                title={saving ? 'Saving...' : 'Save Changes'}
              />
              
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                disabled={saving}
                style={styles.cancelButton}
                title="Cancel"
              />
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {
    borderColor: '#999',
  },
  button: {
    marginTop: 16,
  },
});

export default EditJobScreen;
