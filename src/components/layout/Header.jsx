import React, { useState } from 'react';
import { Menu, Sun, Moon, Bookmark, BookmarkCheck, PanelLeftClose, PanelLeft, ChevronDown, X, BookOpen } from 'lucide-react';
import { getTranslation, getChapterTitle } from '../../utils/i18n';

const Header = ({
    onMenuClick,
    isDark,
    toggleTheme,
    currentLang,
    setLang,
    showFurigana,
    toggleFurigana,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    currentChapter,
    currentPageIndex,
    isCurrentPageBookmarked,
    onAddBookmark,
    bookmarks,
    onGoToBookmark,
    onRemoveBookmark
}) => {
    const t = (key) => getTranslation(currentLang, key);
    const [showBookmarkList, setShowBookmarkList] = useState(false);

    const hasBookmarks = bookmarks && bookmarks.length > 0;

    return (
        <header className="h-16 px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                    onClick={toggleSidebarCollapse}
                    className="hidden lg:flex p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                    title={isSidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
                >
                    {isSidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                </button>

                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {t('studyGuide')}
                </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                {/* Bookmark Button */}
                <button
                    onClick={onAddBookmark}
                    disabled={isCurrentPageBookmarked}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                        ${isCurrentPageBookmarked
                            ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 cursor-default'
                            : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 dark:hover:bg-amber-900/20'
                        }
                    `}
                    title={isCurrentPageBookmarked ? t('bookmarked') : t('bookmarkPage')}
                >
                    {isCurrentPageBookmarked ? <BookmarkCheck size={14} className="fill-amber-500" /> : <Bookmark size={14} />}
                    <span className="hidden sm:inline">
                        {isCurrentPageBookmarked ? t('bookmarked') : t('bookmark')}
                    </span>
                </button>

                {/* Bookmarks List Dropdown */}
                {hasBookmarks && (
                    <div className="relative">
                        <button
                            onClick={() => setShowBookmarkList(!showBookmarkList)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 border border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
                        >
                            <BookOpen size={14} />
                            <span className="hidden sm:inline">{t('savedPages')}</span>
                            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px]">
                                {bookmarks.length}
                            </span>
                            <ChevronDown size={12} className={`transition-transform ${showBookmarkList ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        {showBookmarkList && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowBookmarkList(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-80 overflow-y-auto">
                                    <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-2">
                                            {t('savedPages')} ({bookmarks.length})
                                        </h3>
                                    </div>
                                    <div className="p-1">
                                        {bookmarks.map((bookmark) => (
                                            <div
                                                key={bookmark.id}
                                                className="group flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer"
                                                onClick={() => {
                                                    onGoToBookmark(bookmark);
                                                    setShowBookmarkList(false);
                                                }}
                                            >
                                                <Bookmark size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                                        {getChapterTitle(currentLang, bookmark.chapterId)}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {t('page')} {bookmark.pageIndex + 1}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveBookmark(bookmark.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 transition-opacity"
                                                    title={t('removeBookmark')}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                {/* Furigana Toggle */}
                <button
                    onClick={toggleFurigana}
                    className={`
                        hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                        ${showFurigana
                            ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                            : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                    `}
                >
                    <span className="text-base">あ</span>
                    <span>{t('furigana')}</span>
                </button>

                {/* Language Selector */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    {['ja', 'vi', 'en', 'my'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLang(lang)}
                            className={`
                                px-2.5 py-1 rounded-md text-xs font-medium transition-all
                                ${currentLang === lang
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }
                            `}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
