import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import './index.css';
import Button from '../button/Button';
import { newMessage, editMessage } from '../../api/messages';
import { useAuthStore } from '../../stores/authstore';


const MessageForm = ({ message, messageId }) => {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const username = useAuthStore((state) => state.user?.username);

    const [text, setText] = useState(message?.message ?? '');

    const {
        mutate,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: (messageData) => {
            if (message) {
                return editMessage(messageData, token, messageId);
            }

            return newMessage(messageData, token);
        },
        onSuccess: () => {
            navigate('/');
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!text.trim()) {
            return;
        }

        mutate({
            username,
            message: text.trim(),
        });
    };

    return (
        <form 
            className="message-form"
            onSubmit={handleSubmit}
        >
            <label className="message-form__label">
                Meddelande

                <div className="message-form__textarea-wrapper">
                    <textarea
                        className="message-form__textarea"
                        placeholder="Vad vill du säga?"
                        maxLength={200}
                        value={ text }
                        onChange={(event) => setText(event.target.value)}
                    />

                    <span className="message-form__counter">
                        {text.length}/200
                    </span>
                </div>
            </label>
            <Button
                text={message ? 'Spara ändringar' : 'Publicera'}
                type="default"
            />

            <Button
                text="Rensa"
                type="outline"
                htmlType="button"
                onClick={() => setText('')}
            />

            {isPending && <p>Publicerar...</p>}
            {isError && (
                <p className="message-form__error">
                    {error.message}
                </p>
            )}
        </form>
    );
};

export default MessageForm;