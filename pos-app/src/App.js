import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout.js'
import Dashboard from './views/dashboard.js'
import Customers from './views/customers.js'
import Products from './views/products.js'
import Suppliers from './views/suppliers.js'
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