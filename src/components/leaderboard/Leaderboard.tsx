import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RandomAvatar } from "react-random-avatars";
import Tippy from "@tippyjs/react";

import { getLeaderboard, LeaderboardRow } from "../../utils/initiateGame";
import { formatLargeNumber, formatAddress } from "../../utils";
import { useWallet } from "@solana/wallet-adapter-react";
import "./Leaderboard.scss";

// Create a dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { wallet } = useWallet();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const data = await getLeaderboard();
      setIsLoading(false);
      setLeaderboardData(data);
    }
    init();
  }, []);

  const userAddress = wallet?.adapter.publicKey?.toBase58();
  const userPositionInBoard = leaderboardData.find((row) => row.address === userAddress);
  const userRank = leaderboardData.findIndex((row) => row.address === userAddress);

  return (
    <div className="leaderboard-container">
      <ThemeProvider theme={darkTheme}>
        {/* <h2 style={{textAlign: 'center'}}>Coming soon</h2> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Rank</TableCell>
              <TableCell align="left">User</TableCell>
              <TableCell align="center">Gems</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <h2 className="loading-text">Loading...</h2>
                </TableCell>
              </TableRow>
            )}
            {userPositionInBoard && userRank && userAddress ? (
              <TableRow>
                <TableCell style={{ borderColor: "#927f61" }} align="center">
                  {userRank}
                </TableCell>
                <TableCell style={{ borderColor: "#927f61" }}>
                  <div className="user-container">
                    <RandomAvatar name={userAddress + userRank + userPositionInBoard.balance} size={32} />
                    <span>{isMobile ? formatAddress(userAddress) : userAddress} (You)</span>
                  </div>
                </TableCell>
                <TableCell style={{ borderColor: "#927f61" }} align="center">
                  {userPositionInBoard.balance}
                </TableCell>
              </TableRow>
            ) : null}
            {leaderboardData.map((row, index) => (
              <TableRow key={row.address} className={userAddress === row.address ? "active" : ""}>
                <TableCell align="center">
                  <div className="rank-container">
                    {index + 1}
                    {(index === 0 || index === 1 || index === 2) && (
                      <img className="rank-image" src={`./icons/rank-${index + 1}.png`} alt="Rank" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="user-container">
                    <RandomAvatar name={row.address + index + row.balance} size={32} />
                    <span>
                      {isMobile ? formatAddress(row.address) : row.address} {userAddress === row.address && "(You)"}
                    </span>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <Tippy placement="bottom" content={<span style={{ fontSize: "1rem" }}>{row.balance}</span>}>
                    <span>{formatLargeNumber(Number(row.balance))}</span>
                  </Tippy>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ThemeProvider>
    </div>
  );
};

export default Leaderboard;
