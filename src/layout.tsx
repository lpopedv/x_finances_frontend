import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"

export const Layout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />

        <main className="w-full m-6">
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  )
}
