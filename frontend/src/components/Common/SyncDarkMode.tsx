import { useComputedColorScheme } from "@mantine/core";
import { useEffect } from "react";

function SyncDarkMode() {
  const colorScheme = useComputedColorScheme()  // 'light' or 'dark'

  useEffect(() => {
    document.body.classList.toggle('dark', colorScheme === "dark")
  }, [colorScheme])

  return null
}

export default SyncDarkMode