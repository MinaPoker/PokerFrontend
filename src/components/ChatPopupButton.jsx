import React, { useEffect, useRef, useState } from "react";
import StyledButton from '@/components/styled-button'
import { AiFillWechat } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import ChatContainer from './ChatContainer';
import { io } from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/navigation";

const ChatPopup = () => {
  const socket = useRef();
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const connectSocketIfUserExists = () => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  };

  const fetchData = async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        try {
          const response = await axios.get(
            `${allUserRoute}/${currentUser._id}`
          );
          setContacts(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        router.push("/chats");
      }
    }
  };


  useEffect(() => {
    connectSocketIfUserExists();
  }, [currentUser]);

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
      {isOpen &&  <ChatContainer />}
    </div>
  );
};

export default ChatPopup;