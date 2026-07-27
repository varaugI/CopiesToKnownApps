import { Outlet } from "react-router-dom";
import { CreatePostModal } from "../components/create/CreatePostModal";
import { LikesModal } from "../components/feed/LikesModal";
import { ShareModal } from "../components/feed/ShareModal";
import { BottomNav } from "../components/layout/BottomNav";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { NotificationsDrawer } from "../components/notifications/NotificationsDrawer";
import { SearchDrawer } from "../components/search/SearchDrawer";

export function AppShell() {
  return (
    <div className="app-container">
      <Sidebar />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav />
      <SearchDrawer />
      <NotificationsDrawer />
      <CreatePostModal />
      <LikesModal />
      <ShareModal />
    </div>
  );
}
