import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout.jsx'
import Dashboard from './views/dashboard.jsx'
import Customers from './views/customers.jsx'
import Products from './views/products.jsx'
import Suppliers from './views/suppliers.jsx'
import "./css/App.css"

function App() {

    return (
    <div className="App">
       <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Layout/>}>
                <Route index element = {<Dashboard/>}></Route>
                <Route path="/customers" element={<Customers/>}></Route>
                <Route path="/products" element={<Products/>}></Route>
                <Route path="/suppliers" element={<Suppliers/>}></Route>
            </Route>


        </Routes>
       </BrowserRouter>
    </div> 
    )
}

export default App