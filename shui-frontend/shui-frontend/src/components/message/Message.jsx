import './index.css';
import { NotePencilIcon, TrashIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authstore';
import { formatDate } from '../../utils';
import { deleteMessage } from '../../api/messages';
import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

const Message = ({ message, onUsernameClick }) => {
    const navigate = useNavigate(); 
    const loggedInUsername = useAuthStore((state) => state.user?.username);
    const queryClient = useQueryClient();
    const token = useAuthStore((state) => state.token);
    const username = message.GSI1PK?.replace('MESSAGE:', '') || 'Unknown user';
    const nameParts = username.trim().split(/\s+/);
    const initials = nameParts.length > 1
    ? nameParts
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : username.substring(0, 2).toUpperCase();
    const messageId = message.SK?.replace('MESSAGE:', '');
    const isOwner = loggedInUsername === username;

    const {
        mutate: removeMessage,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: () => deleteMessage(token, messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['messages'],
            });
        },
    });

    const handleDelete = () => {
        const confirmed = window.confirm(
            'Är du säker på att du vill radera meddelandet?'
        );

        if (confirmed) {
            removeMessage();
        }
    };

    return (
        <article className="message">
            <h3 className="message__initials"
                onClick={() => onUsernameClick(username)}
            >
                {initials}
            </h3>

            <div className="message__content">
                <div className="message__content-top">
                    <h4
                        className="message__user"
                        onClick={() => onUsernameClick(username)}
                    >
                        {username}</h4>
                    <p className="message__date">
                        { formatDate(message.createAt) }
                        {message.editedAt && (
                         <span className="message__edited">
                            {' '}
                            (redigerad {formatDate(message.editedAt)})
                        </span>
                        )}
                    </p>
                </div>
                <p className="message__text">
                    { message.message }
                </p>
            </div>
            {isOwner && (
                <div className="message__icon-group">
                    <NotePencilIcon
                        className="icon icon--pencil"
                        size={20}
                        weight="bold"
                        onClick={() =>
                        navigate(`/messages/edit/${messageId}`, {
                            state: { message },
                        })
                    }
                    />

                    <TrashIcon
                        className="icon icon--trash"
                        size={20}
                        weight="bold"
                        color="red"
                        onClick={handleDelete}
                    />
                </div>
            )}
            {isPending && <p>Raderar...</p>}

            {isError && (
                <p className="message__error">
                    {error.message}
                </p>
            )}
        </article>
    )
}

export default Message;