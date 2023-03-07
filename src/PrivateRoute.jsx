import useToken from '../components/CustomHooks/useToken';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children}) => {
    const { token, setToken } = useToken();
        
    if (token) {
      return children
    }
      
    return <Navigate to="/"/>
}