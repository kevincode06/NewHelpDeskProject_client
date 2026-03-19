import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTickets from './pages/admin/AdminTicket';



const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); 
  if (loading) return <div>Loading</div>
  return user ? children : <Navigate to='/login' />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>
  return user && user.role === 'admin' ? children : <Navigate to='/dashboard' />;
};

function AppRoutes() {
  return ( 
    <> 
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/tickets/new' element={<PrivateRoute><NewTicket /></PrivateRoute>} />
        <Route path='/tickets/:id' element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
        <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path='/admin/tickets/:id' element={<AdminRoute><AdminTickets /></AdminRoute>} />
        <Route path='/' element={<Navigate to='/dashboard' />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;