import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseAnalytics } from '../hooks/useExpenseAnalytics';
import { useExpenses } from '../context/ExpenseContext';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(60, 60, 67, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#007AFF',
  },
};

export default function StatisticsScreen() {
  const { expenses } = useExpenses();
  const analytics = useExpenseAnalytics();

  const StatCard = ({ title, value, icon, color = '#007AFF' }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  const TopCategoryItem = ({ item, index }) => (
    <View style={styles.topCategoryItem}>
      <View style={styles.categoryRank}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item[0]}</Text>
        <Text style={styles.categoryAmount}>₹{item[1].toFixed(2)}</Text>
      </View>
    </View>
  );

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bar-chart-outline" size={60} color="#ccc" />
        <Text style={styles.emptyTitle}>No Data Available</Text>
        <Text style={styles.emptyText}>
          Add some expenses to see your spending statistics
        </Text>
      </View>
    );
  }

  const pieData = analytics.pieChartData.map((item, index) => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const lineData = {
    labels: analytics.last30Days.slice(-7).map(day => {
      const date = new Date(day.date);
      return date.getDate().toString();
    }),
    datasets: [
      {
        data: analytics.last30Days.slice(-7).map(day => day.amount),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsGrid}>
        <StatCard
          title="This Month"
          value={`₹${analytics.totalThisMonth.toFixed(2)}`}
          icon="calendar"
          color="#007AFF"
        />
        <StatCard
          title="Today"
          value={`₹${analytics.totalToday.toFixed(2)}`}
          icon="today"
          color="#34C759"
        />
        <StatCard
          title="Average/Day"
          value={`₹${analytics.averagePerDay.toFixed(2)}`}
          icon="trending-up"
          color="#FF9500"
        />
        <StatCard
          title="Total Expenses"
          value={analytics.currentMonthExpenses.toString()}
          icon="receipt"
          color="#AF52DE"
        />
      </View>

      {pieData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Category Breakdown</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
            absolute
          />
        </View>
      )}

      {lineData.datasets[0].data.some(value => value > 0) && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Last 7 Days Trend</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {analytics.sortedCategories.length > 0 && (
        <View style={styles.topCategoriesContainer}>
          <Text style={styles.sectionTitle}>Top Spending Categories</Text>
          <FlatList
            data={analytics.sortedCategories}
            renderItem={({ item, index }) => (
              <TopCategoryItem item={item} index={index} />
            )}
            keyExtractor={item => item[0]}
            scrollEnabled={false}
          />
        </View>
      )}

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Insights</Text>
        
        {analytics.totalToday > analytics.totalYesterday && (
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={20} color="#FF3B30" />
            <Text style={styles.insightText}>
              You spent ₹{(analytics.totalToday - analytics.totalYesterday).toFixed(2)} more today than yesterday
            </Text>
          </View>
        )}
        
        {analytics.totalToday < analytics.totalYesterday && analytics.totalYesterday > 0 && (
          <View style={styles.insightItem}>
            <Ionicons name="trending-down" size={20} color="#34C759" />
            <Text style={styles.insightText}>
              Great! You spent ₹{(analytics.totalYesterday - analytics.totalToday).toFixed(2)} less today than yesterday
            </Text>
          </View>
        )}
        
        {analytics.totalThisMonth > analytics.averagePerDay * 30 && (
          <View style={styles.insightItem}>
            <Ionicons name="warning" size={20} color="#FF9500" />
            <Text style={styles.insightText}>
              You're spending above your daily average this month
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    width: '48%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  topCategoriesContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  topCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  insightsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});