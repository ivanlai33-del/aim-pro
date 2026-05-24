import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: ["class"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                surface: "var(--surface)",
                "surface-hover": "var(--surface-hover)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                success: "var(--success)",
                border: "var(--border)",
                "border-light": "var(--border-light)",
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                input: "var(--input)",
                ring: "var(--ring)",
            },
            borderRadius: {
                xl: "var(--radius-xl)",
                "2xl": "var(--radius-2xl)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                "spin-slow": "spin 3s linear infinite",
            }
        },
    },
    plugins: [],
};
export default config;
