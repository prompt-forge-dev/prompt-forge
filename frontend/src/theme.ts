import { createTheme } from "@mantine/core"

const theme = createTheme({
  breakpoints: {
    xs: "360px",
    sm: "768px",
    md: "992px",
    lg: "1200px",
    xl: "1408px",
  },
  colors: {
    brand: [
      "#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6",
      "#42A5F5", "#2196F3", "#1976D2", "#1565C0",
      "#0D47A1", "#0B3D91"
    ],
    accent: [
      "#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784",
      "#66BB6A", "#4CAF50", "#43A047", "#388E3C",
      "#2E7D32", "#00C853"
    ],
  },
  primaryColor: "brand",
})

export default theme
