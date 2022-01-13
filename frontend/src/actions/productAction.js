import axios from 'axios';

import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from 'constants/productConstants';

//todo: get product action
export const getProduct = () => async (dispatch) => {
  try {
    //? request to  api
    dispatch({ type: ALL_PRODUCT_REQUEST });
    const { data } = await axios.get('http://localhost:4000/api/v1/products');
    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    //? if any error occurs while request to api
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response,
    });
  }
};

//todo: get product action
export const getProductDetails = (id) => async (dispatch) => {
  try {
    //? request to  api
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/${id}`
    );
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    //? if any error occurs while request to api
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response,
    });
  }
};

//todo: CLEAR ERROR BY setting error = null
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
