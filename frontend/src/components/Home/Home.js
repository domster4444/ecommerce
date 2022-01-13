import React, { useEffect } from 'react';

// lib
import { CgMouse } from 'react-icons/all';
// css
import './Home.min.css';
//components
import Product from 'components/Home/Product/Product';
import MetaData from 'components/layout/MetaData';
//todo: redux state & action
import { clearErrors, getProduct } from 'actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from 'components/layout/Loader/Loader';

// !errror handling react-toastify
import { toast } from 'react-toastify';
const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  //!error check for ui react-alert test check-----------

  if (error) {
    toast(error.data.message);
    dispatch(clearErrors());
  }
  //!error check for ui react-alert test check-----------

  //todo: calling redux action - getProduct() ::basically it fetch 8 products from server
  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <MetaData title="Ecommerce" />
          <main id="home">
            <section id="hero-section">
              <p>Welcome to ecommerce</p>

              <h1>FIND AMAZING PRODUCTS BELOW</h1>

              <a href="#featured-section">
                <button className="scrollBtn">
                  <span>scroll</span> <CgMouse />
                </button>
              </a>
            </section>
            <section id="featured-section">
              <h2 id="title-container">
                <span id="title-text">Featured Product</span>
                <div id="product-container">
                  {products &&
                    products.map((product, index) => {
                      return <Product key={index} product={product} />;
                    })}
                </div>
                total product no of {productsCount}
              </h2>
            </section>
          </main>
        </React.Fragment>
      )}
    </>
  );
};

export default Home;
