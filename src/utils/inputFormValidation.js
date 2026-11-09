//    INPUT VALIDATE VARIABLES //
export const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;
export const nameReg = /^(?=.*[a-zA-Z])[a-zA-Z0-9 '-]+$/;