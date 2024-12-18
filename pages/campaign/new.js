import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightAddon,
  InputGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getETHPrice, getETHPriceInUSD } from "../../lib/getETHPrice";

import factory from "../../smart-contract/factory";
import web3 from "../../smart-contract/web3";

export default function NewCampaign() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [minContriInUSD, setMinContriInUSD] = useState();
  const [targetInUSD, setTargetInUSD] = useState();
  const [ETHPrice, setETHPrice] = useState(0);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useAsync(async () => {
    try {
      const result = await getETHPrice();
      setETHPrice(result);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (err) {
      console.log("Error connecting to wallet", err);
    }
  };

  async function onSubmit(data) {
    console.log(
      data.minimumContribution,
      data.campaignName,
      data.description,
      data.imageUrl,
      data.target
    );
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(
          web3.utils.toWei(data.minimumContribution, "ether"),
          data.campaignName,
          data.description,
          data.imageUrl,
          data.target
        )
        .send({
          from: accounts[0],
        });

      router.push("/");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  return (
    <div>
      <Head>
        <title>New Campaign</title>
        <meta name="description" content="Create New Campaign" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
          <Text fontSize={"lg"} color={"teal.400"}>
            <ArrowBackIcon mr={2} />
            <NextLink href="/"> Back to Home</NextLink>
          </Text>
          <Stack>
            <Heading fontSize={"4xl"}>Register a New NGO 📢</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id="minimumContribution">
                  <FormLabel>
                    Minimum Contribution Amount to become Approver
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      step="any"
                      {...register("minimumContribution", { required: true })}
                      isDisabled={isSubmitting}
                      onChange={(e) => {
                        setMinContriInUSD(Math.abs(e.target.value));
                      }}
                    />
                    <InputRightAddon children="ETH" />
                  </InputGroup>
                  {minContriInUSD ? (
                    <FormHelperText>
                      ~₹ {getETHPriceInUSD(ETHPrice, minContriInUSD)}
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl id="campaignName">
                  <FormLabel>NGO Name</FormLabel>
                  <Input
                    {...register("campaignName", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>NGO Description</FormLabel>
                  <Textarea
                    {...register("description", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="imageUrl">
                  <FormLabel>Poster Image URL</FormLabel>
                  <Input
                    {...register("imageUrl", { required: true })}
                    isDisabled={isSubmitting}
                    type="url"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Website link (optional)</FormLabel>
                  <Input />
                </FormControl>
                <FormControl id="target">
                  <FormLabel>Legal Document link</FormLabel>
                  <InputGroup>
                    <Input
                      type="url"
                      step="any"
                      {...register("target", { required: false })}
                      isDisabled={isSubmitting}
                      // onChange={(e) => {
                      //   setTargetInUSD(Math.abs(e.target.value));
                      // }}
                    />
                    {/* <InputRightAddon children="ETH" /> */}
                  </InputGroup>
                  {targetInUSD ? (
                    <FormHelperText>
                      ~₹ {getETHPriceInUSD(ETHPrice, targetInUSD)}
                    </FormHelperText>
                  ) : null}
                </FormControl>

                {error ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}> {error}</AlertDescription>
                  </Alert>
                ) : null}
                {errors.minimumContribution ||
                errors.name ||
                errors.description ||
                errors.imageUrl ||
                errors.target ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}>
                      {" "}
                      All Fields are Required
                    </AlertDescription>
                  </Alert>
                ) : null}
                <Stack spacing={10}>
                  {isConnected ? (
                    <Button
                      bg={"teal.400"}
                      color={"white"}
                      _hover={{
                        bg: "teal.500",
                      }}
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      Create
                    </Button>
                  ) : (
                    <Stack spacing={3}>
                      <Button
                        color={"white"}
                        bg={"teal.400"}
                        _hover={{
                          bg: "teal.300",
                        }}
                        onClick={connectWallet}
                      >
                        Connect Wallet
                      </Button>
                      <Alert status="warning">
                        <AlertIcon />
                        <AlertDescription mr={2}>
                          Please Connect Your Wallet First for Register NGO
                        </AlertDescription>
                      </Alert>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </main>
    </div>
  );
}
