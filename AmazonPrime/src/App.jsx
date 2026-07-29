import React from "react";
import { PrimeProvider, usePrime } from "./context/PrimeContext";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { ContentRows } from "./components/ContentRows";
import { VideoPlayer } from "./components/VideoPlayer";
import { MyStuff } from "./components/MyStuff";
import "./index.css";

const MainLayout = () => {
  const { activeView } = usePrime();

  return (
    <div className="prime-app">
      {activeView !== "player" && <Header />}

      <main style={{ flex: 1 }}>
        {(activeView === "home" || activeView === "movies" || activeView === "tv") && (
          <>
            <HeroBanner />
            <ContentRows />
          </>
        )}
        {activeView === "mystuff" && <MyStuff />}
        {activeView === "player" && <VideoPlayer />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <PrimeProvider>
      <MainLayout />
    </PrimeProvider>
  );
}
