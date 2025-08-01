import { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';

export function useExpenseAnalytics() {
  const { expenses } = useExpenses();

  const analytics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });

    const todayExpenses = expenses.filter(expense => 
      new Date(expense.date).toDateString() === today
    );

    const yesterdayExpenses = expenses.filter(expense => 
      new Date(expense.date).toDateString() === yesterday
    );

    const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalToday = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalYesterday = yesterdayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    const averagePerDay = totalThisMonth / currentDay;

    const categoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const dateString = date.toDateString();
      const dayExpenses = expenses.filter(expense => 
        new Date(expense.date).toDateString() === dateString
      );
      return {
        date: date.toISOString().split('T')[0],
        amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    });

    const pieChartData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
      name: category,
      amount: amount,
      color: getCategoryColor(category),
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));

    return {
      totalThisMonth,
      totalToday,
      totalYesterday,
      averagePerDay,
      categoryBreakdown,
      sortedCategories,
      last30Days,
      pieChartData,
      currentMonthExpenses: currentMonthExpenses.length,
    };
  }, [expenses]);

  return analytics;
}

function getCategoryColor(category) {
  const colors = {
    Food: '#FF6B6B',
    Transport: '#4ECDC4',
    Shopping: '#45B7D1',
    Entertainment: '#96CEB4',
    Bills: '#FFEAA7',
    Others: '#DDA0DD',
  };
  return colors[category] || '#' + Math.floor(Math.random()*16777215).toString(16);
}