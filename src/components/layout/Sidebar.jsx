import React from 'react';
import {
    BookOpen, Building2, Scale, TrendingUp, Settings, Target,
    Code2, ClipboardList, Search, Binary, Monitor, HardDrive,
    ChevronLeft, ChevronRight, Bookmark, X
} from 'lucide-react';
import { getTranslation, getChapterTitle } from '../../utils/i18n';

const chapterIcons = [
    BookOpen,   // 0
    Building2,  // 1
    Scale,      // 2
    TrendingUp, // 3
    Settings,   // 4
    Target,     // 5
    Code2,      // 6
    ClipboardList, // 7
    Search,     // 8
    Binary,     // 9
    Monitor,    // 10
    HardDrive,  // 11
];

const Sidebar = ({
    isOpen, setIsOpen,
    isCollapsed, toggleCollapse,
    currentChapter, onSelectChapter,
    currentLang,
    bookmarks, onGoToBookmark, onRemoveBookmark
}) => {
    const t = (key) => getTranslation(currentLang, key);

    // Get bookmarks for specific chapter
    const getChapterBookmarks = (chapterId) => {
        return bookmarks?.filter(b => b.chapterId === chapterId) || [];
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    ${isCollapsed ? 'w-16' : 'w-72'} 
                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                    border-r border-slate-200 dark:border-slate-800
                    transform transition-all duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col
                `}
            >
                {/* Header */}
                <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-6'} border-b border-slate-200 dark:border-slate-800`}>
                    {!isCollapsed && (
                        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                            {t('appTitle')}
                        </h2>
                    )}

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                        title={isCollapsed ? t('expandSidebar') : t('collapseSidebar')}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                {/* Chapter List */}
                <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-3'} space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600`}>
                    {chapterIcons.map((Icon, index) => {
                        const isActive = currentChapter === index;
                        const title = getChapterTitle(currentLang, index);
                        const chapterBookmarks = getChapterBookmarks(index);
                        const hasBookmarks = chapterBookmarks.length > 0;

                        return (
                            <div key={index}>
                                <button
                                    onClick={() => {
                                        onSelectChapter(index);
                                        if (window.innerWidth < 1024) setIsOpen(false);
                                    }}
                                    title={isCollapsed ? title : undefined}
                                    className={`
                                        w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                                        ${isCollapsed ? 'px-2 py-3' : 'px-3 py-3'} rounded-xl text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                        }
                                        relative
                                    `}
                                >
                                    <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                                    {!isCollapsed && <span className="text-left line-clamp-1 flex-1">{title}</span>}

                                    {/* Bookmark Count Indicator */}
                                    {hasBookmarks && (
                                        <span className={`
                                            ${isCollapsed ? 'absolute -top-1 -right-1' : ''} 
                                            bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center
                                        `}>
                                            {chapterBookmarks.length}
                                        </span>
                                    )}
                                </button>

                                {/* Bookmarks for this chapter (only when expanded and active) */}
                                {!isCollapsed && isActive && hasBookmarks && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {chapterBookmarks.map((bookmark) => (
                                            <div
                                                key={bookmark.id}
                                                className="group flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer text-amber-700 dark:text-amber-400"
                                                onClick={() => {
                                                    onGoToBookmark(bookmark);
                                                    if (window.innerWidth < 1024) setIsOpen(false);
                                                }}
                                            >
                                                <Bookmark size={12} className="fill-amber-500 text-amber-500" />
                                                <span className="flex-1">{t('page')} {bookmark.pageIndex + 1}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveBookmark(bookmark.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer (Progress) - Hide when collapsed */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                            <span>{t('progress')}</span>
                            <span>0%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 w-[0%]" />
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
