"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import JobList from '@/components/jobs/JobList';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}</h1>
            <p className="text-muted-foreground">Track and manage your job applications</p>
          </div>
          <Button onClick={() => router.push('/jobs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Applications" 
            value="24" 
            description="+5 from last month" 
            trend="up"
          />
          <StatsCard 
            title="In Progress" 
            value="8" 
            description="+2 from last month" 
            trend="up"
          />
          <StatsCard 
            title="Interviews" 
            value="3" 
            description="+1 from last month" 
            trend="up"
          />
          <StatsCard 
            title="Offers" 
            value="1" 
            description="No change from last month" 
            trend="neutral"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
                <TabsTrigger value="offer">Offer</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              <JobList status={activeTab === 'all' ? undefined : activeTab} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
};

function StatsCard({ title, value, description, trend }: StatsCardProps) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === 'up' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className={`h-4 w-4 ${trendColors[trend]}`}
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        )}
        {trend === 'down' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className={`h-4 w-4 ${trendColors[trend]}`}
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        )}
        {trend === 'neutral' && (
          <span className={`text-xs ${trendColors[trend]}`}>—</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
