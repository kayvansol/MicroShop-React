import { Routes, Route, useLocation } from "react-router-dom";
import PageFade from "@shared/components/PageFade";

import Home from "@/features/home/Home";
import AddToBasket from "@features/basket/AddToBasket";
import CheckoutBasket from "@features/basket/CheckoutBasket";
import OrderPayment from "@features/payments/OrderPayment";
import ProductInsert from "@features/products/ProductList";
import Orders from '@features/orders/Orders'
import MainLayout from "@layouts/MainLayout";

export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route
                    path="/"
                    element={
                        <PageFade key={location.pathname}>
                            <Home />
                        </PageFade>
                    }
                />
                <Route
                    path="/product"
                    element={
                        <PageFade key={location.pathname}>
                            <ProductInsert />
                        </PageFade>
                    }
                />
                <Route
                    path="/basket"
                    element={
                        <PageFade key={location.pathname}>
                            <AddToBasket />
                        </PageFade>
                    }
                />
                <Route
                    path="/Checkout"
                    element={
                        <PageFade key={location.pathname}>
                            <CheckoutBasket />
                        </PageFade>
                    }
                />
                <Route
                    path="/Payment"
                    element={
                        <PageFade key={location.pathname}>
                            <OrderPayment />
                        </PageFade>
                    }
                />
                <Route
                    path="/Order"
                    element={
                        <PageFade key={location.pathname}>
                            <Orders />
                        </PageFade>
                    }
                />
            </Route>
        </Routes>
    );
}
