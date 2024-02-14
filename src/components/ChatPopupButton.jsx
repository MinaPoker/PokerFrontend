import React, { useState } from 'react';
import StyledButton from '@/components/styled-button'
// import ChatContainer from './ChatContainer';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-1 ">
      <button className="chat-button" onClick={toggleChat}>
        {isOpen ? (
          <StyledButton className='bg-[#0c7aff] m-4 text-2xl'> Close Chat </StyledButton>
        ) : (
          <StyledButton className='bg-[#0c7aff] m-4 bottom-4 text-2xl left-3/5 text-black'> Open Chat </StyledButton>
        )}
      </button>
      {isOpen && "Hello"}
    </div>
  );
};

export default ChatPopup;