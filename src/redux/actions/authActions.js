import AUTH_TYPES from "../types/authTypes";

export const loginSuccess = (data) => ({
  type: AUTH_TYPES.LOGIN_SUCCESS,
  payload: data,
});

export const signupSuccess = (data) => ({
  type: AUTH_TYPES.SIGNUP_SUCCESS,
  payload: data,
});

export const profileSuccess = (data) => ({
  type: AUTH_TYPES.PROFILE_SUCCESS,
  payload: data,
});

export const logout = () => ({
  type: AUTH_TYPES.LOGOUT,
});

export const setParentCategories = (data) => ({
  type: AUTH_TYPES.PARENT_CATEGORIES,
  payload: data,
});

export const updateProfile = (data) => ({
  type: AUTH_TYPES.UPDATE_PROFILE,
  payload: data,
});

export const setCart = (data) => ({
  type: AUTH_TYPES.SET_CART,
  payload: data,
});
export const addToCart = (data) => ({
  type: AUTH_TYPES.ADD_TO_CART,
  payload: data,
});

export const removeFromCart = (data) => ({
  type: AUTH_TYPES.REMOVE_FROM_CART,
  payload: data,
});

export const getNotification = (data) => ({
  type: AUTH_TYPES.GETNOTIFICATION,
  payload: data,
});

export const getProductDetail = (data) => ({
  type: AUTH_TYPES.GETPRODUCTDETAILS,
  payload: data,
});

export const getOrdertDetail = (data) => ({
  type: AUTH_TYPES.GETORDERDETAILS,
  payload: data,
});
