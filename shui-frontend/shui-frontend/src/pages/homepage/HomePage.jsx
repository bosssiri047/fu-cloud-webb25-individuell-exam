import './index.css';
import Header from '../../components/header/Header';
import Button from '../../components/button/Button';
import MessageFlow from '../../components/messageflow/MessageFlow';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authstore';
import { getMessages, getAllMessagesFromUser } from '../../api/messages';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const { username } = useParams();
    const {
        data: messages = [],
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['messages', username],
        queryFn: () => username
            ? getAllMessagesFromUser(username)
            : getMessages(),
    });

    const sortedMessages = [...messages].sort(
    (firstMessage, secondMessage) =>
        new Date(secondMessage.createAt) -
        new Date(firstMessage.createAt)
    );

    const handleUsernameClick = (clickedUsername) => {
        navigate(`/messages/get/${encodeURIComponent(clickedUsername)}`);
    };

    return (
        <section className="page homepage">
            <Header />
            <div className="wrapper">
                <section className="homepage__top">
                    <h2 className="homepage__title">
                        Alla meddelanden
                    </h2>
                    {username && (
                        <Button
                            text="Visa alla meddelanden"
                            type="outline"
                            htmlType="button"
                            onClick={() => navigate('/')}
                        />
                    )}
                    {token && (
                        <Button
                            text="Nytt meddelande"
                            type="default"
                            onClick={() => navigate('/messages/create')}
                        />
                    )}
                </section>
                {isPending && <p>Laddar meddelanden...</p>}

                {isError && (
                    <p className="homepage__error">
                        {error.message}
                    </p>
                )}

                {!isPending && !isError && (
                    <MessageFlow
                        messages={sortedMessages}
                        onUsernameClick={handleUsernameClick}
                    />
                )}
            </div>
        </section>
    )
}

export default HomePage;