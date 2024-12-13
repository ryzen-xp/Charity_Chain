import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Web3 from "web3";

export default function NavBar() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected the request");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        pos="fixed"
        top="0"
        w={"full"}
        minH={"60px"}
        boxShadow={"sm"}
        zIndex="999"
        justify={"center"}
        css={{
          backdropFilter: "saturate(180%) blur(5px)",
          backgroundColor: useColorModeValue(
            "rgba(255, 255, 255, 0.8)",
            "rgba(26, 32, 44, 0.8)"
          ),
        }}
      >
        <Container as={Flex} maxW={"7xl"} align={"center"}>
          <Flex flex={{ base: 1 }} justify="start" ml={{ base: -2, md: 0 }}>
            <Heading
              textAlign="left"
              fontFamily={"heading"}
              color={useColorModeValue("teal.800", "white")}
              as="h2"
              size="lg"
            >
              <Box
                as={"span"}
                color={useColorModeValue("teal.400", "teal.300")}
                position={"relative"}
                zIndex={10}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  w: "full",
                  h: "30%",
                  zIndex: -1,
                }}
              >
                <NextLink href="/">Charity Chain</NextLink>
              </Box>
            </Heading>
          </Flex>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
            display={{ base: "none", md: "flex" }}
          >
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
            >
              <NextLink href="/campaign/new">Register NGO</NextLink>
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
            >
              <NextLink href="/#howitworks"> How it Works</NextLink>
            </Button>

            {isConnected ? (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {account.substr(0, 10) + "..."}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={disconnectWallet}>
                    Disconnect Wallet
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"md"}
                fontWeight={600}
                color={"white"}
                bg={"teal.400"}
                _hover={{
                  bg: "teal.300",
                }}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}

            <DarkModeSwitch />
          </Stack>

          <Flex display={{ base: "flex", md: "none" }}>
            <DarkModeSwitch />
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
}
