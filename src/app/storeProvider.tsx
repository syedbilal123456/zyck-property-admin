'use client'
import store from '@/lib/redux/store'
import { useRef } from 'react'
import { Provider } from 'react-redux'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {


  return <Provider store={store}>
    {children}
    </Provider>
}