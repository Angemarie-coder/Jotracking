import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Text, Card, Title, ActivityIndicator, useTheme, Portal, Button as PaperButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Job, JobStatus, UpdateJobRequest, NavigationProps } from '../types';
import apiService from '../services/api';
import Button from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  getResponsiveSpacing, 
  getResponsiveComponentSize, 
  getResponsiveBorderRadius,
  getScreenPadding
} from '../utils/responsive';
import { colors, spacing, borderRadius, shadows } from '../theme';

const EditJobScreen = () => {
  const theme = useTheme();
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<UpdateJobRequest>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const jobId = (route.params as any)?.jobId;

  const statusOptions = [
    { value: JobStatus.SAVED, label: 'Saved', icon: 'bookmark-outline' as const, color: colors.statusSaved },
    { value: JobStatus.APPLIED, label: 'Applied', icon: 'send' as const, color: colors.statusApplied },
    { value: JobStatus.INTERVIEWING, label: 'Interviewing', icon: 'account-tie' as const, color: colors.statusInterviewing },
    { value: JobStatus.OFFER, label: 'Offer', icon: 'trophy' as const, color: colors.statusOffer },
    { value: JobStatus.REJECTED, label: 'Rejected', icon: 'close-circle' as const, color: colors.statusRejected },
  ];

  const getStatusLabel = (status: JobStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'Saved';
  };

  const getStatusIcon = (status: JobStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.icon : 'bookmark-outline';
  };

  const getStatusColor = (status: JobStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : colors.statusSaved;
  };

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
    setFormData((prev: UpdateJobRequest) => ({ ...prev, [field]: value }));
  };

  const handleStatusSelect = (status: JobStatus) => {
    updateFormData('status', status);
    setStatusDropdownVisible(false);
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurface }}>Job not found</Text>
        <Button 
          onPress={() => navigation.goBack()} 
          style={styles.button}
          title="Go Back"
        />
      </View>
    );
  }

  return (
    <>
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
                 <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>Status</Text>
                 <TouchableOpacity
                   style={[
                     styles.statusDropdown, 
                     { 
                       backgroundColor: theme.colors.surface,
                       borderColor: theme.colors.outline
                     }
                   ]}
                   onPress={() => setStatusDropdownVisible(true)}
                   disabled={saving}
                 >
                  <View style={styles.statusDropdownContent}>
                    <MaterialCommunityIcons 
                      name={getStatusIcon(formData.status || JobStatus.SAVED)} 
                      size={getResponsiveComponentSize(20, 'button')} 
                      color={getStatusColor(formData.status || JobStatus.SAVED)} 
                    />
                    <Text style={[styles.statusDropdownText, { color: theme.colors.onSurface }]}>
                      {getStatusLabel(formData.status || JobStatus.SAVED)}
                    </Text>
                  </View>
                  <MaterialCommunityIcons 
                    name="chevron-down" 
                    size={getResponsiveComponentSize(20, 'button')} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                </TouchableOpacity>
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
                   style={[styles.cancelButton, { borderColor: theme.colors.outline }]}
                   title="Cancel"
                 />
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Status Dropdown Modal */}
      <Portal>
        <Modal
          visible={statusDropdownVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setStatusDropdownVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                             <View style={[styles.modalHeader, { borderBottomColor: theme.colors.outline }]}>
                 <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                   Select Status
                 </Text>
                <PaperButton
                  icon="close"
                  onPress={() => setStatusDropdownVisible(false)}
                  mode="text"
                  compact
                >
                  Close
                </PaperButton>
              </View>
              
                             <View style={styles.statusOptionsList}>
                 {statusOptions.map((option) => (
                   <TouchableOpacity
                     key={option.value}
                     style={[
                       styles.statusOption,
                       { borderBottomColor: theme.colors.outline },
                       formData.status === option.value && { backgroundColor: theme.colors.surfaceVariant }
                     ]}
                     onPress={() => handleStatusSelect(option.value)}
                   >
                    <View style={styles.statusOptionContent}>
                      <MaterialCommunityIcons 
                        name={option.icon} 
                        size={getResponsiveComponentSize(20, 'button')} 
                        color={option.color} 
                      />
                      <Text style={[
                        styles.statusOptionText, 
                        { color: theme.colors.onSurface },
                        formData.status === option.value && { color: option.color, fontWeight: '600' }
                      ]}>
                        {option.label}
                      </Text>
                    </View>
                    {formData.status === option.value && (
                      <MaterialCommunityIcons 
                        name="check" 
                        size={getResponsiveComponentSize(20, 'button')} 
                        color={option.color} 
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
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
  scrollContent: {
    padding: getScreenPadding(),
    paddingBottom: getResponsiveSpacing(spacing.xl),
  },
  card: {
    borderRadius: getResponsiveBorderRadius(borderRadius.card),
    ...shadows.md,
  },
  title: {
    fontSize: getResponsiveSpacing(24),
    fontWeight: 'bold',
    marginBottom: getResponsiveSpacing(spacing.md),
    textAlign: 'center',
  },
  input: {
    marginBottom: getResponsiveSpacing(spacing.md),
  },
  textArea: {
    minHeight: getResponsiveSpacing(100),
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: getResponsiveSpacing(spacing.md),
  },
  sectionTitle: {
    fontSize: getResponsiveSpacing(16),
    marginBottom: getResponsiveSpacing(spacing.sm),
  },
  statusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getResponsiveSpacing(spacing.md),
    paddingVertical: getResponsiveSpacing(spacing.sm),
    borderRadius: getResponsiveBorderRadius(borderRadius.input),
    borderWidth: 1,
    minHeight: getResponsiveComponentSize(48, 'input'),
  },
  statusDropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSpacing(spacing.sm),
  },
  statusDropdownText: {
    fontSize: getResponsiveSpacing(16),
  },
  buttonContainer: {
    marginTop: getResponsiveSpacing(spacing.sm),
  },
  submitButton: {
    marginBottom: getResponsiveSpacing(spacing.sm),
  },
  cancelButton: {
    // Border color will be set dynamically
  },
  button: {
    marginTop: getResponsiveSpacing(spacing.md),
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
    maxHeight: '50%',
    ...shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getScreenPadding(),
    paddingBottom: getResponsiveSpacing(spacing.md),
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: getResponsiveSpacing(20),
    fontWeight: 'bold',
  },
  statusOptionsList: {
    paddingHorizontal: getScreenPadding(),
    paddingVertical: getResponsiveSpacing(spacing.md),
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getResponsiveSpacing(spacing.md),
    paddingHorizontal: getResponsiveSpacing(spacing.sm),
    borderRadius: getResponsiveBorderRadius(borderRadius.button),
    marginBottom: getResponsiveSpacing(spacing.xs),
  },
  statusOptionSelected: {
    // Background color will be set dynamically
  },
  statusOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveSpacing(spacing.sm),
  },
  statusOptionText: {
    fontSize: getResponsiveSpacing(16),
  },
});

export default EditJobScreen;
