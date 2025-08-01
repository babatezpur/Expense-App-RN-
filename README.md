# 💰 Expense Tracker - React Native

A personal expense tracking app built with React Native that showcases advanced architecture patterns and custom hooks for efficient expense management.

## 📱 Features

### Core Functionality
- **Add Expenses**: Quick expense entry with categories and amounts
- **Expense History**: Clean list view of all expenses with swipe-to-delete
- **Analytics Dashboard**: Visual spending insights with charts and statistics
- **Smart Notifications**: Daily spending reminders at 10 PM

### Key Screens
1. **Add Expense Screen**
   - Number pad for amount input
   - Category selection (Food, Transport, Shopping, Entertainment, Bills, Others)
   - Date picker (defaults to today)
   - Optional notes field

2. **Expense List Screen**
   - Chronological expense listing (most recent first)
   - Displays amount, category, date, and notes
   - Swipe-to-delete functionality
   - Pull-to-refresh support

3. **Statistics Dashboard**
   - Category-wise spending breakdown (Pie Chart)
   - Monthly spending trends (Line Chart)
   - Current month summary with totals and averages
   - Top spending categories analysis

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with JavaScript
- **Navigation**: Stack + Tab navigation (React Navigation 6)
- **State Management**: Context API + useReducer pattern
- **Data Persistence**: AsyncStorage
- **Charts**: React Native Chart Kit
- **Notifications**: React Native Push Notifications
- **Permissions**: react-native-permissions

### Custom Hooks
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
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Android Studio / Xcode
- iOS Simulator / Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/babatezpur/Expense-App-RN-.git
   cd Expense-App-RN-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (if running on iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro Server**
   ```bash
   npm start
   ```

5. **Run the app**
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios
   ```

## 📱 App Navigation

The app uses a tab-based navigation with three main screens:
- **Add**: Expense entry form
- **List**: Expense history and management
- **Stats**: Analytics and insights dashboard

## 🔔 Notification Features

- **Daily Reminders**: Automated notifications at 10 PM showing daily spending
- **Permission Handling**: Requests notification permissions on first launch
- **Smart Insights**: Comparative spending data ("You spent ₹450 today. Yesterday was ₹320.")
- **Settings Toggle**: Enable/disable daily reminders

## 🎨 Key Implementation Highlights

### State Management
- Context API with useReducer for predictable state updates
- Persistent storage with AsyncStorage integration
- Optimized re-renders with useMemo and useCallback

### Data Visualization
- Interactive pie charts for category breakdown
- Line charts for spending trends over time
- Real-time statistics calculation

### User Experience
- Smooth animations and transitions
- Intuitive swipe gestures
- Pull-to-refresh functionality
- Loading states and error handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Saptarshi Das** - [babatezpur](https://github.com/babatezpur)

---

*Built with ❤️ using React Native*