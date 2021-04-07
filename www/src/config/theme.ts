import { merge, Theme } from "reflexjs"
import coreTheme from "@/core/config/theme"

const theme: Theme = merge(coreTheme, {
  icons: {},
})

export default theme
