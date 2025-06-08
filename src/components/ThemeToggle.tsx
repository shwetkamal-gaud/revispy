"use client"
import { useTheme } from "@/context/ThemeContext";
import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center dark:text-white text-black justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-[#ff691f] h-10 w-10"
        >
            {theme === "light" ? <MoonIcon /> :  <SunIcon />}
        </button>
    );
};
