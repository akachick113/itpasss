import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({
  children,
  isSidebarOpen, setSidebarOpen,
  isSidebarCollapsed, toggleSidebarCollapse,
  currentChapter, setCurrentChapter,
  isDark, toggleTheme,
  currentLang, setLang,
  showFurigana, toggleFurigana,
  bookmarks, currentPageIndex,
  isCurrentPageBookmarked,
  onAddBookmark, onRemoveBookmark, onGoToBookmark
}) => {
  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden ${isDark ? 'dark' : ''}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebarCollapse}
        currentChapter={currentChapter}
        onSelectChapter={setCurrentChapter}
        currentLang={currentLang}
        bookmarks={bookmarks}
        onGoToBookmark={onGoToBookmark}
        onRemoveBookmark={onRemoveBookmark}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob opacity-30" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-30" />
        </div>

        <Header
          onMenuClick={() => setSidebarOpen(true)}
          isDark={isDark}
          toggleTheme={toggleTheme}
          currentLang={currentLang}
          setLang={setLang}
          showFurigana={showFurigana}
          toggleFurigana={toggleFurigana}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebarCollapse={toggleSidebarCollapse}
          currentChapter={currentChapter}
          currentPageIndex={currentPageIndex}
          isCurrentPageBookmarked={isCurrentPageBookmarked}
          onAddBookmark={onAddBookmark}
          bookmarks={bookmarks}
          onGoToBookmark={onGoToBookmark}
          onRemoveBookmark={onRemoveBookmark}
        />

        <main className="flex-1 overflow-y-auto relative z-10 p-4 lg:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {children || (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold mb-2">Welcome to your Study Guide</h2>
                <p className="text-slate-500">Select a chapter from the sidebar to begin learning.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
