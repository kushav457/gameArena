import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";

import DeveloperLayout from "@/components/common/DeveloperLayout";
import { Card } from "@/components/common/uiComponents";

const DUMMY_GAMES = [
  { title: "Neon Runner", plays: 1240, earnings: 312.5, ratings: 4.6 },
  { title: "Cyber Drift", plays: 860, earnings: 215.0, ratings: 4.2 },
  { title: "Arcade Pulse", plays: 540, earnings: 135.0, ratings: 4.0 },
];

export default function DeveloperDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <Head>
        <title>Developer Dashboard | CyberArena</title>
      </Head>
      <DeveloperLayout>
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: { xs: 3, md: 5 },
            px: { xs: 2, md: 3 }
          }}
        >
          <Typography
            variant="h4"
            className="gaming-title"
            sx={{
              fontFamily: "'Jersey 10', sans-serif",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "2px",
              mb: { xs: 3, md: 5 },
              color: isDark ? "#e2e8f0" : theme.palette.text.primary,
            }}
          >
            Welcome back to Cyber Arena
          </Typography>

          <Grid container spacing={3} sx={{ mb: { xs: 3, md: 4 } }}>
            <Grid item xs={12} sm={6}>
              <Card>
                <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDark ? "#cbd5e1" : theme.palette.text.secondary, 
                      mb: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Total Plays
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "'Jersey 10', sans-serif",
                      fontWeight: 400,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    2,640
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDark ? "#cbd5e1" : theme.palette.text.secondary, 
                      mb: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Followers
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: "'Jersey 10', sans-serif",
                      fontWeight: 400,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    418
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <Box sx={{ p: { xs: 2, md: 0 } }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          color: isDark ? "#e2e8f0" : theme.palette.text.primary,
                          fontSize: { xs: "0.875rem", md: "1rem" },
                          py: { xs: 1.5, md: 2 },
                        }}
                      >
                        Title
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          color: isDark ? "#e2e8f0" : theme.palette.text.primary,
                          fontSize: { xs: "0.875rem", md: "1rem" },
                          py: { xs: 1.5, md: 2 },
                        }}
                      >
                        Plays
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          color: isDark ? "#e2e8f0" : theme.palette.text.primary,
                          fontSize: { xs: "0.875rem", md: "1rem" },
                          py: { xs: 1.5, md: 2 },
                        }}
                      >
                        Earnings
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          color: isDark ? "#e2e8f0" : theme.palette.text.primary,
                          fontSize: { xs: "0.875rem", md: "1rem" },
                          py: { xs: 1.5, md: 2 },
                        }}
                      >
                        Ratings
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DUMMY_GAMES.map((g) => (
                      <TableRow 
                        key={g.title} 
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(56, 189, 248, 0.04)",
                          }
                        }}
                      >
                        <TableCell 
                          sx={{ 
                            color: isDark ? "#e2e8f0" : theme.palette.text.primary,
                            fontSize: { xs: "0.875rem", md: "1rem" },
                            py: { xs: 1.5, md: 2 },
                          }}
                        >
                          {g.title}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: isDark ? "#cbd5e1" : theme.palette.text.secondary,
                            fontSize: { xs: "0.875rem", md: "1rem" },
                            py: { xs: 1.5, md: 2 },
                          }}
                        >
                          {g.plays.toLocaleString()}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: isDark ? "#cbd5e1" : theme.palette.text.secondary,
                            fontSize: { xs: "0.875rem", md: "1rem" },
                            py: { xs: 1.5, md: 2 },
                          }}
                        >
                          ${g.earnings.toFixed(2)}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: isDark ? "#cbd5e1" : theme.palette.text.secondary,
                            fontSize: { xs: "0.875rem", md: "1rem" },
                            py: { xs: 1.5, md: 2 },
                          }}
                        >
                          {g.ratings.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
        </Container>
      </DeveloperLayout>
    </>
  );
}

