import './index.css';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import { useAuthStore } from "../../stores/authstore";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login as loginUser } from "../../api/auth";

const LoginForm = () => {
	const saveToken = useAuthStore(state => state.login);
	const navigate = useNavigate();

    const {
		mutate,
		isPending,
		isError,
		error,
		isSuccess
	} = useMutation({
		mutationFn : loginUser,
		onSuccess : (data) => {
			saveToken(data.token);
			navigate('/');
		}
	});

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
    
        mutate({
            username: formData.get('username'),
            password: formData.get('password'),
        });
    };

    return (
        <form 
            className="login-form"
            onSubmit={handleSubmit}
        >
            <label className="login-form__label">
                Username
                <input
                    name="username"
                    type="text"
                    className="login-form__input"
                    placeholder="test123"
                />
            </label>
            <label className="login-form__label">
                Lösenord
                <input
                    name="password"
                    type="password"
                    className="login-form__input"
                    placeholder="********"
                />
            </label>
            <Button 
                text="Logga in"
                type="default"
                onClick={ () => console.log('Logga in') }
            />

            {isPending && <p>Logging in...</p>}
            {isError && <p className="login-form__error">{error.message}</p>}
            {isSuccess && (
                <p className="login-form__success">
                    Logged in!
                </p>
            )}

            <p className="login-form__message">
                Har du inget konto? <Link to="/register" className="login-form__message-link">Registrera dig här!</Link>
            </p>
        </form>
    )
}

export default LoginForm;