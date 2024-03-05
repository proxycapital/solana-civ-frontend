import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

import { Solciv } from "../context/idl";
import { weightedRandomTile } from "../components/Terrain";
import { getRandomCoordinates, calculateDistance, isInSea } from "./index";
import resetResearchStorage from "./storage";

const { REACT_APP_RPC: RPC } = process.env;

const connection = new Connection(RPC || clusterApiUrl("devnet"), "confirmed");

export const getMap = async (provider: AnchorProvider | undefined, program: Program<Solciv> | undefined) => {
  if (!provider || !program) {
    return null;
  }
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  let gameAccount;
  try {
    // @ts-ignore
    gameAccount = await program.account.game.fetch(gameKey);
  } catch (error) {
    console.log("Error while fetching game account: ", error);
  }
  return gameAccount ? gameAccount.map : null;
};

export const getGame = async (provider: AnchorProvider | undefined, program: Program<Solciv> | undefined) => {
  if (!provider || !program) {
    return null;
  }
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  try {
    // @ts-ignore
    const gameAccount = await program.account.game.fetch(gameKey);
    return gameAccount;
  } catch (error) {
    console.log("Error while fetching game account: ", error);
  }
  return null;
};

export const getPlayer = async (provider: AnchorProvider | undefined, program: Program<Solciv> | undefined) => {
  if (!provider || !program) {
    return null;
  }
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  let playerAccount;
  try {
    // @ts-ignore
    playerAccount = await program.account.player.fetch(playerKey);
  } catch (error) {
    console.log("Error while fetching player account: ", error);
    if (String(error).includes("Account does not exist or has no data")) {
      return null;
    }
  }
  const balances = playerAccount?.resources ?? {};
  const units = playerAccount?.units ?? [];
  const cities = playerAccount?.cities ?? [];
  const tiles = playerAccount?.tiles ?? [];

  const technologies = {
    currentResearch: playerAccount?.currentResearch ?? null,
    researchAccumulatedPoints: playerAccount?.researchAccumulatedPoints ?? 0,
    researchedTechnologies: playerAccount?.researchedTechnologies ?? [],
  };

  // calculate "science" yield from all cities
  balances.science = cities.reduce((acc: number, city: { scienceYield: number }) => {
    return acc + city.scienceYield;
  }, 0);

  try {
    const balance = await connection.getBalance(provider.publicKey);
    balances.sol = balance ? Number(balance) / 1e9 : 0;
  } catch (error) {
    console.error("Failed to fetch balance", error);
  }
  return { balances, units, cities, tiles, technologies };
};

export const getNpcs = async (provider: AnchorProvider | undefined, program: Program<Solciv> | undefined) => {
  if (!provider || !program) {
    return null;
  }
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [npcKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("NPC"), gameKey.toBuffer()],
    program.programId,
  );

  let npcAccount;
  try {
    // @ts-ignore
    npcAccount = await program.account.npc.fetch(npcKey);
  } catch (error) {
    console.log("Error while fetching npc account: ", error);
  }
  const units = npcAccount ? npcAccount.units : [];
  const cities = npcAccount ? npcAccount.cities : [];

  return { units, cities };
};

export const initializeGame = async (provider: AnchorProvider, program: Program<Solciv>, level: number) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );
  console.log("Game account address", gameKey.toString());

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );
  console.log("Player account address", playerKey.toString());

  const [npcKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("NPC"), gameKey.toBuffer()],
    program.programId,
  );
  console.log("NPC account address", npcKey.toString());

  let gameAccount;
  
  const randomMap = Array.from({ length: 400 }, () => weightedRandomTile());
  // first and second rows will be filled with sea
  const randomMapWithSea = randomMap.map((item, index) => index < 40 ? 17 : item);

  try {
    // @ts-ignore
    gameAccount = await program.account.game.fetch(gameKey);
  } catch (error) {
    console.log("Error while fetching game account: ", error);
  }
  if (gameAccount && gameAccount.player.toBase58() === provider.publicKey.toBase58()) {
    console.log("Existing game account", gameAccount);
  } else {
    resetResearchStorage();

    const accounts = {
      game: gameKey,
      player: provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };
    const tx = await program.methods.initializeGame(randomMapWithSea, level).accounts(accounts).rpc();
    console.log("Transaction signature", tx);
    // wait for transaction to be confirmed
    await connection.confirmTransaction(tx);
    // @ts-ignore
    const account = await program.account.game.fetch(gameKey);
    console.log("Created game account", account);
  }

  let position;

  do {
    // Generate random player location not in sea
    position = getRandomCoordinates();
  } while (!isInSea(position, randomMapWithSea));

  let playerAccount;
  try {
    // @ts-ignore
    playerAccount = await program.account.player.fetch(playerKey);
  } catch (error) {
    console.log("Error while fetching player account: ", error);
  }
  if (playerAccount && playerAccount.player.toBase58() === provider.publicKey.toBase58()) {
    console.log("Existing player account", playerAccount);
  } else {
    const accounts = {
      game: gameKey,
      playerAccount: playerKey,
      player: provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };
    const tx = await program.methods.initializePlayer(position).accounts(accounts).rpc();
    console.log("Transaction signature", tx);

    // wait for transaction to be confirmed
    await connection.confirmTransaction(tx);

    // @ts-ignore
    const account = await program.account.player.fetch(playerKey);
    console.log("Created player account", account);
  }
  let npcAccount;
  try {
    // @ts-ignore
    npcAccount = await program.account.npc.fetch(npcKey);
  } catch (error) {
    console.log("Error while fetching npc account: ", error);
  }
  if (npcAccount) {
    console.log("Existing npc account", npcAccount);
  } else {
    // Generate random NPC locations with distance check and not in sea
    let npcPosition1, npcPosition2;
    do {
      npcPosition1 = getRandomCoordinates();
    } while (calculateDistance(position, npcPosition1) < 10 && !isInSea(npcPosition1, randomMapWithSea));

    do {
      npcPosition2 = getRandomCoordinates();
    } while ((calculateDistance(position, npcPosition2) < 10 || calculateDistance(npcPosition1, npcPosition2) < 10) && !isInSea(npcPosition2, randomMapWithSea));
    
    const accounts = {
      game: gameKey,
      npcAccount: npcKey,
      player: provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };
    const tx = await program.methods.initializeNpc(npcPosition1, npcPosition2).accounts(accounts).rpc();
    console.log("Transaction signature", tx);

    // wait for transaction to be confirmed
    await connection.confirmTransaction(tx);

    // @ts-ignore
    const account = await program.account.npc.fetch(npcKey);
    console.log("Created npc account", account);
  }
};

export const addToProductionQueue = async (
  provider: AnchorProvider,
  program: Program<Solciv>,
  cityId: number,
  item: any,
) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  const accounts = {
    game: gameKey,
    player: provider.publicKey,
    playerAccount: playerKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  return program.methods.addToProductionQueue(cityId, item).accounts(accounts).rpc();
};

export const removeFromProductionQueue = async (
  provider: AnchorProvider,
  program: Program<Solciv>,
  cityId: number,
  itemIndex: number,
) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  const accounts = {
    game: gameKey,
    player: provider.publicKey,
    playerAccount: playerKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  return program.methods.removeFromProductionQueue(cityId, itemIndex).accounts(accounts).rpc();
};

export const repairWall = async (provider: AnchorProvider, program: Program<Solciv>, cityId: number) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  const accounts = {
    game: gameKey,
    player: provider.publicKey,
    playerAccount: playerKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  return program.methods.repairWall(cityId).accounts(accounts).rpc();
};

export const purchaseWithGold = async (
  provider: AnchorProvider,
  program: Program<Solciv>,
  cityId: number,
  item: any,
) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  const accounts = {
    game: gameKey,
    player: provider.publicKey,
    playerAccount: playerKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  return program.methods.purchaseWithGold(cityId, item).accounts(accounts).rpc();
};

export const foundCity = async (provider: AnchorProvider, program: Program<Solciv>, data: any) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  const accounts = {
    game: gameKey,
    player: provider.publicKey,
    playerAccount: playerKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  return program.methods
    .foundCity(data.x, data.y, data.unitId, data.name)
    .accounts(accounts)
    .rpc({ skipPreflight: true });
};

export const upgradeLandPlot = async (provider: AnchorProvider, program: Program<Solciv>, unit: any) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  const accounts = {
    game: gameKey,
    player: provider.publicKey,
    playerAccount: playerKey,
  };
  return program.methods.upgradeTile(unit.x, unit.y, unit.unitId).accounts(accounts).rpc();
};

// export const healUnit = async (provider: AnchorProvider, program: Program<Solciv>, unitId: number) => {
//   const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("GAME"), provider.publicKey.toBuffer()],
//     program.programId
//   );

//   const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
//     program.programId
//   );

//   const accounts = {
//     player: provider.publicKey,
//     playerAccount: playerKey,
//   };
//   return program.methods.healUnit(unitId).accounts(accounts).rpc();
// };

export const upgradeUnit = async (provider: AnchorProvider, program: Program<Solciv>, unitId: number) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );

  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );

  const accounts = {
    player: provider.publicKey,
    playerAccount: playerKey,
  };
  return program.methods.upgradeUnit(unitId).accounts(accounts).rpc();
};

export const withdrawGems = async (provider: AnchorProvider, program: Program<Solciv>, owner: PublicKey) => {
  const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), provider.publicKey.toBuffer()],
    program.programId,
  );
  const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("PLAYER"), gameKey.toBuffer(), provider.publicKey.toBuffer()],
    program.programId,
  );
  const MINT_SEED = "mint";
  const [mint] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from(MINT_SEED)], program.programId);
  const destination = await anchor.utils.token.associatedAddress({
    mint: mint,
    owner,
  });

  const accounts = {
    mint,
    owner,
    destination,
    playerAccount: playerKey,
    player: provider.publicKey,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    systemProgram: anchor.web3.SystemProgram.programId,
    tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
  };

  return await program.methods.mintGems().accounts(accounts).rpc();
};

export const handleEndGame = async (provider: AnchorProvider, program: Program<Solciv>, redirectUrl?: string) => {
  try {
    const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("GAME"), provider!.publicKey.toBuffer()],
      program!.programId,
    );
    const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("PLAYER"), gameKey.toBuffer(), provider!.publicKey.toBuffer()],
      program!.programId,
    );
    const [npcKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("NPC"), gameKey.toBuffer()],
      program!.programId,
    );
    const accounts = {
      game: gameKey,
      playerAccount: playerKey,
      npcAccount: npcKey,
      player: provider!.publicKey,
    };
    await program!.methods.closeGame().accounts(accounts).rpc();
  } catch (error) {
    console.error("Failed to close game", error);
    alert(error);
    return;
  }
  // redirect to reset the context & local state
  if (!redirectUrl) return;
  window.location.href = redirectUrl;
};
