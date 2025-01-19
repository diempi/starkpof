"use client";

import { useAccount, useConnect } from "@starknet-react/core";
import { ConnectedAddress } from "./ConnectedAddress";
import { CustomConnectButton } from "./scaffold-stark/CustomConnectButton";

export default function WalletConnection({ onConnected }: { onConnected: () => void }) {
  const { account } = useAccount();
  const { connect } = useConnect();

  const handleConnect = async () => {
    if (!account) {
      await connect(); // Trigger wallet connection
    }
    onConnected(); // Proceed once connected
  };

  return (
    <div>
      {account ? (
        <>
          
          <div>
            <h1 className="text-center text-2xl font-bold">Welcome to Starkpof</h1>
            <ConnectedAddress />
            <br />
            <br />
            <a href="/spotifyaccount">
              <button className="bg-[#8a45fc] text-[18px] px-4 py-2 text-white rounded-lg">
                Click here to get your Spotify data
              </button>
            </a>
          </div>
         
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
        <h1 className="text-center text-2xl font-bold">Please connect your wallet to get started</h1>
        <br />
        <br />
        <div className="mt-8">
          <CustomConnectButton />
        </div>
        </div>
      )}
    </div>
  );
}