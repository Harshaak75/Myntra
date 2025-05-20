import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GridSellerDashboard from "./Components/GridSellerDashboard";
import SellerCatalog from "./Pages/SellerPages/Seller.Cataloguing.js";
import { SellerSignin } from "./Pages/SellerPages/Seller.Signin.js";
import Layout from "./Components/Layout.jsx";
import SellerForm from "./Pages/SellerPages/Seller.AccountDetails";
import SellerDeatils from "./Pages/SellerPages/Seller.ShopDetails.js";
import { SellerLogin } from "./Pages/SellerPages/Seller.Login.js";
import { NavbarUser } from "./UserComponents/NavbarUser.js";
import { UserDashboard } from "./Pages/UsersPage/UserDashboard.js";
import { OrdersMdirect } from "./Pages/SellerPages/Orders/Orders.Mdirect.js";
import OrderLayout from "./Components/OrderLayout.js";
import { PackingItems } from "./Pages/SellerPages/Orders/PackingItems.js";
import { OrderDetails } from "./Pages/SellerPages/Orders/OrderDetails.js";
import { OrderProductDetails } from "./Pages/SellerPages/Orders/OrderedProductDetails.js";

import RouteDecider from "./RouteDecider.js";
import { Mobilehome } from "./Pages/UserMobilePage/Mobilehome.js";
import Dashboard from "./Pages/ProductAdminDashboard/ProductDashboard.js";
import { Playout } from "./Components/ProductAdmin/Playout.js";
import { ManageProduct } from "./Components/ProductAdmin/ManageProduct.js";
import ProductLogin from "./Pages/ProductAdminDashboard/ProductLogin.js";
import { MobileUserLayout } from "./Components/MobileUsers/MobileUserLayout.js";
import { Account } from "./Components/MobileUsers/Account.js";
import { Loginmobile } from "./Pages/UserMobilePage/Loginmobile.js";
import { LoginOTP } from "./Pages/UserMobilePage/LoginOTP.js";
import { Wishlistmobile } from "./Pages/UserMobilePage/MobileProfile/Wishlistmobile.js";
import { Ordermobile } from "./Pages/UserMobilePage/MobileProfile/Ordermobile.js";
import { Profilemobile } from "./Pages/UserMobilePage/MobileProfile/Profilemobile.js";
import ProductGrid from "./Pages/UserMobilePage/MobileProfile/ProductGrid.js";
import AccountPage from "./Components/MobileUsers/AccountPage.js";
import { PendingVerification } from "./Components/PendingVerification.js";
import SellerApprovalPanel from "./Components/ProductAdmin/SellerApprovalPanel.js";
import { SidebarAccount } from "./Components/MobileUsers/AccountComp/SidebarAccount.js";
import { SidebarLayout } from "./Components/MobileUsers/SidebarLayout.js";
import Wishlists from "./Components/MobileUsers/Wishlists.js";
import { ShoppingBag } from "lucide-react";
import ShoppingBagComp from "./Components/MobileUsers/ShoppingBagComp.js";
import { Address } from "./Components/MobileUsers/Address.js";
import Productshowcase from "./Components/MobileUsers/Productshowcase.js";
import { NavbarSB } from "./Components/MobileUsers/NavbarSB.js";
import AddressSection from "./Components/MobileUsers/Order/AddressSection.js";
import { OrderUserLayout } from "./Components/MobileUsers/Order/OrderUserLayout.js";
import PaymentOption from "./Components/MobileUsers/Order/PaymentOption.js";
import Orderplaced from "./Components/MobileUsers/Order/Orderplaced.js";
import Sellerform from "./Components/Seller/Sellerform.js";
import SellerDashboardSection from "./Components/SellerFrontend/SellerDashboardSection.js";

// const topbar = ["MEN", "WOMEN", "KIDS", "LIVING", "BEAUTY"];

// Define icon sizes
// const iconSizes: Record<string, number> = {
//   User: 24,
//   Heart: 20,
//   ShoppingBag: 22,
//   Menu: 18,
// };

// const icon_size = [20, 20, 20, 24]

function App() {
  return (
    <div className="h-screen bg-gray-100">
      {/* <Signin/> */}

      <Router>
        <Routes>
          {/* <Route path="/" element={<RouteDecider />} /> */}
          {/* ✅ Route without Navbar */}
          <Route path="/seller/signin" element={<SellerSignin />} />
          {/* Signin added you can change it */}
          <Route path="/SellerLogin" element={<SellerLogin />} />
          {/* ✅ Routes with Navbar (Wrapped inside Layout) */}
          <Route path="/seller/pending-verification" element={<PendingVerification/>}/>
          <Route element={<Layout />}>
            <Route path="/seller/dashboard" element={<GridSellerDashboard />} />
            <Route path="/seller/cataloguing" element={<SellerCatalog />} />
            <Route path="/accountDetails" element={<SellerForm />} />
            <Route path="/manage-shop" element={<SellerDeatils />} />
          </Route>
          
          {/* orders seller */}
          <Route element={<OrderLayout />}>
            <Route path="/Orders/Search" element={<OrdersMdirect />} />
            <Route path="/Orders/Packing" element={<PackingItems />} />
            <Route path="/Orders/Details" element={<OrderDetails />} />
            <Route
              path="/Orders/Open/Details"
              element={<OrderProductDetails />}
            />
            <Route path="/PackOrders/Operations" element={<PackingItems />} />
          </Route>
          {/* ✅ Routes with User*/}

          {/* login page of mobile uders */}
          <Route path="/users/login" element={<Loginmobile />} />
          <Route path="/users/login/otp" element={<LoginOTP />} />

          <Route path="/" element={<Mobilehome />} />

          <Route path="/sellerForm" element={<Sellerform/>}/>

          <Route path="/sellerPage" element={<SellerDashboardSection/>}/>

          

          

          <Route element={<OrderUserLayout/>}>
          <Route path="/checkout/cart" element={<ShoppingBagComp/>}/>
          <Route path="/checkout/address" element={<AddressSection/>}/>
          <Route path="/checkout/payment" element={<PaymentOption/>}/>
          </Route>

          {/* wishlist */}

          <Route
            path="/user/Collection & Wishlist"
            element={<Wishlistmobile />}
          />

          <Route element={<MobileUserLayout />}>
            <Route path="/user/account" element={<Account />} />
            <Route path="/user/Order" element={<Ordermobile />} />
            <Route path="/user/Edit Profile" element={<Profilemobile />} />
            <Route path="/user/Products/:category" element={<ProductGrid/>}/>
            <Route path="/my/wishlist" element={<Wishlists/>}/>
            <Route path="/cart/:name/:id" element={<Productshowcase/>}/>
            <Route path="/user/orderPage" element={<Orderplaced/>}/>
            <Route element= {<SidebarLayout/>}>
            <Route path="/user/profile/edit" element={<AccountPage/>} />
            <Route path="/user/my/address" element={<Address/>} />
            </Route>
          </Route>

          {/* <Route path="/user/navbar" element={<UserDashboard />} /> */}

          <Route path="/productAdmin/login" element={<ProductLogin />} />
          {/* routes for product admin */}
          <Route element={<Playout />}>
            <Route path="/productAdmin/dashboard" element={<Dashboard />} />
            <Route
              path="/productAdmin/manageProduct"
              element={<ManageProduct />}
            />
            <Route path="/admin/approval" element={<SellerApprovalPanel/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
