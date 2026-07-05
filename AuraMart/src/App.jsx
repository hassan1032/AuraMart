
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/homepages/Home";
import Collection from "./components/collection/Collection";
import ViewProduct from "./components/viewproduct/ViewProduct";
import ProductCard from "./components/product-card/ProductCard";
import Checkout from "./components/checkoutpage/Checkout";
import AccessoriesPage from "./components/accessories/AccessoriesPage";
import AccessoryView from "./components/accessories/AccessoryView";
import Event from "./components/events/Event";
import Stockist from "./components/Stocki/Stockist";
import ShoppingCart from "./components/shoppingCart/ShoppingCart";
import PaymentCart from "./components/paymentpage/PaymentCart";
import MyOrders from "./components/orders/MyOrders";
import ViewEvent from "./components/events/ViewEvent";
import Whislist from "./components/whislist/Whislist";
import Policy from "./components/Policy/Policy";
import About from "./components/about/About";
import Testimonials from "./components/testimonials/Testimonials";
import Media from "./components/media/Media";
import Blogs from "./components/blogs/Blogs";
import BlogsDetails from "./components/blogs/BlogsDetails";
import Contact from "./components/contact/Contact";
import OrderTrack from "./components/trackorder/OrderTrack";
import ViewOrderTrack from "./components/trackorder/ViewOrderTrack";
import AccountPanel from "./components/account/AccountPanel";
import Career from "./components/career/Career";
import SearchStockist from "./components/Stocki/SearchStockist";
import ScrollLink from "./ScrollLink";
import OtpModal from "./components/signInModel/OtpModal";

const AppRoutes = () => {
  const { cartItems, setCartItems, addToCart, openCart, isCartOpen, closeCart, removeFromCart } = useCart();

  return (
    <>
      <Navbar />
      <ScrollLink />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} openCart={openCart} />} />
        <Route path="/collections" element={<Collection addToCart={addToCart} openCart={openCart} />} />
        <Route path="/product/:id" element={<ViewProduct addToCart={addToCart} openCart={openCart} />} />
        <Route path="/product" element={<ProductCard addToCart={addToCart} openCart={openCart} />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/cart-checkout" element={<PaymentCart cartItems={cartItems} />} />
        <Route path="/accessories" element={<AccessoriesPage addToCart={addToCart} openCart={openCart} />} />
        <Route path="/accessory/:id" element={<AccessoryView />} />
        <Route path="/events" element={<Event />} />
        <Route path="/view-event/:id" element={<ViewEvent />} />
        <Route path="/account" element={<AccountPanel />} />
        <Route path="/stockist" element={<Stockist />} />
        <Route path="/whislist" element={<Whislist addToCart={addToCart} openCart={openCart} />} />
        <Route path="/register-otp" element={<OtpModal />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/media" element={<Media />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/view-blog" element={<BlogsDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track-orders" element={<OrderTrack />} />
        <Route path="/view-order" element={<ViewOrderTrack />} />
        <Route path="/careers" element={<Career />} />
        <Route path="/search" element={<SearchStockist />} />
      </Routes>
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        setCartItems={setCartItems}
        removeFromCart={removeFromCart}
      />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastStyle={{ fontFamily: 'inherit', fontSize: '14px' }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
