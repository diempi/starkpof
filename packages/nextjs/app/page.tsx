
"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { SpotifyTopArtist } from "./spotifyaccount/_components/SpotifyTopArtist";
import WalletConnection from "~~/components/WalletConnection";
import SpotifyConnection from "~~/components/SpotifyConnection";
import React, { useState } from "react";

const Home = () => {

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  const handleWalletConnected = () => setIsWalletConnected(true);
  const handleSpotifyConnected = () => setIsSpotifyConnected(true);


  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Starkpof </span>
        </h1>
        
      </div>

      <div className="bg-container flex-grow w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div>
            <WalletConnection onConnected={function (): void {
              throw new Error("Function not implemented.");
            } }/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
