import './index.css';
import { useLocation, useParams } from 'react-router-dom';
import BackIcon from '../../components/backicon/BackIcon';
import MessageForm from '../../components/messageform/MessageForm';

const EditMessagePage = () => {
    const { id } = useParams();
    const { state } = useLocation();

    const message = state?.message;

    return (
        <section className="page new-message-page">
            <div className="wrapper new-message-page__wrapper">
                <BackIcon />

                <section className="page__form-container">
                    <h1 className="page__title">
                        Ändra meddelande
                    </h1>

                    {message ? (
                        <MessageForm message={message} messageId={id} />
                    ) : (
                        <p>Could not find message.</p>
                    )}
                </section>
            </div>
        </section>
    );
}

export default EditMessagePage;