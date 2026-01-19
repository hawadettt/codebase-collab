
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Users,
  Settings,
  GitBranch,
  LogOut,
  Code,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const files = [
  { name: "index.js", path: "/src/index.js" },
  { name: "app.tsx", path: "/src/components/app.tsx" },
  { name: "utils.ts", path: "/src/lib/utils.ts" },
  { name: "api.py", path: "/server/api.py" },
];

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

export function AppSidebar() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };


  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Code className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-lg font-semibold">
            Codebase Collab
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {files.map((file, index) => (
            <SidebarMenuItem key={file.path}>
              <SidebarMenuButton isActive={index === 1} size="sm">
                <FileText />
                <span>{file.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <Users />
              <span>Collaborators</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <GitBranch />
              <span>Version History</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-9 w-9">
            {user?.photoURL && <AvatarImage src={user.photoURL} />}
            {!user?.photoURL && userAvatar && <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>{user?.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.displayName ?? "User"}</span>
            <span className="text-xs text-muted-foreground">{user?.email ?? "user@example.com"}</span>
          </div>
          <LogOut onClick={handleLogout} className="ml-auto h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
