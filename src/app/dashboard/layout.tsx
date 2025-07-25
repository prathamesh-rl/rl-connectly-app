"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Settings,
  Bell,
  LogOut,
  RocketIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataProvider } from "@/context/data-context"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <RocketIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold font-headline">RL Connectly</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/alerts')}>
                <Link href="#">
                  <Bell />
                  Alerts
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/settings')}>
                <Link href="#">
                  <Settings />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} data-ai-hint="avatar user"/>
              <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">{user?.displayName || 'Admin User'}</span>
              <span className="text-xs text-muted-foreground">{user?.email || 'admin@rocketlearning.org'}</span>
            </div>
             <Button asChild variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={handleSignOut}>
              <Link href="#">
                <LogOut />
              </Link>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DataProvider>
          <div className="flex">
            <DashboardSidebar />
            <main className="flex-1">
              <SidebarInset>
                <div className="p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </SidebarInset>
            </main>
          </div>
      </DataProvider>
    </AuthProvider>
  )
}
