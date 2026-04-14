'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  addons?: string[]
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isCartOpen?: boolean
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isCartOpen: false,
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen }
      
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(i => i.id === action.payload.id)
      let newItems = [...state.items]

      if (existingItemIndex >= 0) {
        newItems[existingItemIndex].quantity += action.payload.quantity
      } else {
        newItems.push(action.payload)
      }

      return {
        ...state,
        items: newItems,
        totalItems: state.totalItems + action.payload.quantity,
        totalPrice: state.totalPrice + action.payload.price * action.payload.quantity,
      }
    }
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(i => i.id === action.payload)
      if (!itemToRemove) return state

      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
      }
    }
    case 'UPDATE_QUANTITY': {
      const itemIndex = state.items.findIndex(i => i.id === action.payload.id)
      if (itemIndex === -1) return state

      const oldQuantity = state.items[itemIndex].quantity
      const difference = action.payload.quantity - oldQuantity

      const newItems = [...state.items]
      newItems[itemIndex].quantity = action.payload.quantity

      return {
        ...state,
        items: newItems,
        totalItems: state.totalItems + difference,
        totalPrice: state.totalPrice + state.items[itemIndex].price * difference,
      }
    }
    case 'CLEAR_CART':
      return initialState
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
}>({ state: initialState, dispatch: () => null })

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)