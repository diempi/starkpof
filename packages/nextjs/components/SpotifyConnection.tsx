"use client"; // Marks this component as a Client Component

import { useState, useEffect } from "react";

// Spotify client details
const clientId = "5ffd3dfea6f74a64911ef120b01c78f3";
const redirectUri = "http://localhost:3000/callback";
const scopes = "user-read-private user-read-email user-top-read";

// Helper function to generate a code verifier
function generateCodeVerifier(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Helper function to generate a code challenge
async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Function to exchange authorization code for an access token
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

// Main Spotify Connection Component
export default function SpotifyConnection({ onSpotifyData }: { onSpotifyData: (profile: any, topArtist: any) => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [topArtist, setTopArtist] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onConnected, setOnConnected] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      // Start the Spotify authorization process
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
      // Fetch access token and Spotify data
      getAccessToken(clientId, code).then((accessToken) => {
        // Fetch user profile
        fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setProfile(data);
            onSpotifyData(data, null); // Notify parent with profile data
          });

        // Fetch top artist
        fetch("https://api.spotify.com/v1/me/top/artists?limit=1", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setTopArtist(data.items[0]);
            onSpotifyData(profile, data.items[0]); // Notify parent with artist data
          });
      }).finally(() => {
        setIsConnected(true);
      });
    }
  }, [onSpotifyData, profile]);

  if (!profile || !topArtist) {
    return <button onClick={() => window.location.reload()}>Connect to Spotify</button>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Your Spotify profile data</h1> <br /><br />
      <section id="profile">
        <h2>
          Hello <span id="displayName">{profile.display_name}</span> <br />
        </h2>
        {profile.images?.[0] && (
          <img
            id="avatar"
            src={profile.images[0].url}
            alt={`${profile.display_name}'s avatar`}
            width="200"
            height="200"
          />
        )}
        <ul>
          <li> <br />
            Top Artist: <span id="artist-name">{topArtist.name}</span>
          </li>
          <li><br />
            <img
              id="artist-image"
              src={topArtist.images?.[0]?.url}
              alt={`${topArtist.name}'s image`}
              width="200"
              height="200"
            />
          </li>
        </ul>
      </section>
    </div>
  );
}