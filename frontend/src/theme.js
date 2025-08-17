import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const colors = {
  primary: {
    50: '#E8F4FD',
    100: '#C6E2F9',
    200: '#94CBF5',
    300: '#62B4F1',
    400: '#3B9DEE',
    500: '#1486EB',
    600: '#1275D4',
    700: '#0F60B8',
    800: '#0C4B9C',
    900: '#082E74',
  },
  
  secondary: {
    50: '#EDFDF7',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  accent: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  }
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: "#ffffff",
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: "#ffffff",
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    info: {
      main: colors.primary[400],
      light: colors.primary[200],
      dark: colors.primary[600],
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    background: {
      default: colors.neutral[200],
      paper: colors.neutral[100],
      textfieldlarge: colors.neutral[300],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      disabled: colors.neutral[400],
    },
    divider: alpha(colors.neutral[900], 0.08),
    action: {
      active: colors.neutral[600],
      hover: alpha(colors.neutral[900], 0.04),
      selected: alpha(colors.primary[500], 0.08),
      disabled: colors.neutral[300],
      disabledBackground: colors.neutral[100],
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.05)",
    "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
    "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    ...Array(18).fill("none"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
          boxShadow: `0 4px 14px 0 ${alpha(colors.primary[500], 0.25)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
            boxShadow: `0 6px 20px 0 ${alpha(colors.primary[500], 0.35)}`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
          boxShadow: `0 4px 14px 0 ${alpha(colors.secondary[500], 0.25)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.secondary[600]} 0%, ${colors.secondary[700]} 100%)`,
            boxShadow: `0 6px 20px 0 ${alpha(colors.secondary[500], 0.35)}`,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: alpha(colors.primary[500], 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.neutral[200]}`,
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: colors.neutral[100],
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "& fieldset": {
              borderColor: colors.neutral[300],
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: colors.primary[400],
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.primary[500],
              boxShadow: `0 0 0 3px ${alpha(colors.primary[500], 0.1)}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: colors.primary[100],
          color: colors.primary[800],
          "&:hover": {
            backgroundColor: colors.primary[200],
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 8,
          backgroundColor: colors.neutral[100], // Fixed: neutral[150] doesn't exist
          border: `1px solid ${colors.neutral[200]}`,
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "0 0 8px 0",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 36, 129, 0.7)',
          color: "#ffffff",
          backdropFilter: "blur(5px)",
          borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          borderRadius: 8,
          margin: "0 4px",
          minHeight: 48,
          "&:hover": {
            backgroundColor: alpha(colors.primary[500], 0.04),
          },
          "&.Mui-selected": {
            color: colors.primary[600],
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 8px",
          "&.Mui-selected": {
            backgroundColor: alpha(colors.primary[500], 0.08),
            color: colors.primary[700],
            "&:hover": {
              backgroundColor: alpha(colors.primary[500], 0.12),
            },
          },
          "&:hover": {
            backgroundColor: alpha(colors.neutral[500], 0.04),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(colors.neutral[500], 0.08),
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 1,
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: colors.primary[500],
                opacity: 1,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 24,
            height: 24,
            boxShadow: "0 2px 4px 0 rgba(0,35,11,0.2)",
          },
          "& .MuiSwitch-track": {
            borderRadius: 13,
            backgroundColor: colors.neutral[300],
            opacity: 1,
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: colors.neutral[900],
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[600],
      contrastText: colors.neutral[900],
    },
    error: {
      main: colors.error[400],
      light: colors.error[300],
      dark: colors.error[600],
    },
    warning: {
      main: colors.warning[400],
      light: colors.warning[300],
      dark: colors.warning[600],
    },
    info: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[500],
    },
    success: {
      main: colors.success[400],
      light: colors.success[300],
      dark: colors.success[600],
    },
    background: {
      default: colors.neutral[950],
      paper: colors.neutral[900],
      textfieldlarge: colors.neutral[800],
    },
    text: {
      primary: colors.neutral[50],
      secondary: colors.neutral[400],
      disabled: colors.neutral[600],
    },
    divider: alpha(colors.neutral[50], 0.12),
    action: {
      active: colors.neutral[300],
      hover: alpha(colors.neutral[50], 0.04),
      selected: alpha(colors.primary[400], 0.12),
      disabled: colors.neutral[700],
      disabledBackground: colors.neutral[800],
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.3)",
    "0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)",
    "0px 4px 6px -1px rgba(0, 0, 0, 0.4), 0px 2px 4px -1px rgba(0, 0, 0, 0.3)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.4), 0px 4px 6px -2px rgba(0, 0, 0, 0.3)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.4), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.6)",
    ...Array(18).fill("none"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
          boxShadow: `0 4px 14px 0 ${alpha(colors.primary[500], 0.4)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
            boxShadow: `0 6px 20px 0 ${alpha(colors.primary[500], 0.5)}`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
          boxShadow: `0 4px 14px 0 ${alpha(colors.secondary[500], 0.4)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.secondary[400]} 0%, ${colors.secondary[500]} 100%)`,
            boxShadow: `0 6px 20px 0 ${alpha(colors.secondary[500], 0.5)}`,
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: colors.neutral[600],
          color: colors.neutral[200],
          "&:hover": {
            borderWidth: 2,
            backgroundColor: alpha(colors.primary[400], 0.08),
            borderColor: colors.primary[400],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: colors.neutral[900],
          border: `1px solid ${colors.neutral[800]}`,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: colors.neutral[800],
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "& fieldset": {
              borderColor: colors.neutral[700],
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: colors.primary[400],
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.primary[400],
              boxShadow: `0 0 0 3px ${alpha(colors.primary[400], 0.15)}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: alpha(colors.primary[400], 0.15),
          color: colors.primary[300],
          "&:hover": {
            backgroundColor: alpha(colors.primary[400], 0.25),
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 8,
          backgroundColor: colors.neutral[900],
          border: `1px solid ${colors.neutral[800]}`,
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "0 0 8px 0",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(30, 30, 30, 0.3)",
          color: "#ffffff",
          backdropFilter: "blur(5px)",
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2), 0px 1px 2px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${colors.primary[400]} 0%, ${colors.secondary[400]} 100%)`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          borderRadius: 8,
          margin: "0 4px",
          minHeight: 48,
          color: colors.neutral[400],
          "&:hover": {
            backgroundColor: alpha(colors.primary[400], 0.08),
            color: colors.neutral[200],
          },
          "&.Mui-selected": {
            color: colors.primary[400],
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "2px 8px",
          "&.Mui-selected": {
            backgroundColor: alpha(colors.primary[400], 0.15),
            color: colors.primary[300],
            "&:hover": {
              backgroundColor: alpha(colors.primary[400], 0.2),
            },
          },
          "&:hover": {
            backgroundColor: alpha(colors.neutral[50], 0.04),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          color: colors.neutral[400],
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: alpha(colors.neutral[50], 0.08),
            color: colors.neutral[200],
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 1,
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: colors.primary[500],
                opacity: 1,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 24,
            height: 24,
            backgroundColor: colors.neutral[100],
            boxShadow: "0 2px 4px 0 rgba(0,0,0,0.4)",
          },
          "& .MuiSwitch-track": {
            borderRadius: 13,
            backgroundColor: colors.neutral[600],
            opacity: 1,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.neutral[800],
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          backgroundColor: colors.neutral[900],
          "&:nth-of-type(odd)": {
            backgroundColor: alpha(colors.neutral[800], 0.5),
          },
          "&:hover": {
            backgroundColor: alpha(colors.primary[400], 0.05),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.neutral[800]}`,
        },
        head: {
          fontWeight: 600,
          color: colors.primary[300],
          backgroundColor: colors.neutral[800],
        },
        body: {
          color: colors.neutral[300],
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        filledSuccess: {
          backgroundColor: colors.success[600],
          color: colors.neutral[900],
          "& .MuiAlert-icon": {
            color: colors.neutral[900],
          },
          "& .MuiAlert-action": {
            color: colors.neutral[900],
            "& .MuiIconButton-root": {
              color: colors.neutral[900],
              "&:hover": {
                backgroundColor: alpha(colors.neutral[900], 0.1),
              },
            },
          },
        },
        filledError: {
          backgroundColor: colors.error[600],
          color: colors.neutral[900],
          "& .MuiAlert-icon": {
            color: colors.neutral[900],
          },
          "& .MuiAlert-action": {
            color: colors.neutral[900],
            "& .MuiIconButton-root": {
              color: colors.neutral[900],
              "&:hover": {
                backgroundColor: alpha(colors.neutral[900], 0.1),
              },
            },
          },
        },
        filledWarning: {
          backgroundColor: colors.warning[600],
          color: colors.neutral[900],
          "& .MuiAlert-icon": {
            color: colors.neutral[900],
          },
          "& .MuiAlert-action": {
            color: colors.neutral[900],
            "& .MuiIconButton-root": {
              color: colors.neutral[900],
              "&:hover": {
                backgroundColor: alpha(colors.neutral[900], 0.1),
              },
            },
          },
        },
        filledInfo: {
          backgroundColor: colors.primary[600],
          color: colors.neutral[900],
          "& .MuiAlert-icon": {
            color: colors.neutral[900],
          },
          "& .MuiAlert-action": {
            color: colors.neutral[900],
            "& .MuiIconButton-root": {
              color: colors.neutral[900],
              "&:hover": {
                backgroundColor: alpha(colors.neutral[900], 0.1),
              },
            },
          },
        },
      },
    },
  },
});

// Export individual color palette for use in custom components
export { colors };
