import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpenseContext = createContext();

const STORAGE_KEY = '@expense_tracker_data';

const initialState = {
  expenses: [],
  categories: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Others'],
  customCategories: [],
  isLoading: false,
  settings: {
    notificationsEnabled: true,
  },
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOAD_DATA':
      return { 
        ...state, 
        expenses: action.payload.expenses || [],
        customCategories: action.payload.customCategories || [],
        settings: { ...initialState.settings, ...action.payload.settings },
        isLoading: false 
      };
    
    case 'ADD_EXPENSE':
      return { 
        ...state, 
        expenses: [action.payload, ...state.expenses] 
      };
    
    case 'DELETE_EXPENSE':
      return { 
        ...state, 
        expenses: state.expenses.filter(expense => expense.id !== action.payload) 
      };
    
    case 'ADD_CUSTOM_CATEGORY':
      return { 
        ...state, 
        customCategories: [...state.customCategories, action.payload] 
      };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } else {
        // First launch - request notification permissions
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveData = async (dataToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      const dataToSave = {
        expenses: state.expenses,
        customCategories: state.customCategories,
        settings: state.settings,
      };
      saveData(dataToSave);
    }
  }, [state.expenses, state.customCategories, state.settings, state.isLoading]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
  };

  const deleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const addCustomCategory = (category) => {
    if (!state.customCategories.includes(category)) {
      dispatch({ type: 'ADD_CUSTOM_CATEGORY', payload: category });
    }
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const getAllCategories = () => {
    return [...state.categories, ...state.customCategories];
  };

  const value = {
    ...state,
    addExpense,
    deleteExpense,
    addCustomCategory,
    updateSettings,
    getAllCategories,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}