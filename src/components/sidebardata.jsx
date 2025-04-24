import React from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PurchaseIcon from '../assets/box.png';
import SettingsIcon from '@mui/icons-material/Settings';
export const SidebarData = [

    {
        title: "Dashboard",
        icon:  <GridViewIcon/>,
        link:  "/dashboard"
    },
    {
        title: "Sale",
        icon:  <StorefrontOutlinedIcon/>,
        link:  "/sale"

    },
    {
        title: "Purchase",
        icon:  <img src={PurchaseIcon} alt="Purchase Icon" style={{ width: 26, height: 26}} />,
        link:  "/purchase"

    },
    {
        title: "Customers",
        icon:  <PeopleIcon/>,
        link:  "/customers"
    },
    {
        title: "Products",
        icon:  <Inventory2Icon/>,
        link:  "/products"
    },
    {
        title: "Suppliers",
        icon:  <LocalShippingIcon/>,
        link:  "/suppliers"
    },
    {
        title: "Users",
        icon:  <GroupAddTwoToneIcon/>,
        link:  "/users"
    },
    {
        title: "Settings",
        icon:  <SettingsIcon/>,
        link:  "/settings"
    },
]