import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { getTranslation } from '../../utils/i18n';

const Header = ({ onMenuClick, isDark, toggleTheme, currentLang, setLang, showFurigana, toggleFurigana }) => {
    const t = (key) => getTranslation(currentLang, key);

    return (
        <header className="h-16 px-4 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                    {t('studyGuide')}
                </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
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

                {/* Language Selector - Now includes Myanmar (my) */}
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
