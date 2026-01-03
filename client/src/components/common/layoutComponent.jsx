import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "@/styles/mui/theme";
import { setTheme, toggleTheme } from "@/redux/slices/themeSlice";
import { logout } from "@/redux/slices/authSlice";
import { authAPI } from "@/services/api";
import Cookies from "js-cookie";
import { Button } from "@/components/common/uiComponents";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Link
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { GENRES } from "@/constants/genres";

function NavBar({ filters, onFilterChange }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useSelector((state) => state.theme.mode);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  const muiTheme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
      router.push("/");
    } catch (err) {
      dispatch(logout());
      router.push("/");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: muiTheme.palette.mode === "dark"
          ? "rgba(4, 10, 36, 0.85)"
          : "rgba(248, 250, 252, 0.95)",
        borderBottom: `1px solid ${muiTheme.palette.mode === "dark" 
          ? "rgba(56,189,248,0.2)" 
          : "rgba(56,189,248,0.3)"}`,
        backdropFilter: "blur(10px)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: "12px", py: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          onClick={() => router.push("/")}
          sx={{
            color: muiTheme.palette.secondary.main,
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              textShadow: "0 0 10px rgba(56, 189, 248, 0.8)",
            },
          }}
        >
          CyberArena
        </Typography>

        <Box sx={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <Typography
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            sx={{
              color: muiTheme.palette.text.primary,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                color: muiTheme.palette.secondary.main,
              },
            }}
          >
            Home
          </Typography>
          <Typography
            component="a"
            href="#featured-games"
            onClick={(e) => {
              e.preventDefault();
              if (router.pathname === "/") {
                const featuredSection = document.getElementById("featured-games");
                if (featuredSection) {
                  featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              } else {
                router.push("/#featured-games");
              }
            }}
            sx={{
              color: muiTheme.palette.text.primary,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                color: muiTheme.palette.secondary.main,
              },
            }}
          >
            Discover
          </Typography>
          <Typography
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.push("/about");
            }}
            sx={{
              color: muiTheme.palette.text.primary,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                color: muiTheme.palette.secondary.main,
              },
            }}
          >
            About
          </Typography>
          
          {filters && onFilterChange && (
            <>
              <TextField
                label="Search"
                value={filters.keyword || ""}
                onChange={(e) => onFilterChange("keyword", e.target.value)}
                size="small"
                sx={{ 
                  minWidth: "150px",
                  maxWidth: "200px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: muiTheme.palette.background.paper,
                  },
                }}
              />
              <FormControl size="small" sx={{ minWidth: "120px", maxWidth: "150px" }}>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={filters.genre || ""}
                  label="Genre"
                  onChange={(e) => onFilterChange("genre", e.target.value)}
                  sx={{
                    backgroundColor: muiTheme.palette.background.paper,
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {GENRES.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {mounted && (
            <IconButton
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle theme"
              sx={{
                color: muiTheme.palette.text.primary,
                "&:hover": {
                  transform: "scale(1.15)",
                  filter: "drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))",
                },
              }}
            >
              {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          )}

          {!isAuthenticated && (
            <>
              <Button 
                label="Login" 
                variant="secondary"
                onClick={() => router.push("/auth/login")}
              />
              <Button 
                label="Sign Up"
                onClick={() => router.push("/auth/signUp")}
              />
            </>
          )}

          {isAuthenticated && role === "user" && (
            <>
              <Button 
                label="Games" 
                variant="secondary"
                onClick={() => router.push("/")}
              />
              <Button 
                label="Profile"
                onClick={() => router.push("/user/profile")}
              />
              <Button 
                label="Logout"
                variant="secondary"
                onClick={handleLogout}
              />
            </>
          )}

          {isAuthenticated && role === "developer" && (
            <>
              <Button 
                label="Dashboard" 
                variant="secondary"
                onClick={() => router.push("/developer/dashboard")}
              />
              <Button 
                label="Upload Game"
                onClick={() => router.push("/developer/upload")}
              />
              <Button 
                label="Logout"
                variant="secondary"
                onClick={handleLogout}
              />
            </>
          )}

          {isAuthenticated && role === "admin" && (
            <>
              <Button 
                label="Admin Panel"
                onClick={() => router.push("/admin")}
              />
              <Button 
                label="Logout"
                variant="secondary"
                onClick={handleLogout}
              />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  const router = useRouter();
  const theme = useTheme();

  const fixedFooterRoutes = [
    "/dashboard",
    "/games",
    "/player",
    "/developer",
    "/admin",
  ];

  const isFixed = fixedFooterRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  return (
    <Box
      component="footer"
      sx={{
        position: isFixed ? "fixed" : "relative",
        bottom: isFixed ? 0 : "auto",
        width: "100%",
        padding: "20px 24px",
        background: theme.palette.mode === "dark"
          ? "rgba(4, 10, 36, 0.9)"
          : "rgba(248, 250, 252, 0.95)",
        borderTop: `1px solid ${theme.palette.mode === "dark"
          ? "rgba(56,189,248,0.25)"
          : "rgba(56,189,248,0.3)"}`,
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        zIndex: 50,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: "14px",
          color: theme.palette.text.secondary,
        }}
      >
        © {new Date().getFullYear()} CyberArena
      </Typography>

      <Box sx={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
        <Link
          href="/about"
          sx={{
            fontSize: "14px",
            color: theme.palette.secondary.main,
            textDecoration: "none",
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          About
        </Link>
        <Typography
          component="span"
          sx={{
            fontSize: "14px",
            color: theme.palette.text.secondary,
            marginX: "4px",
          }}
        >
          |
        </Typography>
        <Link
          href="/privacy"
          sx={{
            fontSize: "14px",
            color: theme.palette.secondary.main,
            textDecoration: "none",
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Privacy
        </Link>
        <Typography
          component="span"
          sx={{
            fontSize: "14px",
            color: theme.palette.text.secondary,
            marginX: "4px",
          }}
        >
          |
        </Typography>
        <Link
          href="/terms"
          sx={{
            fontSize: "14px",
            color: theme.palette.secondary.main,
            textDecoration: "none",
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Terms
        </Link>
        <Typography
          component="span"
          sx={{
            fontSize: "14px",
            color: theme.palette.text.secondary,
            marginX: "4px",
          }}
        >
          |
        </Typography>
        <Link
          href="/contact"
          sx={{
            fontSize: "14px",
            color: theme.palette.secondary.main,
            textDecoration: "none",
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          Contact
        </Link>
      </Box>

      <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Link
          href="#"
          aria-label="Facebook"
          sx={{
            color: theme.palette.secondary.main,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            "&:hover": {
              opacity: 0.8,
              transform: "scale(1.1)",
            },
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </Link>
        <Link
          href="#"
          aria-label="Twitter"
          sx={{
            color: theme.palette.secondary.main,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            "&:hover": {
              opacity: 0.8,
              transform: "scale(1.1)",
            },
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
          </svg>
        </Link>
        <Link
          href="#"
          aria-label="Instagram"
          sx={{
            color: theme.palette.secondary.main,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            "&:hover": {
              opacity: 0.8,
              transform: "scale(1.1)",
            },
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </Link>
        <Link
          href="#"
          aria-label="YouTube"
          sx={{
            color: theme.palette.secondary.main,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            "&:hover": {
              opacity: 0.8,
              transform: "scale(1.1)",
            },
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
          </svg>
        </Link>
      </Box>
    </Box>
  );
}

function PageWrapper({ children }) {
  const theme = useTheme();
  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {children}
    </Box>
  );
}

export default function Layout({ children, filters, onFilterChange }) {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize theme from cookie on client side
    if (typeof window !== "undefined") {
      const savedTheme = Cookies.get("theme");
      if (savedTheme) {
        dispatch(setTheme(savedTheme));
      } else {
        dispatch(setTheme("dark"));
      }
    }
  }, [dispatch]);

  // Use the mode from Redux, default to "dark" if not set
  const themeMode = mode || "dark";
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  // Prevent hydration mismatch - show default dark theme until mounted
  if (!mounted) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ minHeight: "100vh", background: darkTheme.palette.background.default }} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar filters={filters} onFilterChange={onFilterChange} />
      <PageWrapper>
        {children}
      </PageWrapper>
      <Footer />
    </ThemeProvider>
  );
}

