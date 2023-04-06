import "./css/App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout.jsx'
import Dashboard from './views/dashboard.jsx'
import Customers from './views/customers.jsx'
import Products from './views/products.jsx'
import Suppliers from './views/suppliers.jsx'
import Profile from './views/profile.jsx'
import Login from './views/login.jsx'
import Users from './views/users.jsx'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'


function App() {

    return (
    <div className="App">
       <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path = "/" element = {<Layout/>}>
                <Route index element = {<Dashboard/>}></Route>
                <Route path="/customers" element={<Customers/>}></Route>
                <Route path="/products" element={<Products/>}></Route>
                <Route path="/suppliers" element={<Suppliers/>}></Route>
                <Route path="/profile" element={<Profile/>}></Route>
                <Route path="/users" element={<Users/>}></Route>
            </Route>


        </Routes>
       </BrowserRouter>
       <ToastContainer/>
    </div> 
    )
}

export default App