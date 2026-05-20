import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        react({
            include: "**/*.{js,jsx,ts,tsx}",
        }),
    ],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/setupTests.js",
    },
});
