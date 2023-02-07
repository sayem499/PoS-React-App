import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './components/layout.js'
import Dashboard from './views/dashboard.js'
import "./css/App.css"

function App() {

    return (
    <div className="App">
       <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<Layout/>}>
                <Route index element = {<Dashboard/>}></Route>

            </Route>


        </Routes>
       </BrowserRouter>
    </div> 
    )
}

export default App