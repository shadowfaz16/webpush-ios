import { useManageSubscription, useSubscription, useW3iAccount, useInitWeb3InboxClient, useMessages } from "@web3inbox/widget-react";
import { useCallback, useEffect } from "react";
import { useSignMessage, useAccount } from 'wagmi'


const ExampleComponent = () => {
    const isReady = useInitWeb3InboxClient({ projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string })

    const {
        account,
        register: registerIdentity,
        identityKey,
    } = useW3iAccount();

    // Getting the account -- Use register before attempting to subscribe
    const { setAccount, register } = useW3iAccount()

    const { signMessageAsync } = useSignMessage();

    // Checking if subscribed
    const { subscribe, isSubscribed } = useManageSubscription()

    // Get the subscription
    const { subscription } = useSubscription()

    const { messages } = useMessages()

    useEffect(() => {
        if (!Boolean(account)) return;
        setAccount(`eip155:1:${account}`);
    }, [account, setAccount]);

    const handleRegistration = useCallback(async () => {
        if (!account) return;
        try {
            const signMessage = (m: string) => signMessageAsync({ message: m });
            await registerIdentity(signMessage);
        } catch (registerIdentityError) {
            console.error({ registerIdentityError });
        }
    }, [signMessageAsync, registerIdentity, account]);
    useEffect(() => {
        if (!identityKey) {
            handleRegistration();
        }
    }, [handleRegistration, identityKey]);

    return (
        <div className="flex flex-col">
            <span>Client is {isReady ? "Ready" : "Not Ready"}</span>
            <span>You are {isSubscribed ? "Subscribed" : "Not Subscribed"}</span>
            <button onClick={subscribe}> Subscribe to current dapp </button>
            <div> All your messages in JSON: {JSON.stringify(messages)}</div>
        </div>
    );
}

export default ExampleComponent;