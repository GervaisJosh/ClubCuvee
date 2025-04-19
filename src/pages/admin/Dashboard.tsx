import React from 'react';
import { BarChart2, Users, Wine, Calendar, Database, Link as LinkIcon, FileText, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import DefaultText from '../../components/DefaultText';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Button from '../../components/Button';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const burgundy = "#800020";

  const stats = [
    { label: 'Active Businesses', value: '12', icon: Building2, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: '$12,450', icon: BarChart2, color: 'bg-green-500' },
    { label: 'Total Wine Selections', value: '347', icon: Wine, color: `bg-[${burgundy}]` },
    { label: 'Upcoming Events', value: '8', icon: Calendar, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { 
      name: "Onboarding Tester", 
      description: "Test restaurant onboarding flow", 
      icon: Database,
      color: burgundy,
      path: "/admin/onboarding-tester"
    },
    { 
      name: "System Diagnostics", 
      description: "Test auth, stats & recommendations", 
      icon: FileText,
      color: "#3B82F6", // Blue
      path: "/admin/diagnostics"
    },
    { 
      name: "Manage Businesses", 
      description: "View and edit restaurant details", 
      icon: Building2,
      color: burgundy,
      path: "/admin/businesses"
    },
    { 
      name: "Revenue & Reports", 
      description: "View platform analytics", 
      icon: BarChart2,
      color: burgundy,
      path: "/admin/revenue"
    }
  ];

  const recentActivities = [
    { action: 'New business registered', name: 'Urban Cellar', time: '2 hours ago' },
    { action: 'Payment received', name: 'Wine & Dine NYC', time: '5 hours ago' },
    { action: 'New customer signup', name: 'via Vineyard Bistro', time: '1 day ago' },
    { action: 'Business subscription upgraded', name: 'The Wine Room', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <Section className="pb-2">
        <DefaultText variant="heading2" className="mb-2">
          Welcome, {userProfile?.first_name || 'Admin'}
        </DefaultText>
        <DefaultText variant="body" color="muted">
          This is your Club Cuvée administrator dashboard. Here you can manage businesses, track revenue, and oversee the platform.
        </DefaultText>
      </Section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center" hover>
            <div className={`${stat.color} rounded-full p-3 mr-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <DefaultText variant="caption" color="muted">
                {stat.label}
              </DefaultText>
              <DefaultText variant="heading3" className="font-bold">
                {stat.value}
              </DefaultText>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Section title="Admin Tools" className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="flex items-start" 
              hover 
              onClick={() => window.location.href = action.path}
              padding="md"
            >
              <div 
                className="mr-4 p-2 rounded-md flex-shrink-0" 
                style={{ backgroundColor: `${action.color}20` }}
              >
                <action.icon style={{ color: action.color }} className="h-6 w-6" />
              </div>
              <div>
                <DefaultText className="font-medium mb-1">{action.name}</DefaultText>
                <DefaultText variant="caption" color="muted">{action.description}</DefaultText>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      
      {/* Recent Activity */}
      <Section title="Recent Activities" className="pt-6">
        <Card>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800"
              >
                <div>
                  <DefaultText className="font-medium">{activity.action}</DefaultText>
                  <DefaultText variant="caption" color="muted">{activity.name}</DefaultText>
                </div>
                <DefaultText variant="caption" color="muted">{activity.time}</DefaultText>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
};

export default AdminDashboard;