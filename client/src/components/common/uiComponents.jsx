import { CyberButtonPrimary, CyberButtonSecondary, CyberCard, CyberTextField } from "@/styles/mui/customComponents";
import { Button as MuiButton, Card as MuiCard, CircularProgress, Box, Backdrop, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function Button({
  label,
  onClick,
  type = "button",
  variant = "primary",
  icon: Icon,
  iconPosition = "left",
  iconOnly = false,
  disabled = false,
  sx,
  ...otherProps
}) {
  const ButtonComponent = variant === "primary" 
    ? CyberButtonPrimary 
    : variant === "secondary" 
    ? CyberButtonSecondary 
    : MuiButton;

  const buttonProps = {
    type,
    disabled,
    onClick,
    startIcon: Icon && iconPosition === "left" ? <Icon /> : null,
    endIcon: Icon && iconPosition === "right" ? <Icon /> : null,
    sx: {
      ...(iconOnly && { minWidth: "auto", padding: "10px" }),
      ...(variant === "danger" && {
        background: "transparent",
        border: "1px solid #ef4444",
        color: "#ef4444",
        boxShadow: "0 0 8px rgba(239,68,68,0.6)",
        "&:hover": {
          background: "transparent",
          boxShadow: "0 0 14px rgba(239,68,68,0.8)",
        },
      }),
      ...sx,
    },
    ...otherProps,
  };

  return (
    <ButtonComponent {...buttonProps}>
      {!iconOnly && label}
    </ButtonComponent>
  );
}

export function Card({ children, hoverable = true }) {
  const CardComponent = hoverable ? CyberCard : MuiCard;
  return (
    <CardComponent sx={{ padding: "16px" }}>
      {children}
    </CardComponent>
  );
}

export function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  helperText,
  name,
  multiline,
  rows,
  ...otherProps
}) {
  return (
    <CyberTextField
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
      error={!!error}
      helperText={error || helperText}
      fullWidth
      variant="outlined"
      multiline={multiline}
      rows={rows}
      {...otherProps}
    />
  );
}

export function Loader({ fullscreen = false }) {
  const theme = useTheme();

  if (fullscreen) {
    return (
      <Backdrop
        open={true}
        sx={{
          zIndex: 100,
          backgroundColor: theme.palette.mode === "dark"
            ? theme.palette.background.default
            : theme.palette.background.paper,
        }}
      >
        <CircularProgress
          sx={{
            color: theme.palette.secondary.main,
          }}
        />
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <CircularProgress
        sx={{
          color: theme.palette.secondary.main,
        }}
      />
    </Box>
  );
}

// Modal component removed - moved to Online-free-Games/unused-components-backup.jsx

export function Toast({ message, type = "success", onClose, open = true }) {
  const theme = useTheme();
  const colors = {
    success: "#22c55e",
    error: "#ef4444",
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ zIndex: 200 }}
    >
      <Alert
        onClose={onClose}
        severity={type === "error" ? "error" : "success"}
        sx={{
          backgroundColor: theme.palette.background.secondary || theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${colors[type]}`,
          boxShadow: `0 0 16px ${colors[type]}66`,
          "& .MuiAlert-icon": {
            color: colors[type],
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

