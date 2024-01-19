import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
const { REACT_APP_API_URL } = process.env;

async function requestSolanaAirdrop(connection: Connection, address: PublicKey) {
  const airdropSignature = await connection.requestAirdrop(address, 1 * LAMPORTS_PER_SOL);
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

async function registerPlayerAddress(address: string): Promise<boolean> {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.success;
    } else {
      throw new Error("Failed to register player address.");
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

async function requestBackendAirdrop(address: string): Promise<boolean> {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/airdrop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.success;
    } else {
      throw new Error("Failed to request airdrop from backend.");
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

// @todo: move to api later
export interface LeaderboardRow {
  address: string,
  balance: string,
}

async function getLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/leaderboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.topPlayers;
    } else {
      throw new Error("Failed to get leaderboard from backend.");
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export {
  registerPlayerAddress,
  requestSolanaAirdrop,
  requestBackendAirdrop,
  getLeaderboard,
}