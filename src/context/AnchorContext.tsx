import { createContext, useContext } from "react"
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@coral-xyz/anchor"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, PublicKey, Keypair, clusterApiUrl } from "@solana/web3.js"
import bs58 from "bs58";

import { Solciv, IDL } from "./idl"

const WorkspaceContext = createContext({})

const { REACT_APP_RPC: RPC } = process.env;
const programId = new PublicKey(IDL.metadata.address)

const burnerWallet = localStorage.getItem("burnerWallet");
const wallet = burnerWallet ? Keypair.fromSecretKey(bs58.decode(burnerWallet)) : Keypair.generate();
localStorage.setItem("burnerWallet", bs58.encode(wallet.secretKey));

const MockWallet = new NodeWallet(wallet);

interface WorkSpace {
  connection?: Connection
  provider?: AnchorProvider
  program?: Program<Solciv>
}

const WorkspaceProvider = ({ children }: any) => {
  const connection = new Connection(RPC || clusterApiUrl("devnet"), "confirmed");
  const provider = new AnchorProvider(connection, MockWallet, {})

  setProvider(provider)
  const program = new Program(IDL as Idl, programId)
  const workspace = {
    connection,
    provider,
    program,
  }

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  )
}

const useWorkspace = (): WorkSpace => {
  return useContext(WorkspaceContext)
}

export { WorkspaceProvider, useWorkspace }