import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { ThemeProvider } from "./components/theme-provider"

export const Layout = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <SidebarTrigger />

          <main className="w-full m-6">
            <Outlet />
          </main>

        </SidebarProvider>
      </ThemeProvider>
    </>
  )
}
