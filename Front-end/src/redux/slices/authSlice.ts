import { createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import axiosInstance, { forgetPassword, passwordReset } from "../../services/axios";
import type { AxiosError } from "axios";


interface User{
    _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
interface LoginPayload {
  email: string;
  password: string;
}

interface signupPayload {
    name:string
  email: string;
  password: string;
}
interface ResetPasswordPayload {
  email: string;
  otp: number;       
  newPassword: string;
}
interface ApiErrorResponse {
  message: string;
}
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
}

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }: signupPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { name, email, password });
      return response.data; 
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Signup Failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password }); 
     
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('refreshToken', response.data.data.refreshToken); 
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Login Failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/me'); 
      return response.data.user;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

 const logoutAction = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); 
    return null;
});

export const sendOtp = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgetPassword(email);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const resetPasswordAction = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await passwordReset(data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      return rejectWithValue(err.response?.data?.message || 'Reset failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    // Profile එක update කරන්න ඕන නම් මේ reducer එක පාවිච්චි කරන්න පුළුවන්
    updateUserInfo: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Login Cases ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          _id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          image: action.payload.image,
          role: action.payload.role
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Signup Cases (අලුතින් එක් කළා) ---
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        // Signup එකේදී user log කරන්නේ නැත්නම් මෙතන මුකුත් කරන්න ඕන නෑ
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Fetch Profile Cases ---
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        localStorage.removeItem('token');
      })

      // --- Forgot Password / OTP Cases (අලුතින් එක් කළා) ---
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Reset Password Cases (අලුතින් එක් කළා) ---
      .addCase(resetPasswordAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPasswordAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Logout Case ---
      .addCase(logoutAction.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
})
export { logoutAction };
export const {resetError, updateUserInfo,  } = authSlice.actions
export default authSlice.reducer