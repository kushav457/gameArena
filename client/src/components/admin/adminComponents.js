import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Box, 
  Typography, 
  List, 
  ListItem,
  ListItemButton,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Button } from "@/components/common/ui/uiComponents";
import { CyberCard, CyberTextField } from "@/styles/mui/customComponents";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export function AdminGameTable({ games, onApprove, onReject, searchQuery, onSearchChange }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box>
      {onSearchChange && (
        <Box sx={{ mb: 3 }}>
          <CyberTextField
            fullWidth
            placeholder="Search games by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: isDark ? "rgba(34, 48, 80, 0.5)" : "rgba(255, 255, 255, 0.5)",
              },
            }}
          />
        </Box>
      )}
      
      <TableContainer 
        component={CyberCard}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${isDark ? "rgba(56, 189, 248, 0.25)" : "rgba(56, 189, 248, 0.4)"}`,
          boxShadow: isDark 
            ? "0 0 14px rgba(56, 189, 248, 0.15)" 
            : "0 0 8px rgba(56, 189, 248, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: isDark ? "rgba(34, 48, 80, 0.5)" : "rgba(248, 250, 252, 0.5)" }}>
              <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Game Title</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Developer</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Genre</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games?.map((game) => (
              <TableRow 
                key={game._id}
                sx={{
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(56, 189, 248, 0.1)" : "rgba(56, 189, 248, 0.05)",
                  },
                }}
              >
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {game.title}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", color: theme.palette.text.secondary }}>
                  {game.desc || "No description"}
                </TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  {game.createdBy?.name || "Unknown"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={game.genre || "N/A"}
                    size="small"
                    sx={{ 
                      textTransform: "capitalize",
                      backgroundColor: isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(56, 189, 248, 0.1)",
                      color: theme.palette.secondary.main,
                      border: `1px solid ${theme.palette.secondary.main}40`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={game.status || "pending"}
                    size="small"
                    sx={{ 
                      textTransform: "capitalize",
                      backgroundColor: game.status === "approved" 
                        ? "rgba(34, 197, 94, 0.2)" 
                        : "rgba(239, 68, 68, 0.2)",
                      color: game.status === "approved" ? "#22c55e" : "#ef4444",
                      border: `1px solid ${game.status === "approved" ? "#22c55e40" : "#ef444440"}`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <ApprovalActions
                    onApprove={() => onApprove(game._id)}
                    onReject={() => onReject(game._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export function AdminSidebar({ currentPath }) {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  const menuItems = [
    { label: "Games", path: "/admin/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Reports", path: "/admin/reports" },
  ];

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: "100%", md: "240px" },
        padding: "24px",
        borderRight: `1px solid ${isDark ? "rgba(56, 189, 248, 0.25)" : "rgba(56, 189, 248, 0.4)"}`,
        backgroundColor: theme.palette.background.paper,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <AdminPanelSettingsIcon sx={{ color: theme.palette.secondary.main, fontSize: "32px" }} />
        <Typography 
          variant="h5" 
          className="gaming-title"
          sx={{ 
            fontFamily: "'Jersey 10', sans-serif",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: theme.palette.text.primary,
          }}
        >
          Admin Panel
        </Typography>
      </Box>
      
      <List sx={{ padding: 0 }}>
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: "8px",
                  padding: "12px 16px",
                  backgroundColor: isActive 
                    ? (isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(56, 189, 248, 0.1)")
                    : "transparent",
                  border: isActive 
                    ? `1px solid ${theme.palette.secondary.main}60`
                    : "1px solid transparent",
                  color: isActive ? theme.palette.secondary.main : theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(56, 189, 248, 0.08)",
                    border: `1px solid ${theme.palette.secondary.main}40`,
                  },
                  transition: "all 0.25s ease",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: isActive ? 600 : 400 }}>
                  {item.label}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export function StatCard({ title, value, icon: Icon }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <CyberCard
      sx={{
        padding: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          color: theme.palette.secondary.main,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: isDark ? "drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))" : "none",
        }}
      >
        <Icon sx={{ fontSize: "48px" }} />
      </Box>
      <Typography
        variant="h4"
        className="gaming-title"
        sx={{
          fontFamily: "'Jersey 10', sans-serif",
          fontWeight: 400,
          color: theme.palette.text.primary,
          marginBottom: "8px",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "0.85rem",
        }}
      >
        {title}
      </Typography>
    </CyberCard>
  );
}

function ApprovalActions({ onApprove, onReject }) {
  return (
    <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Button 
        label="Approve" 
        onClick={onApprove}
        variant="primary"
        sx={{ minWidth: "80px" }}
      />
      <Button
        label="Reject"
        variant="secondary"
        onClick={onReject}
        sx={{ 
          minWidth: "80px",
          borderColor: "#ef4444",
          color: "#ef4444",
          "&:hover": {
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderColor: "#ef4444",
          },
        }}
      />
    </Box>
  );
}
