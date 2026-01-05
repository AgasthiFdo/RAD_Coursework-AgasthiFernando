import Swal from 'sweetalert2';


export const showSuccessAlert = (title: string, message?: string) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonColor: '#3B82F6', 
    confirmButtonText: 'OK',
  });
};


export const showErrorAlert = (title: string, message?: string) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonColor: '#3B82F6',
    confirmButtonText: 'OK',
  });
};

export const showWarningAlert = (title: string, message?: string) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    confirmButtonColor: '#3B82F6', 
    confirmButtonText: 'OK',
  });
};


export const showInfoAlert = (title: string, message?: string) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'info',
    confirmButtonColor: '#3B82F6', 
    confirmButtonText: 'OK',
  });
};


export const showConfirmDialog = (title: string, message: string, confirmButtonText = 'Yes', cancelButtonText = 'No') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3B82F6', 
    cancelButtonColor: '#EF4444', 
    confirmButtonText,
    cancelButtonText,
  });
};


export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};