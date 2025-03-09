import { ArrowRightLeft, Calendar, Home, Inbox, Paperclip } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "./ui/sidebar"
import { Link } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { cn } from "~/lib/utils"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: Paperclip,
  },
  {
    title: "Transações",
    url: "/transactions",
    icon: ArrowRightLeft,
  },
]


export function AppSidebar() {
  const { state } = useSidebar()

  return (
    <Sidebar variant="floating" side="left" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>xFinances</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className={cn("flex gap-2 justify-between", state === "collapsed" ? "flex-col" : "flex-row")}>
          <ModeToggle />
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
