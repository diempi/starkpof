"use client"; // This marks the component as a Client Component

import { useState, useEffect } from "react";

const clientId = "5ffd3dfea6f74a64911ef120b01c78f3"; 
const redirectUri = "http://localhost:3000/spotifyaccount"; 
const scopes = "user-read-private user-read-email user-top-read";

function generateCodeVerifier(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientId: string, code: string): Promise<string> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier!);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const { access_token } = await response.json();
  return access_token;
}

export  function SpotifyTopArtist() {
  const [profile, setProfile] = useState<any>(null);
  const [topArtist, setTopArtist] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      const verifier = generateCodeVerifier(128);
      generateCodeChallenge(verifier).then((challenge) => {
        localStorage.setItem("verifier", verifier);

        const authUrl = new URL("https://accounts.spotify.com/authorize");
        authUrl.searchParams.append("client_id", clientId);
        authUrl.searchParams.append("response_type", "code");
        authUrl.searchParams.append("redirect_uri", redirectUri);
        authUrl.searchParams.append("scope", scopes);
        authUrl.searchParams.append("code_challenge_method", "S256");
        authUrl.searchParams.append("code_challenge", challenge);

        window.location.href = authUrl.toString();
      });
    } else {
      getAccessToken(clientId, code).then((accessToken) => {
        // Fetch user profile
        fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => setProfile(data));

        // Fetch top artist
        fetch("https://api.spotify.com/v1/me/top/artists?limit=1", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => setTopArtist(data.items[0]));
      });
    }
  }, []);

  if (!profile || !topArtist) return <div>Loading...</div>;

  function handleMintNFT(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center text-2xl font-bold uppercase">Your Spotify profile infos</h1> 
      <section id="profile">
      <br />
        <h2 className="text-xl font-semibold text-center text-white">
          Welcome, <span id="displayName" className=" font-bold ">{profile.display_name}</span>! 👋
        </h2>
        <br />
        <br />
        {profile.images?.[0] && (
          <img
            id="avatar"
            src={profile.images[0].url}
            alt={`${profile.display_name}'s avatar`}
            width="200"
            height="200"
            className="rounded-full"
          />
        )}
        <br />

        <ul><br />
          <li className="text-lg text-center text-white mt-4">
            <span id="artist-name" className="font-bold text-xl text-white">Your Top Artist is {topArtist.name}</span>
          </li>
          <br />
          <br />
          <li className="flex justify-center items-center">
            <img
              id="artist-image"
              src={topArtist.images?.[0]?.url}
              alt={`${topArtist.name}'s image`}
              width="200"
              height="200"
              className="rounded-full"
            />
          </li>
        </ul>
      </section>
      <br />
      <br />

        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mt-8">
          <button className="btn btn-primary" id="mint-nft" onClick={handleMintNFT}>
              <div>Mint your Top Fan NFT</div>
          </button>

        </div>
      
    </div>
  );
}
