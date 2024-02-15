import React, { useState } from 'react';
import StyledButton from '@/components/styled-button'
import { AiFillWechat } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import { a } from '@react-spring/web';


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
          <button className="bg-blue-500 text-xl m-4 font-extrabold text-white py-2 px-4 rounded-[50px] hover:bg-blue-600 transition duration-300 flex items-center">
            <AiFillWechat className='mr-2 text-[30px]'/>
            Chat
          </button>
          
        ) : (
          <button className="bg-blue-500 text-xl m-4 font-extrabold text-white py-2 px-4 rounded-[50px] hover:bg-blue-600 transition duration-300 flex items-center">
            <BsChatDotsFill  className='mr-2 text-[30px]' />
            Chat 
            </button>
        )}
      </button>
      {isOpen && alert('Chatbox is opened')}
    </div>
  );
};

export default ChatPopup;