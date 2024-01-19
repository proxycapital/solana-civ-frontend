import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RandomAvatar } from "react-random-avatars";
import Tippy from "@tippyjs/react";

import { formatLargeNumber } from "../../utils";
import "./Leaderboard.scss";

// Create a dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Leaderboard = () => {
  const userName = "JaneSmith4";
  const leaderboardData = [
    {
      avatar: "0x01",
      player: "JohnDoe",
      gems: 999999,
      rank: 1,
    },
    {
      avatar: "0x01",
      player: "JaneSmith1",
      gems: 999998,
      rank: 2,
    },
    {
      avatar: "0x01",
      player: "JaneSmith2",
      gems: 99997,
      rank: 3,
    },
    {
      avatar: "0x01",
      player: "JaneSmith3",
      gems: 500,
      rank: 4,
    },
    {
      avatar: "0x01",
      player: "JaneSmith4",
      gems: 123123,
      rank: 5,
    },
    {
      avatar: "0x01",
      player: "JaneSmith5",
      gems: 500,
      rank: 6,
    },
    {
      avatar: "0x01",
      player: "JaneSmith6",
      gems: 500,
      rank: 7,
    },
    {
      avatar: "0x01",
      player: "JaneSmith7",
      gems: 89123123,
      rank: 8,
    },
  ];
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
            {leaderboardData.map((row) => (
              <TableRow key={row.player} className={userName === row.player ? "active" : ""}>
                <TableCell align="center">
                  <div className="rank-container">
                    {row.rank}
                    {(row.rank === 1 || row.rank === 2 || row.rank === 3) && (
                      <img className="rank-image" src={`./icons/rank-${row.rank}.png`} alt="Rank" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="user-container">
                    <RandomAvatar name={row.player} size={32} />
                    <span>{row.player}</span>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <Tippy placement="bottom" content={<span style={{ fontSize: "1rem" }}>{row.gems}</span>}>
                    <span>{formatLargeNumber(row.gems)}</span>
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
