import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { WhatsAppProvider } from "./context/WhatsAppContext";
import { queryClient } from "./lib/queryClient";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { SidebarNav } from "./components/layout/SidebarNav";
import { ChatList } from "./components/layout/ChatList";
import { ChatArea } from "./components/chat/ChatArea";
import { StatusTab } from "./components/status/StatusTab";
import { CallsTab } from "./components/calls/CallsTab";
import { ChannelsTab } from "./components/channels/ChannelsTab";
import { ProfileDrawer } from "./components/profile/ProfileDrawer";
import { SettingsDrawer } from "./components/settings/SettingsDrawer";
import { DevicesTab } from "./components/devices/DevicesTab";
import { ActiveCallModal } from "./components/calls/ActiveCallModal";
import "./index.css";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith("/chats");

  return (
    <div className="wa-app-container">
      {/* Left Navigation Icon Strip & Active Panel */}
      <aside className={`wa-sidebar-panel ${isChatRoute && location.pathname !== "/chats" ? "hidden-mobile" : ""}`}>
        <SidebarNav />

        <div style={{ flex: 1, height: "100%", overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/chats" replace />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/chats/:conversationId" element={<ChatList />} />
            <Route path="/status" element={<StatusTab />} />
            <Route path="/status/:statusId" element={<StatusTab />} />
            <Route path="/channels" element={<ChannelsTab />} />
            <Route path="/channels/:channelId" element={<ChannelsTab />} />
            <Route path="/calls" element={<CallsTab />} />
            <Route path="/settings" element={<SettingsDrawer />} />
            <Route path="/profile" element={<ProfileDrawer />} />
            <Route path="/devices" element={<DevicesTab />} />
          </Routes>
        </div>
      </aside>

      {/* Right Conversation Panel */}
      <main className={`wa-chat-panel ${!isChatRoute ? "hidden-mobile" : ""}`}>
        <Routes>
          <Route path="/chats" element={<ChatArea />} />
          <Route path="/chats/:conversationId" element={<ChatArea />} />
          <Route path="*" element={<ChatArea />} />
        </Routes>
      </main>

      {/* Active Call Overlay */}
      <ActiveCallModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WhatsAppProvider>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </WhatsAppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
