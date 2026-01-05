import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/slices/authSlice'
import foodReducer from '../redux/slices/foodSlice'
import recipeReducer from '../redux/slices/recipeSlice'

export const store = configureStore({
    reducer:{
        auth: authReducer,
        food: foodReducer,
        recipe: recipeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDisPatch = typeof store.dispatch
export default store
