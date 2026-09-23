import './index.css';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../api/auth';
import { useState } from 'react';

const RegisterForm = () => {
    const [passwordError, setPasswordError] = useState('');
	const {
		mutate,
		isPending,
		isError,
		error,
		isSuccess
	} = useMutation({
		mutationFn : register
	});


    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const user = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        };

        if (formData.get('password') !== formData.get('password2')) {
            setPasswordError('Lösenorden matchar inte.');
            return;
        }
        setPasswordError('');
        mutate(user);
    };

    return (
        <form   
            className="register-form"
            onSubmit={handleSubmit}
        >
            <label className="register-form__label">
                Användarnamn
                <input
                    name="username"
                    type="text"
                    className="register-form__input"
                    placeholder="Välj ett användarnamn"
                    required
                />
            </label>
            <label className="register-form__label">
                E-post
                <input
                    name="email"
                    type="email"
                    className="register-form__input"
                    placeholder="namn@exempel.se"
                    required
                />
            </label>
            <label className="register-form__label">
                Lösenord
                <input
                    name="password"
                    type="password"
                    className="register-form__input"
                    placeholder="Minst 8 tecken"
                    required
                />
            </label>
            <label className="register-form__label">
                Bekräfta lösenord
                <input
                    name="password2"
                    type="password"
                    className="register-form__input"
                    placeholder="Upprepa ditt lösenord"
                    required
                />
                {passwordError && (
                    <p className="register-form__error">{passwordError}</p>
                )}
            </label>
            <Button text="Registrera" type="default" />

            {isPending && <p>Creating account...</p>}
            {isError && <p className="register-form__error">{error.message}</p>}
            {isSuccess && (
                <p className="register-form__success">
                    Account successfully created!
                </p>
            )}

            <p className="register-form__message">
                Har du redan ett konto? <Link to="/login" className="register-form__message-link">Logga in här!</Link>
            </p>
        </form>
    )
}

export default RegisterForm;