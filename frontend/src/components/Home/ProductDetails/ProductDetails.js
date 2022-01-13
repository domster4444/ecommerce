import React, { useEffect } from 'react';
import ReactStars from 'react-rating-stars-component';
import Carousel from 'react-material-ui-carousel';

import './ProductDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProductDetails } from 'actions/productAction';

// !errror handling react-toastify
import { toast } from 'react-toastify';

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  console.log('😇', loading);

  useEffect(() => {
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id]);

  //!loading = undefined case occurs so ...
  const options = {
    edit: true,
    color: 'rgba(20,20,20,0.1)',
    activeColor: 'tomato',
    size: window.innerWidth < 600 ? 25 : 35,

    isHalf: true,
  };

  if (loading === false) {
    return (
      <>
        <div className="ProductDetails">
          <div>
            <hr />
            <div id="set-stock-limit-container">
              <div id="left-division">
                <Carousel>
                  {product.product.images &&
                    product.product.images.map((item, index) => {
                      return <img src={item.url} alt="" />;
                    })}
                  {product.product.images &&
                    product.product.images.map((item, index) => {
                      return <img src={item.url} alt="" />;
                    })}
                  {product.product.images &&
                    product.product.images.map((item, index) => {
                      return <img src={item.url} alt="" />;
                    })}
                </Carousel>
              </div>
              <div id="right-division">
                {console.log('😆', product.product)}
                <h2>NAME::{product.product.name}</h2>
                <h2>Price::NPR{product.product.price}</h2>
                <h2>Description::{product.product.description}</h2>
                <h2>ID::{product.product._id}</h2>
                <hr />
                <h2>In stock : {product.product.Stock}</h2>
                <hr />
                <ReactStars {...options} value={0} />
                <button>+</button>
                <input type="number" value="0" />
                <button>-</button>
                <br />
                <button id="cart-btn">add to cart</button>
                <br />
                <button id="review-btn">submit review</button>
                <ul>
                  {product.product.reviews && product.product.reviews[0] ? (
                    <div>
                      {product.product.reviews &&
                        product.product.reviews.map((review) => {
                          return (
                            <>
                              <hr />
                              <li>{review.name}</li>
                              <li>{review.id}</li>
                              <li>{review.comment}</li>
                              <li>{review.rating}</li>
                              <li>{review.user}</li>
                              <hr />
                            </>
                          );
                        })}
                    </div>
                  ) : (
                    <p>no reviews yet</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <h3>
        <h1>loading.............</h1>
        <h1>loading.............</h1>
        <h1>loading.............</h1>
        <h1>loading.............</h1>
        <h1>loading.............</h1>
        <h1>loading.............</h1>
      </h3>
    );
  }
};

export default ProductDetails;
