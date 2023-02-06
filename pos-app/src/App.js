import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout.js'
import Home from './views/home.js'

function App() {

    return (
       <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Layout/>}>
                <Route index element = {<Home/>}></Route>

            </Route>


        </Routes>
       </BrowserRouter> 
    )
}

export default App