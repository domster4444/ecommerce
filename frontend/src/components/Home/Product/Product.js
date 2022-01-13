import React from 'react';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';

import './Product.css';

const Product = (props) => {
  const options = {
    edit: true,
    color: 'rgba(20,20,20,0.1)',
    activeColor: 'tomato',
    size: window.innerWidth < 600 ? 25 : 35,
    value: props.product.rating,
    isHalf: true,
  };
  return (
    <>
      <Link className="product" to={`/product/${props.product._id}`}>
        {/* https://imgs.michaels.com/MAM/assets/1/726D45CA1C364650A39CD1B336F03305/img/893E44B4248847338CD88E85BD79D361/10186027_r.jpg?fit=inside|140:140,https://imgs.michaels.com/MAM/assets/1/726D45CA1C364650A39CD1B336F03305/img/893E44B4248847338CD88E85BD79D361/10186027_r.jpg?fit=inside|220:220,https://imgs.michaels.com/MAM/assets/1/726D45CA1C364650A39CD1B336F03305/img/893E44B4248847338CD88E85BD79D361/10186027_r.jpg?fit=inside|540:540 */}
        {console.log(props.product)}

        {props.product.images &&
          props.product.images.map((items, index) => {
            return (
              <img
                src={`${items.url}`}
                alt="product"
                style={{ fontSize: '1.5rem' }}
              />
            );
          })}

        <h4>{props.product.name}</h4>
        <div>
          <ReactStars {...options} />

          <span> Reviews:{props.product.reviews.length}</span>
        </div>
        <p>Price : NRP {props.product.price}</p>
      </Link>
    </>
  );
};

export default Product;
