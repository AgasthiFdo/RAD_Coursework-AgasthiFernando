import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addRecipe, deleteRecipes, getAllRecipes, updateRecipe } from "../../services/RecipeAPI";
import type { AxiosError } from "axios";

interface User {
  _id: string;
  name: string;
}

interface Food {
  _id: string;
  name: string;
}
export interface Recipe{
    _id: string
    user: User
    food: Food
    title:string
    ingredients: string 
    step: string
    readyIn : string
    date: Date
    images?: string[]
}

interface RecipeState{
    recipes: Recipe[]
    loading: boolean
    error: string | null
    selectedRecipe: Recipe | null
    selectedMyRecipe: Recipe | null
    currentPage: number;
    totalPages: number;
}
interface ApiErrorResponse {
  message: string;
}
interface fetchRecipeResponse{
  recipes: Recipe[];
  totalPages: number;
 
  page: number;
}

const initialState: RecipeState={
    recipes: [],
  loading: false,
  error: null,
  selectedRecipe: null,
  selectedMyRecipe: null,
  currentPage: 1,
  totalPages: 1,
  
}

export const fetchAllRecipess = createAsyncThunk<fetchRecipeResponse,
 { page: number; limit: number },
  { rejectValue: string }
>(
  'recipe/fetchAll',
  async (params,  { rejectWithValue }) => {
    try {
      const response = await getAllRecipes(params.page, params?.limit);
      return {
        recipes: response.data.data.recipes,
        totalPages: response.data.totalPages,
        totalResults: response.data.totalCount,
        page: response.data.page,
      }
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch foods');
    }
  }
);

export const addRecipeAction = createAsyncThunk(
  'recipe/add',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await addRecipe(formData);
      return response.data.data.recipe;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Failed to add food');
    }
  }
);

export const updateRecipeAction = createAsyncThunk(
  'recipe/update',
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await updateRecipe(id, data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const deleteRecipeAction = createAsyncThunk(
  'recipe/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteRecipes(id);
      return id;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);



const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.selectedRecipe = action.payload;
    },
    setSelectedMyRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.selectedMyRecipe = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchAllRecipess.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRecipess.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page
      })
      .addCase(fetchAllRecipess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addRecipeAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRecipeAction.fulfilled, (state, action) => {
        state.recipes.push(action.payload);
        state.loading = false;
      })
      .addCase(addRecipeAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateRecipeAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    
      .addCase(updateRecipeAction.fulfilled, (state, action: PayloadAction<Recipe>) => {
        const index = state.recipes.findIndex(rec => rec._id === action.payload._id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateRecipeAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     .addCase(deleteRecipeAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteRecipeAction.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(rec => rec._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteRecipeAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    
      

      
  },
});

export const { clearError, setSelectedRecipe, setSelectedMyRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;

