import { FirstApp } from './FirstApp';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {PrivateRoute} from './PrivateRoute';
import { Login } from './Login';

export const AppRoutes = () => {

    return (
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login/>}/>
              <Route path="/machine-management" element={
                <PrivateRoute>
                  <FirstApp/>
                </PrivateRoute>
              }/>
              <Route render={() => <Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </div>
    )
}