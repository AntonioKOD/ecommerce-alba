// app/dashboard/layout.js
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {AppSidebar} from "../../components/app-sidebar"




export default async function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    
    
    return (
        <SidebarProvider>
            <AppSidebar/>
      <div>
        <SidebarTrigger/>
        <div>{children}</div>
      </div>
      </SidebarProvider>
    );
  }