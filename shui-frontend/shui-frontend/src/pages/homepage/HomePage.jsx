import './index.css';
import Header from '../../components/header/Header';
import Button from '../../components/button/Button';
import MessageFlow from '../../components/messageflow/MessageFlow';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authstore';
import { getMessages, getAllMessagesFromUser } from '../../api/messages';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const [selectedUsername, setSelectedUsername] = useState(null);

    const {
        data: messages = [],
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['messages', selectedUsername],
        queryFn: () => selectedUsername
            ? getAllMessagesFromUser(selectedUsername)
            : getMessages(),
    });

    const sortedMessages = [...messages].sort(
    (firstMessage, secondMessage) =>
        new Date(secondMessage.createAt) -
        new Date(firstMessage.createAt)
    );

    return (
        <section className="page homepage">
            <Header />
            <div className="wrapper">
                <section className="homepage__top">
                    <h2 className="homepage__title">
                        Alla meddelanden
                    </h2>
                    {selectedUsername && (
                        <Button
                            text="Visa alla meddelanden"
                            type="outline"
                            htmlType="button"
                            onClick={() => setSelectedUsername(null)}
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
                        onUsernameClick={setSelectedUsername}
                    />
                )}
            </div>
        </section>
    )
}

export default HomePage;