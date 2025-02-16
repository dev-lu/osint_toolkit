import { createTheme } from "@mui/material/styles";
import { blueGrey, deepOrange, teal, indigo, pink, grey } from "@mui/material/colors";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: indigo[600],
      contrastText: "#ffffff",
    },
    secondary: {
      main: teal[500],
      contrastText: "#ffffff",
    },
    error: {
      main: deepOrange[700],
    },
    background: {
      default: grey[100],
      paper: grey[50],
      textfieldlarge: grey[200],
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
    },
    divider: grey[300],
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: Array(25).fill("none"),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: indigo[600],
          color: "#ffffff",
          "&:hover": {
            backgroundColor: indigo[700],
          },
        },
        containedSecondary: {
          backgroundColor: teal[500],
          color: "#ffffff",
          "&:hover": {
            backgroundColor: teal[600],
          },
        },
      },
    },
    MuiAccordion: {
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            marginBottom: '8px',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 4,
            backgroundColor: indigo[50],
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            marginBottom: '8px',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 4,
            backgroundColor: indigo[50],
          },
        },
      ],
      styleOverrides: {
        root: {
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: indigo[600],
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: grey[50],
          boxShadow: "none",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: teal[500],
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.95rem",
          "&.Mui-selected": {
            color: indigo[600],
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&.Mui-selected": {
            backgroundColor: indigo[200],
            "&:hover": {
              backgroundColor: indigo[400],
            },
          },
          "&:hover": {
            backgroundColor: grey[200],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: grey[50],
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: grey[200],
          borderRadius: 4,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: grey[400],
            },
            "&:hover fieldset": {
              borderColor: indigo[600],
            },
            "&.Mui-focused fieldset": {
              borderColor: indigo[600],
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "none",
          border: `1px solid ${grey[300]}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: grey[700],
          color: "#ffffff",
          fontSize: "0.875rem",
          borderRadius: 4,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&:hover": {
            backgroundColor: grey[300],
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: indigo[600],
          "&.Mui-checked": {
            color: indigo[700],
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: grey[400],
          "&.Mui-checked": {
            color: indigo[600],
            "& + .MuiSwitch-track": {
              backgroundColor: indigo[600],
            },
          },
        },
        track: {
          backgroundColor: grey[300],
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: indigo[300],
      contrastText: "#000000",
    },
    secondary: {
      main: teal[400],
      contrastText: "#000000",
    },
    error: {
      main: deepOrange[500],
    },
    background: {
      default: grey[900],
      paper: grey[800],
      textfieldlarge: grey[700],
    },
    text: {
      primary: "#ffffff",
      secondary: grey[300],
    },
    divider: grey[700],
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: Array(25).fill("none"),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: indigo[300],
          color: "#000000",
          "&:hover": {
            backgroundColor: indigo[400],
          },
        },
        containedSecondary: {
          backgroundColor: teal[400],
          color: "#000000",
          "&:hover": {
            backgroundColor: teal[500],
          },
        },
      },
    },
    MuiAccordion: {
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            marginBottom: '8px',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 1,
            backgroundColor: grey[800],
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            marginBottom: '8px',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 1,
            backgroundColor: grey[800],
          },
        },
      ],
      styleOverrides: {
        root: {
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: grey[800],
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: grey[800],
          boxShadow: "none",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: teal[400],
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.95rem",
          "&.Mui-selected": {
            color: indigo[300],
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&.Mui-selected": {
            backgroundColor: blueGrey[700],
            "&:hover": {
              backgroundColor: blueGrey[600],
            },
          },
          "&:hover": {
            backgroundColor: grey[700],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: grey[800],
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: grey[700],
          borderRadius: 4,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: grey[600],
            },
            "&:hover fieldset": {
              borderColor: indigo[300],
            },
            "&.Mui-focused fieldset": {
              borderColor: indigo[300],
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "none", 
          border: `1px solid ${grey[700]}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: grey[800],
          color: "#ffffff",
          fontSize: "0.875rem",
          borderRadius: 4,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&:hover": {
            backgroundColor: grey[600],
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: indigo[300],
          "&.Mui-checked": {
            color: indigo[400],
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: grey[500],
          "&.Mui-checked": {
            color: indigo[300],
            "& + .MuiSwitch-track": {
              backgroundColor: indigo[300],
            },
          },
        },
        track: {
          backgroundColor: grey[600],
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
            backgroundColor: indigo[700],
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            backgroundColor: grey[800],
            "&:nth-of-type(odd)": {
              backgroundColor: grey[750],
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${grey[700]}`,
          },
          head: {
            fontWeight: 600,
            color: indigo[300],
          },
          body: {
            color: grey[300],
          },
        },
      },
  },
});
