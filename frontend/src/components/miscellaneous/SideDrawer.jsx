import React, { useState } from 'react';
import {
  Tooltip, Button, Box, Text, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Avatar, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Flex, Input, useToast,
  Spinner
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from './ProfileModal';
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import ChatLoading from './ChatLoading';
import axios from 'axios';
import NotificationBadge, { Effect } from 'react-notification-badge';
import UserListItem from '../userAvatar/UserListItem';
import { getSender } from '../../config/ChatLogic';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, chats, setChats, setSelectedChat, notification, setNotification } = ChatState();
  const navigate = useNavigate();

  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userinfo");
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection='row'
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>
        <Button variant='ghost' onClick={onOpen}>
          <FaSearch />
          <Text display={{ base: "none", md: "flex" }} px={4}>Search User</Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily='Work sans'>
        Chatify
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
             <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            /> 
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "no new messages"}
            {notification.map((noti) => (
              <MenuItem key={noti._id}
              onClick={() => {setSelectedChat(noti.chat);
                setNotification(notification.filter((n) => n._id !== noti._id))
              }}>
                {noti.chat.isGroupChat
                 ? `new message in ${noti.chat.chatName}`
                 : `new message from ${getSender(user, noti.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size='sm'
              cursor='pointer'
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
      {/* Closing the Drawer component properly */}
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={'1px'}>Search users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml = 'auto' display="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
