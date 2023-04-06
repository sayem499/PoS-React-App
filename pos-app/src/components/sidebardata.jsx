import React from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';

export const SidebarData = [
    {
        title: "Dashboard",
        icon:  <GridViewIcon/>,
        link:  "/"
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
]