import React from 'react';
import {
    BookOpen, Building2, Scale, TrendingUp, Settings, Target,
    Code2, ClipboardList, Search, Binary, Monitor, HardDrive,
    ChevronLeft
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

const Sidebar = ({ isOpen, setIsOpen, currentChapter, onSelectChapter, currentLang }) => {
    const t = (key) => getTranslation(currentLang, key);

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
                    w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                    border-r border-slate-200 dark:border-slate-800
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col
                `}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                        {t('appTitle')}
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                {/* Chapter List */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    {chapterIcons.map((Icon, index) => {
                        const isActive = currentChapter === index;
                        const title = getChapterTitle(currentLang, index);

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    onSelectChapter(index);
                                    if (window.innerWidth < 1024) setIsOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }
                                `}
                            >
                                <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                                <span className="text-left line-clamp-1">{title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer (Progress) */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                        <span>{t('progress')}</span>
                        <span>0%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 w-[0%]" />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
