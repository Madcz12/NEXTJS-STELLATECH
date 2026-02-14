"use client"

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { loadCart } from '@/store/cartSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
 const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Load cart from localStorage on mount
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          store.dispatch(loadCart(cartData));
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
      initialized.current = true;
    }

    // Subscribe to store changes and save to localStorage
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem('cart', JSON.stringify(state.cart.items));
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
