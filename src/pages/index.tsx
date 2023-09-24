"use client";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import {
    useInitWeb3InboxClient,
    useManageSubscription,
    useW3iAccount,
} from "@web3inbox/widget-react";
import "@web3inbox/widget-react/dist/compiled.css";

import { usePublicClient, useSignMessage } from "wagmi";
import { FaBell, FaBellSlash, FaPause, FaPlay } from "react-icons/fa";
import useSendNotification from "../utils/useSendNotification";
import { useInterval } from "usehooks-ts";
import Preferences from "../components/Preferences";
import Messages from "../components/Messages";
import Subscription from "../components/Subscription";
import Subscribers from "../components/Subscribers";
import { sendNotification } from "../utils/fetchNotify";
import { Accordion, Button, Flex, Heading, Tooltip, useColorMode, useToast } from "@chakra-ui/react";
import Image from "next/image";
import { BsPersonFillCheck, BsSendFill } from "react-icons/bs";
import Navbar from "@/components/core/Navbar";
import Layout from "@/components/layout";
import magicBell from "../services/magicBell"

import { useContractRead, useBalance, useAccount } from "wagmi";
import { fetchBalance } from '@wagmi/core'


const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

const Notifs = () => {

    const userAddress = useAccount();

    const isW3iInitialized = useInitWeb3InboxClient({
        projectId,
        domain: appDomain,
    });
    const {
        account,
        setAccount,
        register: registerIdentity,
        identityKey,
    } = useW3iAccount();
    const {
        subscribe,
        unsubscribe,
        isSubscribed,
        isSubscribing,
        isUnsubscribing,
    } = useManageSubscription(account);

    const { address } = useAccount({
        onDisconnect: () => {
            setAccount("");
        },
    });
    const { signMessageAsync } = useSignMessage();
    const wagmiPublicClient = usePublicClient();

    const { colorMode } = useColorMode();
    const toast = useToast();

    const { handleSendNotification, isSending } = useSendNotification();
    const [lastBlock, setLastBlock] = useState<string>();
    const [isBlockNotificationEnabled, setIsBlockNotificationEnabled] =
        useState(true);



    const signMessage = useCallback(
        async (message: string) => {
            const res = await signMessageAsync({
                message,
            });

            return res as string;
        },
        [signMessageAsync]
    );

    console.log("account,", account)

    // We need to set the account as soon as the user is connected
    useEffect(() => {
        if (!Boolean(address)) return;
        setAccount(`eip155:1:${address}`);
    }, [signMessage, address, setAccount]);

    const handleRegistration = useCallback(async () => {
        if (!account) return;
        try {
            await registerIdentity(signMessage);
        } catch (registerIdentityError) {
            console.error({ registerIdentityError });
        }
    }, [signMessage, registerIdentity, account]);

    useEffect(() => {
        if (!identityKey) {
            handleRegistration();
        }
    }, [handleRegistration, identityKey]);

    // handleSendNotification will send a notification to the current user and includes error handling.
    // If you don't want to use this hook and want more flexibility, you can use sendNotification.
    const handleTestNotification = useCallback(async () => {
        if (isSubscribed) {
            handleSendNotification({
                title: "GM Hacker",
                body: "Hack it until you make it!",
                icon: `${window.location.origin}/WalletConnect-blue.svg`,
                url: window.location.origin,
                type: "promotional",
            });
        }
    }, [handleSendNotification, isSubscribed]);

    // Example of how to send a notification based on some "automation".
    // sendNotification will make a fetch request to /api/notify
    const handleBlockNotification = useCallback(async () => {
        if (isSubscribed && account && isBlockNotificationEnabled) {
            const blockNumber = await wagmiPublicClient.getBlockNumber();
            const blockInfo = await wagmiPublicClient.getBlock();
            console.log("blockInfo", blockInfo)
            if (lastBlock !== blockNumber.toString()) {
                setLastBlock(blockNumber.toString());
                try {
                    toast({
                        title: "New block",
                        position: "top",
                        variant: "subtle",
                    });
                    await sendNotification({
                        accounts: [account],
                        notification: {
                            title: "New block",
                            body: blockNumber.toString(),
                            icon: `${window.location.origin}/eth-glyph-colored.png`,
                            url: `https://etherscan.io/block/${blockNumber.toString()}`,
                            type: "transactional",
                        },
                    });
                    await magicBell.sendNotification("hn_random");
                } catch (error: any) {
                    toast({
                        title: "Failed to send new block notification",
                        description: error.message ?? "Something went wrong",
                    });
                }
            }
        }
    }, [
        wagmiPublicClient,
        isSubscribed,
        lastBlock,
        account,
        toast,
        isBlockNotificationEnabled,
    ]);

    useInterval(() => {
        handleBlockNotification();
    }, 12000);


    const handleNotification = (blockNumber: string) => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                const notification = new Notification(`New block: ${blockNumber}`, {
                    body: `Click to see the block on Etherscan`,
                    data: { block: `https://etherscan.io/block/${blockNumber}` },
                    icon: `${window.location.origin}/icon-512x512.png`,
                });
                notification.onclick = function (event) {
                    event.preventDefault();
                    window.open(notification.data.block, "_blank");
                };
                notification.addEventListener("error", e => {
                    alert("An error occurred while trying to display the notification");
                }
                )
            }
        });
    }

    const balance = useBalance({
        address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
        chainId: 1,
        formatUnits: 'gwei',

    })

    console.log("user balance: ", balance + "ETH")



    return (
        <>
            <Flex w="full" flexDirection={"column"} maxW="700px" mt={4}>
                <Heading alignSelf={"center"} textAlign={"center"} mb={6} fontSize={20}>
                    Blockchain notifications
                </Heading>
                <Flex flexDirection="column" gap={4} position={"fixed"}>
                    {isSubscribed ? (
                        <Flex flexDirection={"column"} alignItems="center" gap={4}>
                            <Button leftIcon={<BsPersonFillCheck />} variant="outline" colorScheme="green" rounded="full" isDisabled={!isW3iInitialized}
                                onClick={() => {
                                    handleNotification(lastBlock?.toString() as string);
                                }
                                }
                            >Request notifications</Button>
                            <Button
                                leftIcon={<BsSendFill />}
                                variant="outline"
                                onClick={handleTestNotification}
                                isDisabled={!isW3iInitialized}
                                colorScheme="purple"
                                rounded="full"
                                isLoading={isSending}
                                loadingText="Sending..."
                            >
                                Send test notification
                            </Button>
                            <Button
                                leftIcon={isBlockNotificationEnabled ? <FaPause /> : <FaPlay />}
                                variant="outline"
                                onClick={() =>
                                    setIsBlockNotificationEnabled((isEnabled) => !isEnabled)
                                }
                                isDisabled={!isW3iInitialized}
                                colorScheme={isBlockNotificationEnabled ? "orange" : "blue"}
                                rounded="full"
                            >
                                {isBlockNotificationEnabled ? "Pause" : "Resume"} block
                                notifications
                            </Button>
                            <Button
                                leftIcon={<FaBellSlash />}
                                onClick={unsubscribe}
                                variant="outline"
                                isDisabled={!isW3iInitialized || !account}
                                colorScheme="red"
                                isLoading={isUnsubscribing}
                                loadingText="Unsubscribing..."
                                rounded="full"
                            >
                                Unsubscribe
                            </Button>
                        </Flex>
                    ) : (
                        <Tooltip
                            label={
                                !Boolean(address)
                                    ? "Connect your wallet first."
                                    : "Register your account."
                            }
                            hidden={Boolean(account)}
                        >
                            <Button
                                leftIcon={<FaBell />}
                                onClick={subscribe}
                                colorScheme="cyan"
                                rounded="full"
                                variant="outline"
                                w="fit-content"
                                alignSelf="center"
                                isLoading={isSubscribing}
                                loadingText="Subscribing..."
                                isDisabled={!Boolean(address) || !Boolean(account)}
                            >
                                Subscribe
                            </Button>
                        </Tooltip>
                    )}

                    {isSubscribed && (
                        <Accordion defaultIndex={[1]} allowToggle mt={10} rounded="xl">
                            <Subscription />
                            <Messages />
                            <Preferences />
                            <Subscribers />
                        </Accordion>
                    )}
                </Flex>
            </Flex>
            {/* flex container with 4 columns. 2 images one on top of the other in each column */}
            <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                position={"fixed"}
                bottom={0}
                left={400}
                mt={10}
                mb={10}
            >
                <Flex flexDirection="column" alignItems="center" gap={8}>
                    <Image
                        src="/static/polygon-symbol.webp"
                        alt="Ethereum logo"
                        width={160}
                        height={44}
                    />
                    <Image
                        src="/static/polygon-book.webp"
                        alt="WalletConnect logo"
                        width={150}
                        height={36}
                    />
                </Flex>
                <Flex flexDirection="column" alignItems="center" >
                    <Image
                        src="/static/polygon-symbol.webp"
                        alt="Ethereum logo"
                        width={160}
                        height={44}
                    />
                    <Image
                        src="/static/polygon-book.webp"
                        alt="WalletConnect logo"
                        width={150}
                        height={36}
                    />
                </Flex>
                <Flex flexDirection="column" alignItems="center">
                    <Image
                        src="/static/polygon-symbol.webp"
                        alt="Ethereum logo"
                        width={160}
                        height={44}
                    />
                    <Image
                        src="/static/polygon-book.webp"
                        alt="WalletConnect logo"
                        width={150}
                        height={36}
                    />
                </Flex>
                <Flex flexDirection="column" alignItems="center">
                    <Image
                        src="/static/polygon-symbol.webp"
                        alt="Ethereum logo"
                        width={160}
                        height={44}
                    />
                    <Image
                        src="/static/polygon-book.webp"
                        alt="WalletConnect logo"
                        width={150}
                        height={36}
                    />
                </Flex>
            </Flex>
        </>
    );
}

Notifs.PageLayout = Layout

export default Notifs