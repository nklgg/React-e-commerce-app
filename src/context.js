import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubtotal: 0,
    cartTax: 0,
    cartTotal: 0,
  };

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach((item) => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };

  getItem = (id) => {
    const product = this.state.products.find((item) => item.id === id);
    return product;
  };

  handleDetails = (id) => {
    const product = this.getItem(id);
    this.setState({
      detailProduct: product,
    });
    // this.setState(() => {
    //   return { detailProduct: product };
    // });
  };

  addToCart = (id) => {
    console.log(`hello from detail. Id is ${id}`);
    let tempProducts = [...this.state.products];
    // const index = tempProducts.indexOf(this.getItem(id));
    const product = this.getItem(id);
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.addTotals();

    this.setState(
      {
        products: tempProducts,
        cart: [...this.state.cart, product],
      },
      () => this.addTotals()
    );
  };

  openModal = (id) => {
    const product = this.getItem(id);
    this.setState({
      modalProduct: product,
      modalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  };

  increment = (id) => {
    console.log('increment method');
    const tempCart = [...this.state.cart];
    let cartItem = tempCart.find((item) => item.id === id);
    cartItem.count += 1;
    cartItem.total = cartItem.count * cartItem.price;

    this.setState(
      {
        cart: tempCart,
      },
      () => this.addTotals()
    );
  };

  decrement = (id) => {
    console.log('decrement method');
    const tempCart = [...this.state.cart];
    let cartItem = tempCart.find((item) => item.id === id);
    if (cartItem.count > 0) {
      cartItem.count -= 1;
      cartItem.total = cartItem.count * cartItem.price;

      this.setState(
        {
          cart: tempCart,
        },
        () => this.addTotals()
      );
    }
  };

  addTotals = () => {
    const tempCart = [...this.state.cart];

    let subTotal = 0;

    tempCart.map((item) => (subTotal += item.total));
    let tax = subTotal / 10;
    let total = subTotal + tax;
    this.setState({
      cartSubtotal: subTotal,
      cartTax: tax,
      cartTotal: total,
    });
  };

  removeItem = (id) => {
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter((item) => item.id !== id);
    let tempProduct = this.getItem(id);
    tempProduct.inCart = false;
    tempProduct.total = 0;
    tempProduct.count = 0;

    this.setState({
      cart: tempCart,
    });
  };

  clearCart = () => {
    this.setState(
      {
        cart: [],
      },
      () => this.setProducts()
    );
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetails: this.handleDetails,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
          addTotals: this.addTotals,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
