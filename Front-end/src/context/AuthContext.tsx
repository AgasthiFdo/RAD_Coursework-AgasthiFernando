// import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate} from 'react-router-dom';
// import axiosInstance from '../services/axios';
// import { showErrorAlert, showSuccessAlert, showToast } from '../utils/SweetAlerts';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   image?: string
//   role: string
// }

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User  | null;
  
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
//   updateUser: (userData: User) => void
//   loading: boolean;
//   error: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);



// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const updateUser = (userData: User) =>{
//   setUser(userData)
// }

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       setToken(token)
//       fetchUserProfile()
//         // .then((res) => {
//         //   if (res.data && res.user){ 
//         //     setUser(res.data)
//         //   }else{ 
//         //     setUser(null)
//         //   }
//         // })
//         .catch((err) => {
//           console.error(err)
//           setUser(null)
//         })
//         .finally(() => {
//           setLoading(false)
//         })
//     } else {
//       setUser(null)
//       setLoading(false)
//     }
//   }, []);

//     const fetchUserProfile = async () => {
//       try {
//         setLoading(true)
//         const response = await axiosInstance.get('/auth/me');
//         setUser(response.data.user);
//         console.log(response.data.user)
//         setIsAuthenticated(true);
//         return response.data
//       } catch (error: any) {
  
//         let errorMessage = 'Failed to fetch profile';
//         if (error.response?.data?.message) {
//           errorMessage = typeof error.response.data.message === 'object'
//             ? JSON.stringify(error.response.data.message)
//             : String(error.response.data.message);
//         }
//         console.error('Error fetching user profile:', errorMessage, error);
//         logout();
//       }finally{
//         setLoading(false)
//       }
//     };

//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     setError(null);  
//     try {
//       const response = await axiosInstance.post('/auth/login', { email, password });
//       const backendData = response.data?.data;

//     if (!backendData) {
//       throw new Error("Invalid response format: Missing data field");
//     }

//     const token = backendData.token;
//     const refreshToken = backendData.refreshToken
//     const user = {
//       id: backendData.id,
//       name: backendData.name,
//       email: backendData.email,
//       image: backendData.image,
//       role: backendData.role
//     };

//     if (!token) {
//       throw new Error("Token missing in response");
//     }
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refreshToken)
//       setToken(token);
//       setUser(user);
//       setIsAuthenticated(true);
//       showToast(`Welcome back, ${user.name}!`, 'success');

//         if(user.role === 'Admin'){
//             navigate('/dashboard')
//         }else{
//             navigate('/')
//         }

    
//     } catch (error: any) {
//       let errorMessage = 'Login failed. Please try again.';
//       if (error.response?.data?.message) {
//         errorMessage = typeof error.response.data.message === 'object'
//           ? JSON.stringify(error.response.data.message)
//           : String(error.response.data.message);
//       }
//       setError(errorMessage);
//       showErrorAlert('Login Failed', errorMessage);
//       console.error('Login error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (name: string, email: string, password: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post('/auth/signup', { name, email, password });
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       setToken(token);
//       setUser(user);
//       setIsAuthenticated(true);
//       showSuccessAlert('Account Created', `Welcome to BookClub, ${name}!`);
//       navigate('/login');
//     } catch (error: any) {

//       let errorMessage = 'Signup failed. Please try again.';
//       if (error.response?.data?.message) {
//         errorMessage = typeof error.response.data.message === 'object'
//           ? JSON.stringify(error.response.data.message)
//           : String(error.response.data.message);
//       }
//       setError(errorMessage);
//       showErrorAlert('Signup Failed', errorMessage);
//       console.error('Signup error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//     setToken(null);
//     setUser(null);
//     setIsAuthenticated(false);
//     showToast('You have been logged out', 'info');
//     navigate('/login');
//   };

//   const value = {
//     isAuthenticated,
//     user,
//     token,
//     login,
//     signup,
//     logout,
//     updateUser,
//     loading,
//     error
//   };
//   if (loading) {
//      return (
//         <div className="flex justify-center items-center h-screen bg-[#ffe4c3]">
//             <h1 className="text-2xl font-bold text-[#ff9f1c]">Loading...</h1>
//         </div>
//      );
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };