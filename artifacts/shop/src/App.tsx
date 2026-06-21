import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SearchPage from "@/pages/SearchPage";
import NotificationsPage from "@/pages/NotificationsPage";
import WishlistPage from "@/pages/WishlistPage";
import ProductPage from "@/pages/product/ProductPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminGuard from "@/components/AdminGuard";

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/shop/:slug*" component={({ params }: any) => <ShopPage params={{ slug: (params as any)["slug*"]?.split("/") }} />} />
        <Route path="/product/:slug" component={({ params }: any) => <ProductPage params={params} />} />
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/wishlist" component={WishlistPage} />
        <Route path="/admin">{() => <AdminGuard><AdminDashboard /></AdminGuard>}</Route>
        <Route path="/admin/products">{() => <AdminGuard><AdminProducts /></AdminGuard>}</Route>
        <Route path="/admin/orders">{() => <AdminGuard><AdminOrders /></AdminGuard>}</Route>
        <Route path="/admin/users">{() => <AdminGuard><AdminUsers /></AdminGuard>}</Route>
        <Route path="/admin/categories">{() => <AdminGuard><AdminCategories /></AdminGuard>}</Route>
        <Route>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-lg text-gray-600">Page not found</p>
            <a href="/" className="mt-6 text-blue-600 hover:underline">Go home</a>
          </div>
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </>
  );
}

export default App;
