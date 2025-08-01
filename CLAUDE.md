# Expense Tracker App

I want to build a React Native expense tracking app that showcases advanced architecture patterns and custom hooks.

## App Overview

A personal expense tracking app where users can:

1. Add expenses with categories and amounts
2. View expense history in a clean list
3. Analyze spending patterns through charts and statistics
4. Receive daily spending reminders via local notifications

## Core Features

### Screen 1: Add Expense

- Amount input (number pad)
- Category selection (Food, Transport, Shopping, Entertainment, Bills, Others)
- Date picker (defaults to today)
- Optional notes field
- Save button

### Screen 2: Expense List

- List of all expenses (most recent first)
- Show: amount, category, date, notes
- Swipe to delete functionality
- Pull-to-refresh

### Screen 3: Statistics Dashboard

- Category-wise spending breakdown (Pie Chart)
- Monthly spending trends (Line Chart)
- Current month summary (total spent, average per day)
- Top spending categories list

### Notification Feature

- Daily reminder at 10 PM showing today's spending
- Request notification permission on app first launch
- Settings toggle to enable/disable daily reminders
- Smart notifications: "You spent ₹450 today. Yesterday was ₹320."

## Technical Requirements

### Architecture

- React Native with JavaScript
- Stack + Tab navigation (React Navigation 6)
- Context API + useReducer for state management
- AsyncStorage for data persistence
- React Native Chart Kit for visualizations
- `@react-native-async-storage/async-storage` for notification scheduling
- `react-native-permissions` for notification permissions

### Custom Hooks to Showcase

- `useExpenses()` - Main expense state management
- `useExpenseAnalytics()` - Calculate statistics and trends
- `useAsyncStorage()` - Persist data locally
- `useCategories()` - Manage expense categories
- `useNotifications()` - Handle daily reminder notifications

### Data Structure

```json
{
  "id": "uuid",
  "amount": 250,
  "category": "Food",
  "date": "2024-01-15",
  "notes": "Lunch at cafe",
  "createdAt": "2024-01-15T12:30:00Z"
}


## **Development Plan:**

### **Phase 1 (20 mins):** Foundation

- React Native project setup
- Navigation structure (3 tabs: Add, List, Stats)
- Basic screen layouts
- Context + useReducer skeleton

### **Phase 2 (20 mins):** Core Functionality

- Add expense form with category picker
- Expense list display
- AsyncStorage integration
- Delete functionality

### **Phase 3 (20 mins):** Analytics

- Statistics calculations (useMemo)
- Pie chart implementation
- Line chart for trends
- Summary insights

### **Phase 4 (10 mins):** Polish

- Better styling
- Loading states
- Pull-to-refresh
- Final optimizations
```
