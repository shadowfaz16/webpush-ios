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

import { AnimatePresence, motion } from "framer-motion";


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

    useEffect(() => {
        userAddress.address ? localStorage.setItem("magicbell:userId", `eip155:1:${userAddress.address}`) : null;
    }, []);

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
                    await handleNotification(blockNumber.toString());
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

    const balanceEth = useBalance({
        address,
        chainId: 1,

    })
    const balanceMatic = useBalance({
        address,
        chainId: 137,

    })
    const balanceArbitrum = useBalance({
        address,
        chainId: 42161,

    })
    const balanceSepolia = useBalance({
        address,
        chainId: 11155111,
    })
    const balanceScroll = useBalance({
        address,
        chainId: 534351,
    })

    console.log("user balance: ", balanceEth.data?.formatted + "ETH")
    console.log("user balance: ", balanceMatic.data?.formatted + "MATIC")
    console.log("user balance: ", balanceArbitrum.data?.formatted + "ARB")
    console.log("user balance: ", balanceSepolia.data?.formatted + "SEPOLIA")
    console.log("user balance: ", balanceScroll.data?.formatted + "SCROLL")


    // Define your balances
    const [prevBalances, setPrevBalances] = useState({
        eth: balanceEth.data?.formatted,
        matic: balanceMatic.data?.formatted,
        arbitrum: balanceArbitrum.data?.formatted,
        sepolia: balanceSepolia.data?.formatted,
        scroll: balanceScroll.data?.formatted,
    });

    // Monitor balance changes
    useEffect(() => {
        const newBalances = {
            eth: balanceEth.data?.formatted,
            matic: balanceMatic.data?.formatted,
            arbitrum: balanceArbitrum.data?.formatted,
            sepolia: balanceSepolia.data?.formatted,
            scroll: balanceScroll.data?.formatted,
        };

        // Compare new balances with previous balances
        if (JSON.stringify(prevBalances) !== JSON.stringify(newBalances)) {
            // Trigger notification if balances have changed
            sendNotification({
                accounts: [account as string],
                notification: {
                    title: "Balance Update",
                    body: "Your balance has changed.",
                    icon: `${window.location.origin}/icon-512x512.png`,
                    url: window.location.origin,
                    type: "promotional",
                },
            });
            // Update previous balances
            setPrevBalances(newBalances);
        }
    }, [balanceEth, balanceMatic, balanceArbitrum, balanceSepolia, balanceScroll, account, prevBalances]);

    const floatAnimation = {
        animate: {
            y: ["-5%", "5%"],
            transition: {
                y: {
                    duration: 1.5,
                    yoyo: Infinity,
                    ease: "easeInOut"
                }
            }
        }
    };

    const handleSubscribe = () => {
        // subscribe and send a welcome notification from magibell
        subscribe();
        magicBell.sendNotification("welcome");
    }

    return (
        <>
            <Flex w="full" flexDirection={"column"} maxW="700px" mt={4}>
                <Heading alignSelf={"center"} textAlign={"center"} mb={6} fontSize={20}>
                    Blockchain notifications
                </Heading>
                {/* fix flex with iamage */}
                <Flex flexDirection="column" alignItems={"center"} padding={4} position='absolute' top={75} left={200}>
                    <Image src="/wallethublogo.webp" width={150} height={150} alt="logo" />
                    <Image src="/wallethubtext.webp" width={200} height={150} alt="logo" />
                </Flex>
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
            <Flex className="absolute right-96 bottom-56 hover:cursor-pointer hover:scale-105 transition-all ease-out">
                <Tooltip
                    label={
                        !Boolean(address)
                            ? "Connect your wallet first."
                            : "Register your account."
                    }
                    hidden={Boolean(account)}
                >
                    <Image src="/static/notifications.webp" width={200} height={150} alt="logo"
                        onClick={handleSubscribe}
                    />
                </Tooltip>
            </Flex>
            <AnimatePresence mode="wait">
                <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    position={"fixed"}
                    bottom={0}
                    left={300}
                    mt={10}
                    mb={10}
                >
                    <Flex flexDirection="column" alignItems="center" gap={4}>
                        <motion.img
                            {...floatAnimation}
                            src="/static/polygon-logo.webp"
                            alt="Ethereum logo"
                            width={160}
                            height={44}
                            className="-ml-8"
                        />
                        <Image
                            src="/static/matic-book.webp"
                            alt="WalletConnect logo"
                            width={150}
                            height={36}
                        />
                    </Flex>
                    <Flex flexDirection="column" alignItems="center" gap={4} mt={-14}>
                        <motion.img
                            {...floatAnimation}
                            src="/static/arb-symbol.webp"
                            alt="Ethereum logo"
                            width={120}
                            height={44}
                            className="-ml-8"
                        />
                        <Image
                            src="/static/arb-book.webp"
                            alt="WalletConnect logo"
                            width={150}
                            height={36}
                        />
                    </Flex>

                    <Flex flexDirection="column" alignItems="center" gap={4} mt={-28}>
                        <motion.img
                            {...floatAnimation}
                            src="/static/eth-symbol.webp"
                            alt="Ethereum logo"
                            width={80}
                            height={44}
                            className="-ml-8"
                        />
                        <Image
                            src="/static/eth-book.webp"
                            alt="WalletConnect logo"
                            width={130}
                            height={36}
                        />
                    </Flex>
                    <Flex flexDirection="column" alignItems="center" gap={4} mt={-40}>
                        <motion.img
                            {...floatAnimation}
                            src="/static/scroll-symbol.webp"
                            alt="Ethereum logo"
                            width={100}
                            height={44}
                            className="-ml-8"
                        />
                        <Image
                            src="/static/scroll-book.webp"
                            alt="WalletConnect logo"
                            width={150}
                            height={36}
                        />
                    </Flex>
                </Flex>
            </AnimatePresence>
        </>
    );
}

Notifs.PageLayout = Layout

export default Notifs