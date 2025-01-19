"use client";

import { useState } from "react";


export default function NFTMinting({ profile, topArtist }: { profile: any; topArtist: any }) {
  const { account, contract } = useStarknet();
  const [isMinted, setIsMinted] = useState(false);
  const [nftUri, setNftUri] = useState<string | null>(null);

  const handleMint = async () => {
    if (!isMinted) {
      const dataToMint = {
        userName: profile.display_name,
        artistName: topArtist.name,
        artistImage: topArtist.images[0]?.url,
      };

      const tx = await contract.invoke("mint", [account, JSON.stringify(dataToMint)]);
      await tx.wait();
      setNftUri(topArtist.images[0]?.url); // Use the artist's image as NFT preview
      setIsMinted(true);
    }
  };

  return (
    <div>
      {isMinted ? (
        <div>
          <p>NFT is already minted!</p>
          {nftUri && <img src={nftUri} alt="Minted NFT" width="200" />}
        </div>
      ) : (
        <div>
          <p>Mint an NFT using Spotify data:</p>
          <button onClick={handleMint}>Mint NFT</button>
        </div>
      )}
    </div>
  );
}

function useStarknet(): { account: any; contract: any; } {
    throw new Error("Function not implemented.");
}
