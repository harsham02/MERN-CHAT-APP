import React from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import './Home.css';
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';

const Home = () => {
  return (
    <div className="home-container">
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          p={1}
          bg="white"
          w="100%"
          m="6px 0 15px 0"
          borderRadius="lg"
          borderWidth="2px"
        >
          <Text fontSize="4xl" fontFamily="Work sans" textAlign='center' fontWeight='500'>
            Chatify
          </Text>
        </Box>
        <Box bg='white' w='100%' p={2} borderRadius="lg" borderWidth='1px'>
          <Tabs variant='soft-rounded' colorScheme='blue'>
            <TabList mb='0.5em'>
              <Tab w='50%'>Login</Tab>
              <Tab w='50%'>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
             <Login /> 
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
}

export default Home;
