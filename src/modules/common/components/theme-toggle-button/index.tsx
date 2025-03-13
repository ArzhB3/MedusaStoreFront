"use client"

import { Switch } from "@medusajs/ui"
import { Moon, Sun, MoonSolid, SunSolid } from "@medusajs/icons"

import { useTheme } from "@lib/providers/theme"

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center space-x-2">
      {theme === "light" ? <SunSolid /> : <Sun />}
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-white data-[state=unchecked]:bg-black dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-black"
      />
      {theme === "dark" ? <MoonSolid /> : <Moon />}
    </div>
  )
}
