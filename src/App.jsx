import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import ContentRenderer from './components/features/ContentRenderer';
import LandingPage from './components/layout/LandingPage';

function App() {
  // State
  const [showLanding, setShowLanding] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [currentLang, setLang] = useState('ja');
  const [showFurigana, setShowFurigana] = useState(true);

  // Enhanced bookmarks: array of {chapterId, pageIndex, timestamp}
  const [bookmarks, setBookmarks] = useState([]);
  // Target page for navigation (set when clicking a bookmark)
  const [targetPage, setTargetPage] = useState(null);

  // Load saved settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    // Load sidebar collapsed state
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true);
    }
    // Load bookmarks array
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
      }
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

  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  // Callback to receive current page from ContentRenderer
  const handlePageChange = useCallback((pageIndex) => {
    setCurrentPageIndex(pageIndex);
    // Clear target page after navigation
    if (targetPage !== null) {
      setTargetPage(null);
    }
  }, [targetPage]);

  // Add bookmark for current chapter + page
  const handleAddBookmark = () => {
    const newBookmark = {
      id: Date.now(),
      chapterId: currentChapter,
      pageIndex: currentPageIndex,
      timestamp: new Date().toISOString()
    };

    // Check if same chapter+page already bookmarked
    const exists = bookmarks.some(
      b => b.chapterId === currentChapter && b.pageIndex === currentPageIndex
    );

    if (!exists) {
      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
    }
  };

  // Remove a bookmark
  const handleRemoveBookmark = (bookmarkId) => {
    const updated = bookmarks.filter(b => b.id !== bookmarkId);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  // Navigate to a bookmark (chapter + page)
  const handleGoToBookmark = (bookmark) => {
    if (bookmark.chapterId !== currentChapter) {
      setCurrentChapter(bookmark.chapterId);
    }
    setTargetPage(bookmark.pageIndex);
  };

  // Check if current page is bookmarked
  const isCurrentPageBookmarked = bookmarks.some(
    b => b.chapterId === currentChapter && b.pageIndex === currentPageIndex
  );

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
      isSidebarCollapsed={isSidebarCollapsed}
      toggleSidebarCollapse={toggleSidebarCollapse}
      currentChapter={currentChapter}
      setCurrentChapter={setCurrentChapter}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLang}
      setLang={setLang}
      showFurigana={showFurigana}
      toggleFurigana={() => setShowFurigana(!showFurigana)}
      bookmarks={bookmarks}
      currentPageIndex={currentPageIndex}
      isCurrentPageBookmarked={isCurrentPageBookmarked}
      onAddBookmark={handleAddBookmark}
      onRemoveBookmark={handleRemoveBookmark}
      onGoToBookmark={handleGoToBookmark}
    >
      {currentChapter !== null ? (
        <ContentRenderer
          chapterId={currentChapter}
          lang={currentLang}
          showFurigana={showFurigana}
          isSidebarCollapsed={isSidebarCollapsed}
          onPageChange={handlePageChange}
          targetPage={targetPage}
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
