import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Registerpage from './component/Registerpage'
import Userlogin from './component/Userlogin'
import Farmer from './dashboard_components/Farmer'
import Middleman from './dashboard_components/Middleman'
import { FarmerProductForm } from './data/FarmerProductForm'
import {MiddlemanProductForm} from "./data/MiddlemanProductForm"
import { Personaldata } from './data/PersonalData'
const App = () => {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<Userlogin />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/personaldata" element={< Personaldata />}/>
        
        <Route path="/registration" element={<Registerpage />} />
        <Route path="/login/farmer-interface" element={<Farmer/>} />
        <Route path="/login/middleman-interface" element={<Middleman/>} />
        <Route path="/farmer/newproduct" element={<FarmerProductForm/>}/>
        <Route path="/middleman/newproduct" element={<MiddlemanProductForm/>}/>
          
        </Routes>
      </Router>
    </>
  )
}

export default App
