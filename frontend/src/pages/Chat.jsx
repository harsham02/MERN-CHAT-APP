import React, { useState } from 'react'

import { Box } from "@chakra-ui/layout";
import SideDrawer from '../components/miscellaneous/SideDrawer';
import './Chat.css'
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import { ChatState } from '../context/ChatProvider';

const Chat = () => {
  const {user} = ChatState();
 const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }} className='chat'>
    {user && <SideDrawer />}
    <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
       {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      {user && (
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )} 
    </Box>
  </div>
  )
}

export default Chat
