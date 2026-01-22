import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import ContentRenderer from './components/features/ContentRenderer';
import LandingPage from './components/layout/LandingPage';

function App() {
  // State
  const [showLanding, setShowLanding] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [currentLang, setLang] = useState('ja');
  const [showFurigana, setShowFurigana] = useState(true);

  // Load saved settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (showLanding) {
    return (
      <LandingPage
        onStart={() => setShowLanding(false)}
        isDark={isDark}
      />
    );
  }

  return (
    <Layout
      isSidebarOpen={isSidebarOpen}
      setSidebarOpen={setSidebarOpen}
      currentChapter={currentChapter}
      setCurrentChapter={setCurrentChapter}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLang}
      setLang={setLang}
      showFurigana={showFurigana}
      toggleFurigana={() => setShowFurigana(!showFurigana)}
    >
      {currentChapter !== null ? (
        <ContentRenderer
          chapterId={currentChapter}
          lang={currentLang}
          showFurigana={showFurigana}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to your Study Guide</h2>
          <p className="text-slate-500">Select a chapter from the sidebar to begin learning.</p>
        </div>
      )}
    </Layout>
  );
}

export default App;
