import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import {configureStore ,combineReducers} from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import { persistReducer } from 'redux-persist';
import storageLocal  from 'redux-persist/lib/storage';

const persistConfig = {
    key:"root",
    version:1,
    storage:storageLocal
}
const reducer = combineReducers({
    auth:authSlice
})

const persistedReducer = persistReducer(persistConfig,reducer)
export const store = configureStore({
    reducer:persistedReducer
})

export const useAppDispatch:() => typeof store.dispatch = useDispatch;
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>= useSelector