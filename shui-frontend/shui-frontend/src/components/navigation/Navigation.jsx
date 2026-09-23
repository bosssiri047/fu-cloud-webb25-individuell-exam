import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import { useAuthStore } from '../../stores/authstore';

const Navigation = () => {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    const handleAuthClick = () => {
        if (token) {
            logout();
            navigate('/login');
        } else {
            navigate('/login');
        }
    };

    return (
        <nav className="nav">
            <NavLink to="/" className="nav__link">Hem</NavLink>
            <Button
                text={token ? 'Sign out' : 'Logga in'}
                type="default"
                onClick={handleAuthClick}
            />
        </nav>
    )
}

export default Navigation;