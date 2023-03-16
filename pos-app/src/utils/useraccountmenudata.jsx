import React from "react";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedEIcon from '@mui/icons-material/ExitToAppOutlined';
export const UserAccountMenuData = [
    {
        title: "Profile",
        icon: <AccountCircleOutlinedIcon/>,
        link: "/profile"

    },
    {
        title: "Signout",
        icon: <ExitToAppOutlinedEIcon/>,
        link:"/signout" 
    }
]