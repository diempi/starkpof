import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { SpotifyTopArtist } from "./spotifyaccount/_components/SpotifyTopArtist";

const Home = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-2xl mb-2">Welcome to</span>
          <span className="block text-4xl font-bold">Starkpof </span>
        </h1>
        <ConnectedAddress />
      </div>

      <div className="bg-container flex-grow w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 relative text-[12px] px-10 py-10 text-center items-center max-w-xs rounded-3xl border border-gradient">
            <div className="trapeze"></div>
            <Image
              src="/debug-icon.svg"
              alt="icon"
              width={26}
              height={30}
            ></Image>
            <p>
             
              <Link href="/spotifyaccount" passHref className="link">
                Get your Spotify infos
              </Link>{" "}
             
            </p>
          </div>

      

        <div>
          <button className="btn btn-primary" id="mint-nft">
           Mint your NFT
          </button>

        </div>


        </div>
      </div>
    </div>
  );
};

export default Home;
