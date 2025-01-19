import { SpotifyTopArtist } from "./_components/SpotifyTopArtist";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-stark/getMetadata";

export const metadata = getMetadata({
  title: "Spotify Account",
  description:
    "Your Spotify account",
});

const SpotifyAccount: NextPage = () => {
  return (
    <div>

      <div className="bg-container flex-grow w-full mt-16 px-8 py-12">
        <SpotifyTopArtist />
      </div>
      
    </div>
  );
};

export default SpotifyAccount;
