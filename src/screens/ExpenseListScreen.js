import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpenseContext';

const ExpenseItem = ({ expense, onDelete }) => {
  const [panResponder] = useState(new Animated.ValueXY());
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: 'restaurant',
      Transport: 'car',
      Shopping: 'bag',
      Entertainment: 'game-controller',
      Bills: 'receipt',
      Others: 'ellipsis-horizontal',
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setIsDeleting(true);
            onDelete(expense.id);
          },
        },
      ]
    );
  };

  if (isDeleting) {
    return null;
  }

  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(expense.category) }]}>
          <Ionicons 
            name={getCategoryIcon(expense.category)} 
            size={20} 
            color="#fff" 
          />
        </View>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseCategory}>{expense.category}</Text>
          <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
          {expense.notes ? (
            <Text style={styles.expenseNotes} numberOfLines={1}>
              {expense.notes}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>₹{expense.amount.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={16} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

function getCategoryColor(category) {
  const colors = {
    Food: '#FF6B6B',
    Transport: '#4ECDC4',
    Shopping: '#45B7D1',
    Entertainment: '#96CEB4',
    Bills: '#FFEAA7',
    Others: '#DDA0DD',
  };
  return colors[category] || '#999';
}

export default function ExpenseListScreen() {
  const { expenses, deleteExpense, isLoading } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteExpense = (id) => {
    deleteExpense(id);
  };

  const renderExpenseItem = ({ item }) => (
    <ExpenseItem expense={item} onDelete={handleDeleteExpense} />
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={60} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Expenses Yet</Text>
      <Text style={styles.emptyStateText}>
        Add your first expense using the "Add" tab
      </Text>
    </View>
  );

  const ListHeader = () => {
    if (expenses.length === 0) return null;
    
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return (
      <View style={styles.listHeader}>
        <Text style={styles.totalLabel}>Total Expenses</Text>
        <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={expenses.length === 0 ? styles.emptyContainer : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listHeader: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  expenseItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  expenseNotes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});