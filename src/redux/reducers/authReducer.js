import AUTH_TYPES from "../types/authTypes";

const initialState = {
  isAuthenticated: false,
  token: null,
  profile: {},
  role: null,
  cartItems: 0,
  parentCategories: [],
  notification: null,
  productDetails: null,
  appointmentDetails: null,
  orderDetails: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_TYPES.RESET_STATE:
      return initialState;

    case AUTH_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        submitting: false,
        isAuthenticated: true,
        token: action.payload.token,
        profile: action.payload.profile,
      };

    case AUTH_TYPES.SIGNUP_SUCCESS:
      return {
        ...state,
        submitting: false,
        isAuthenticated: true,
        token: action.payload.token,
      };

    case AUTH_TYPES.PROFILE_SUCCESS:
      return {
        ...state,
        submitting: false,
        isAuthenticated: true,
        token: action.payload.token,
        profile: action.payload.profile,
      };

    case AUTH_TYPES.LOGOUT:
      return {
        ...state,
        submitting: false,
        isAuthenticated: false,
        token: null,
        cartItems: 0,
        parentCategories: [],
      };

    case AUTH_TYPES.PARENT_CATEGORIES:
      return {
        ...state,
        parentCategories: action.payload,
      };

    case AUTH_TYPES.UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };

    case AUTH_TYPES.SET_CART:
      return {
        ...state,
        cartItems: action.payload,
      };

    case AUTH_TYPES.ADD_TO_CART:
      return {
        ...state,
        cartItems: state.cartItems + 1,
      };

    case AUTH_TYPES.REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems - 1,
      };

    case AUTH_TYPES.GETNOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };

    case AUTH_TYPES.GETPRODUCTDETAILS:
      return {
        ...state,
        productDetails: action.payload,
      };

    case AUTH_TYPES.GETORDERDETAILS:
      return {
        ...state,
        orderDetails: action.payload,
      };

    default:
      return state;
  }
}
