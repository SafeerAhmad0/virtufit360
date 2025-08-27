"use client";
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

interface CartContextProps extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

type CartAction = 
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string | number }
  | { type: 'UPDATE_QUANTITY'; productId: string | number; quantity: number }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(item => item.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item => item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item)
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.productId)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => item.id === action.productId ? { ...item, quantity: action.quantity } : item)
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };
  const removeFromCart = (productId: string | number) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };
  const updateQuantity = (productId: string | number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
