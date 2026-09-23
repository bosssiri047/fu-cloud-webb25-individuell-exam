import './index.css';
import Message from '../message/Message';

const MessageFlow = ({ messages, onUsernameClick }) => {
    return (
        <section className="message-flow">
             {messages.map((message) => (
                <Message
                    key={message.SK}
                    message={message}
                    onUsernameClick={onUsernameClick}
                />
            ))}
        </section>
    )
}

export default MessageFlow;