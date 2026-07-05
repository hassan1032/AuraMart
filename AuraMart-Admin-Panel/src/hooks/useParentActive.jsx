import { useLocation } from "react-router-dom"

export const allRoutePaths = [
    "/admin/all-orders",
    "/admin/orders/pending",
    "/admin/orders/confirm",
    "/admin/orders/processing",
    "/admin/orders/pickup",
    "/admin/orders/on-the-way",
    "/admin/orders/delivered",
    "/admin/orders/return",
    "/admin/orders/replacement",
    "/admin/orders/cancel",
];

export const customizeRoute = [
    "/admin/product/customize",
    "/admin/product/customize/view/:_id"
]

export const useParentActive = () => {

    const location = useLocation();


    const isParentActive = (childPaths = []) => {
        return childPaths.some(path => location.pathname === path || location.pathname.startsWith(path));
    };

    return { isParentActive };
}