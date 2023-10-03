import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a dark theme instance
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Leaderboard = () => {
  const leaderboardData = [
    {
      player: "JohnDoe",
      gems: 500,
      barbariansKilled: 23,
      victories: 10,
      losses: 2,
    },
    {
      player: "JaneSmith",
      gems: 450,
      barbariansKilled: 20,
      victories: 9,
      losses: 3,
    },
  ];
  return (
    <ThemeProvider theme={darkTheme}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell align="right">Gems earned</TableCell>
            <TableCell align="right">Barbarians killed</TableCell>
            <TableCell align="right">Victories</TableCell>
            <TableCell align="right">Losses</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboardData.map((row) => (
            <TableRow key={row.player}>
              <TableCell component="th" scope="row">
                {row.player}
              </TableCell>
              <TableCell align="right">{row.gems}</TableCell>
              <TableCell align="right">{row.barbariansKilled}</TableCell>
              <TableCell align="right">{row.victories}</TableCell>
              <TableCell align="right">{row.losses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ThemeProvider>
  );
};

export default Leaderboard;
