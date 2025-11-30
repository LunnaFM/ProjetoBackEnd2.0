import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, User } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Building2 
              size={28} 
              color="#ffffff" 
              strokeWidth={2}
              style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }}
            />
            LDV Inn
          </h1>
          <nav className="nav">
            <Link to="/dashboard" className={isActive('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/clientes" className={isActive('/clientes')}>
              Clientes
            </Link>
            <Link to="/quartos" className={isActive('/quartos')}>
              Quartos
            </Link>
            <Link to="/reservas" className={isActive('/reservas')}>
              Reservas
            </Link>
          </nav>
          <div className="user-info">
            <User 
              size={20} 
              color="#ffffff" 
              strokeWidth={2}
              style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }}
            />
            <span>{user?.nome}</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>© 2024 LDV Inn - UTFPR</p>
      </footer>
    </div>
  );
};

export default Layout;