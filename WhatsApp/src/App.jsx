import React from "react";
import { WhatsAppProvider, useWhatsApp } from "./context/WhatsAppContext";
import { SidebarNav } from "./components/layout/SidebarNav";
import { ChatList } from "./components/layout/ChatList";
import { ChatArea } from "./components/chat/ChatArea";
import { StatusTab } from "./components/status/StatusTab";
import { CallsTab } from "./components/calls/CallsTab";
import { ChannelsTab } from "./components/channels/ChannelsTab";
import { ProfileDrawer } from "./components/profile/ProfileDrawer";
import { SettingsDrawer } from "./components/settings/SettingsDrawer";
import "./index.css";

const MainLayout = () => {
  const { activeTab, activeChatId } = useWhatsApp();

  return (
    <div className="wa-app-container">
      {/* Left Navigation Icon Strip & Active Panel */}
      <aside className={`wa-sidebar-panel ${activeChatId ? "hidden-mobile" : ""}`}>
        <SidebarNav />

        <div style={{ flex: 1, height: "100%", overflowY: "auto" }}>
          {activeTab === "chats" && <ChatList />}
          {activeTab === "status" && <StatusTab />}
          {activeTab === "channels" && <ChannelsTab />}
          {activeTab === "calls" && <CallsTab />}
          {activeTab === "profile" && <ProfileDrawer />}
          {activeTab === "settings" && <SettingsDrawer />}
        </div>
      </aside>

      {/* Right Conversation Panel */}
      <main className={`wa-chat-panel ${!activeChatId ? "hidden-mobile" : ""}`}>
        <ChatArea />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <WhatsAppProvider>
      <MainLayout />
    </WhatsAppProvider>
  );
}
