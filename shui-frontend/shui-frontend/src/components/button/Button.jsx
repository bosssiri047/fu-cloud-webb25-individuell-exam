import './index.css';

const Button = ({ text, type, onClick, htmlType = 'submit' }) => {
    return (
        <button 
            type={htmlType}
            className={`button button--${type}`}
            onClick={ onClick }
        >
            { text }
        </button>
    )
}

export default Button;