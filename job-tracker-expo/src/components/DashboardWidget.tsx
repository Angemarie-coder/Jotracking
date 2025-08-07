import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  onPress?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  onPress,
  trend
}) => {
  const theme = useTheme();

  return (
    <Card 
      style={[styles.container, { backgroundColor: color }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name={icon as any} 
            size={20} 
            color="white" 
            style={styles.icon}
          />
          {trend && (
            <View style={styles.trendContainer}>
              <MaterialCommunityIcons 
                name={trend.isPositive ? 'trending-up' : 'trending-down'} 
                size={12} 
                color="white" 
              />
              <Text style={styles.trendText}>
                {trend.value}%
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '600',
  },
  value: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
  },
});

export default DashboardWidget; 