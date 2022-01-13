import { BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from 'components/layout/Footer/Footer';
import Header from 'components/layout/Header/Header';
import Home from 'components/Home/Home';
import './App.css';
import ProductDetails from 'components/Home/ProductDetails/ProductDetails';
function App() {
  return (
    <Router>
      <Header />

      <Route exact path="/" component={Home}></Route>
      <Route exact path="/product/:id" component={ProductDetails}></Route>
      <Footer />
    </Router>
  );
}

export default App;
