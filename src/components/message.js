const { createElement: e } = React;

const Message = ({ message }) => {
    return (
        e('li', null, message)
    );
};

export default Message;
