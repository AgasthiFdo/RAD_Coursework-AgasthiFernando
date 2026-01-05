import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { 
  addFood , 
  updateFood , 
  getAllFoods , 
  deleteFood ,
  getFoodByName ,
  getTotalFoodsCount 
} from "../../services/FoodAPI"; 
import type { AxiosError } from "axios";


export interface Food {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  cuisine: string;
}

interface FoodState {
  foods: Food[];
  loading: boolean;
  error: string | null;
  selectedFood: Food | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

interface ApiErrorResponse {
  message: string;
}
interface fetchFoodResponse{
  foods: Food[];
  totalPages: number;
  totalResults: number;
  page: number;
}


const initialState: FoodState = {
  foods: [],
  loading: false,
  error: null,
  selectedFood: null,
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
};



export const fetchAllFoods = createAsyncThunk<fetchFoodResponse,
 { page: number; limit: number },
  { rejectValue: string }
>(
  'food/fetchAll',
  async (params,  { rejectWithValue }) => {
    try {
      const response = await getAllFoods(params.page, params?.limit);
      return {
        foods: response.data.data.foods,
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

export const addFoodAction = createAsyncThunk(
  'food/add',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await addFood(formData);
      return response.data.data.food;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Failed to add food');
    }
  }
);

export const updateFoodAction = createAsyncThunk(
  'food/update',
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await updateFood(id, data);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const deleteFoodAction = createAsyncThunk(
  'food/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteFood(id);
      return id;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);



export const searchFoodByName = createAsyncThunk(
  'food/search',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await getFoodByName(name);
      return response.data.data.food;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);
export const fetchTotalFoodsCount = createAsyncThunk(
  'food/fetchTotalCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTotalFoodsCount(); 
      return response.data.data.totalFoods;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Failed to get total count');
    }
  }
);


const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedFood: (state, action: PayloadAction<Food | null>) => {
      state.selectedFood = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchAllFoods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload.foods
        state.totalResults = action.payload.totalResults;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page
      })
      .addCase(fetchAllFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addFoodAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFoodAction.fulfilled, (state, action) => {
        state.foods.push(action.payload);
        state.loading = false;
      })
      .addCase(addFoodAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateFoodAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    
      .addCase(updateFoodAction.fulfilled, (state, action: PayloadAction<Food>) => {
        const index = state.foods.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.foods[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateFoodAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     .addCase(deleteFoodAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteFoodAction.fulfilled, (state, action) => {
        state.foods = state.foods.filter(f => f._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteFoodAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchTotalFoodsCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalFoodsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalResults = action.payload; 
      })
      .addCase(fetchTotalFoodsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(searchFoodByName.fulfilled, (state, action) => {
        state.foods = action.payload;
        state.loading = false;
      });

      
  },
});

export const { clearError, setSelectedFood } = foodSlice.actions;
export default foodSlice.reducer;