import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Globe,
  Zap,
  Target,
  Award
} from 'lucide-react';

interface AnalyticsData {
  totalProcessed: number;
  successRate: number;
  avgProcessingTime: number;
  apiUsage: number;
  topSources: Array<{ name: string; count: number; successRate: number }>;
  dailyStats: Array<{ date: string; processed: number; success: number; errors: number }>;
  profileTypes: Array<{ type: string; count: number; color: string }>;
  performanceMetrics: {
    avgConfidence: number;
    dataCompleteness: number;
    responseTime: number;
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = () => {
      const mockData: AnalyticsData = {
        totalProcessed: 2847,
        successRate: 94.2,
        avgProcessingTime: 3.2,
        apiUsage: 67,
        topSources: [
          { name: 'LinkedIn', count: 1245, successRate: 96.8 },
          { name: 'GitHub', count: 567, successRate: 92.1 },
          { name: 'IMDB', count: 423, successRate: 89.3 },
          { name: 'Twitter', count: 312, successRate: 91.7 },
          { name: 'Company Pages', count: 300, successRate: 88.2 }
        ],
        dailyStats: [
          { date: '2024-01-07', processed: 245, success: 231, errors: 14 },
          { date: '2024-01-08', processed: 312, success: 295, errors: 17 },
          { date: '2024-01-09', processed: 189, success: 178, errors: 11 },
          { date: '2024-01-10', processed: 421, success: 398, errors: 23 },
          { date: '2024-01-11', processed: 356, success: 334, errors: 22 },
          { date: '2024-01-12', processed: 478, success: 451, errors: 27 },
          { date: '2024-01-13', processed: 523, success: 492, errors: 31 }
        ],
        profileTypes: [
          { type: 'Software Engineers', count: 856, color: '#3b82f6' },
          { type: 'Executives', count: 423, color: '#10b981' },
          { type: 'Designers', count: 312, color: '#f59e0b' },
          { type: 'Sales', count: 298, color: '#ef4444' },
          { type: 'Marketing', count: 234, color: '#8b5cf6' },
          { type: 'Other', count: 724, color: '#6b7280' }
        ],
        performanceMetrics: {
          avgConfidence: 87.3,
          dataCompleteness: 92.1,
          responseTime: 2.8
        }
      };
      
      setAnalyticsData(mockData);
    };

    loadAnalytics();
  }, [selectedTimeRange]);

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-64">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Profiles Processed',
      value: analyticsData.totalProcessed.toLocaleString(),
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Success Rate',
      value: `${analyticsData.successRate}%`,
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'Avg Processing Time',
      value: `${analyticsData.avgProcessingTime}s`,
      change: '-0.3s',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'text-orange-500'
    },
    {
      title: 'API Usage',
      value: `${analyticsData.apiUsage}%`,
      change: '+5.2%',
      changeType: 'neutral' as const,
      icon: Zap,
      color: 'text-purple-500'
    }
  ];

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-xl-premium border-0 glass-premium backdrop-blur-xl overflow-hidden">
        <CardHeader className="gradient-premium text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
          
          <div className="relative z-10">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="h-7 w-7" />
              Analytics Dashboard
            </CardTitle>
            <p className="text-white/80 mt-2">
              Enterprise-grade insights and performance metrics
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover-lift transition-all duration-300 shadow-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                  <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`${getChangeColor(kpi.changeType)} text-xs`}
                    >
                      {kpi.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Daily Processing Trend */}
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Daily Processing Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="processed" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="success" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profile Types Distribution */}
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Profile Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.profileTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.profileTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card className="shadow-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Top Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topSources.map((source, index) => (
                  <div key={source.name} className="flex items-center justify-between p-4 border rounded-lg hover-lift">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{source.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {source.count.toLocaleString()} profiles processed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-success/20 text-success border-success/30">
                        {source.successRate}% success
                      </Badge>
                      <div className="w-24 mt-2">
                        <Progress value={source.successRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Average Confidence */}
            <Card className="shadow-premium">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{analyticsData.performanceMetrics.avgConfidence}%</h3>
                    <p className="text-sm text-muted-foreground">Average Confidence</p>
                  </div>
                  <Progress value={analyticsData.performanceMetrics.avgConfidence} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Data Completeness */}
            <Card className="shadow-premium">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-success/20 rounded-full w-fit mx-auto">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{analyticsData.performanceMetrics.dataCompleteness}%</h3>
                    <p className="text-sm text-muted-foreground">Data Completeness</p>
                  </div>
                  <Progress value={analyticsData.performanceMetrics.dataCompleteness} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="shadow-premium">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-orange/20 rounded-full w-fit mx-auto">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{analyticsData.performanceMetrics.responseTime}s</h3>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                  <div className="text-xs text-success">
                    ↓ 15% faster than last month
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Business Impact */}
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Business Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">Time Savings</h4>
                  <p className="text-green-700">
                    <span className="text-2xl font-bold">2,847 hours</span> saved in manual research
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Based on 1 hour per profile manual research
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Cost Efficiency</h4>
                  <p className="text-blue-700">
                    <span className="text-2xl font-bold">$142,350</span> in labor cost savings
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Calculated at $50/hour average research cost
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Accuracy Rate</h4>
                  <p className="text-purple-700">
                    <span className="text-2xl font-bold">94.2%</span> data accuracy
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    Consistently outperforming manual research
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-warning/20 bg-warning/10 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-warning-foreground">Optimize LinkedIn Processing</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Consider rate limiting adjustments for LinkedIn sources to improve success rate
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 bg-primary/10 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-primary-foreground">Expand GitHub Integration</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        High success rate suggests opportunity to process more developer profiles
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-success/20 bg-success/10 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-success-foreground">Performance Excellence</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current processing speed is 25% above industry benchmarks
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};