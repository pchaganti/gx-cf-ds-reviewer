import "./globals.css"

import type { Metadata } from "next"

import GitHubIcon from "@mui/icons-material/GitHub"
import { Container } from "@mui/material"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import Link from "next/link"
import { SessionProvider } from "next-auth/react"
import React from "react"

import ClientThemeProvider from "@/src/components/ClientThemeProvider"
import Login2Github from "@/src/components/Login2Github"
import ToggleTheme from "@/src/components/ToggleTheme"

export const metadata: Metadata = {
    title: "AI code reviewer",
    description: "A code review tool powered by Cloudflare worker AI"
}

const repo = "https://github.com/aolyang/cloudflare-deepseek-code-reviewer"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={"size-full"}>
                <SessionProvider>
                    <AppRouterCacheProvider>
                        <ClientThemeProvider>
                            <Container className={"size-full"} maxWidth={"sm"}>
                                <div className={"flex items-center gap-2 h-[56px]"}>
                                    <Link className={"flex gap-2"} href={repo} title={repo}>
                                        Cloudflare AI Code Review
                                        <GitHubIcon/>
                                    </Link>
                                    <div className={"flex-1"}/>
                                    <nav className={"flex gap-2 underline"}>
                                        <Link href="/">Home</Link>
                                        <Link href="/models">Models</Link>
                                    </nav>
                                    <ToggleTheme/>
                                    <Login2Github/>
                                </div>
                                <div style={{ height: "calc(100% - 56px)" }}>
                                    {children}
                                </div>
                            </Container>
                        </ClientThemeProvider>
                    </AppRouterCacheProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
