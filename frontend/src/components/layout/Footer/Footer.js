import React from 'react';
import './Footer.min.css';
import appleStoreImg from 'utils/images/appleStore.PNG';
import googleStoreImg from 'utils/images/googleStore.PNG';
const Footer = () => {
  return (
    <footer>
      <ul className="footer_division--left">
        <li>
          <h4>Download Our App</h4>
        </li>
        <li>
          <p>Download App for Android and IOS mobile phone</p>
        </li>
        <img className="store-btn" src={appleStoreImg} alt="" />
        <img className="store-btn" src={googleStoreImg} alt="" />
      </ul>
      <ul className="footer_division--center">
        <li>
          <h1>ECOMMERCE</h1>
        </li>
        <li>
          <p>High Quality is our first priority</p>
        </li>
        <li>
          <p>Copyrights 2021 &copy; Kshitiz</p>
        </li>
      </ul>
      <ul className="footer_division--right">
        <li>
          <h1>Follow Me</h1>
        </li>
        <li>
          <a href="https://google.com">Instagram</a>
        </li>
        <li>
          <a href="https://google.com">LinkedIn</a>
        </li>
        <li>
          <a href="https://google.com">Facebook</a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
