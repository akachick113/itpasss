import React, { useState, useEffect } from 'react';
import { getPagesForChapter, getPageId } from '../../utils/chapterData';
import { FuriganaText, createRuby } from '../../utils/furigana';
import { getTranslation } from '../../utils/i18n';
import { ChevronLeft, ChevronRight, Image as ImageIcon, FileText, SplitSquareHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContentRenderer = ({ chapterId, lang, showFurigana }) => {
    const [pages, setPages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('both'); // text, image, both

    // Load chapter pages on mount or chapter change
    useEffect(() => {
        const chapterPages = getPagesForChapter(chapterId);
        setPages(chapterPages);
        setCurrentPageIndex(0); // Reset to start of chapter
    }, [chapterId]);

    // Fetch page data when index changes
    useEffect(() => {
        if (pages.length === 0) return;

        const fetchPage = async () => {
            setLoading(true);
            try {
                const pageNum = pages[currentPageIndex];
                const pageId = getPageId(pageNum);
                const res = await fetch(`/data/pages/p_${pageId}.json`);
                if (!res.ok) throw new Error('Failed to load');
                const data = await res.json();
                setPageData(data);
            } catch (err) {
                console.error(err);
                setPageData(null); // Fallback to image only or error
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [currentPageIndex, pages]);

    const handleNext = () => {
        if (currentPageIndex < pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    };

    const currentFileId = pages.length > 0 ? getPageId(pages[currentPageIndex]) : '0000';

    return (
        <div className="flex flex-col h-full gap-4 relative">

            {/* Sticky Navigation Overlay */}
            {/* Navigation Arrows (Fixed) */}
            <button
                onClick={handlePrev}
                disabled={currentPageIndex === 0}
                className={`fixed top-1/2 -translate-y-1/2 z-50 p-3 lg:p-4 rounded-full backdrop-blur-md shadow-lg border transition-all transform hover:scale-110 active:scale-95
                    /* Mobile: Left edge. Desktop: Offset by sidebar width (72px = 18rem) + spacing */
                    left-4 lg:left-[20rem]
                    ${currentPageIndex === 0
                        ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                        : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'}
                `}
                aria-label="Previous Page"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={handleNext}
                disabled={currentPageIndex === pages.length - 1}
                className={`fixed top-1/2 -translate-y-1/2 right-4 z-50 p-3 lg:p-4 rounded-full backdrop-blur-md shadow-lg border transition-all transform hover:scale-110 active:scale-95
                    ${currentPageIndex === pages.length - 1
                        ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                        : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700'}
                `}
                aria-label="Next Page"
            >
                <ChevronRight size={24} />
            </button>

            {/* Controls Toolbar (Static, Top) */}
            <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{getTranslation(lang, 'page')}</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={currentPageIndex + 1}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 1 && val <= pages.length) {
                                setCurrentPageIndex(val - 1);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur();
                            }
                        }}
                        className="w-14 px-2 py-1 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span>/ {pages.length}</span>
                </div>

                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    {[
                        { id: 'text', icon: FileText },
                        { id: 'both', icon: SplitSquareHorizontal },
                        { id: 'image', icon: ImageIcon }
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id)}
                            className={`p-1.5 rounded-md ${viewMode === mode.id ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
                        >
                            <mode.icon size={16} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`grid gap-6 ${viewMode === 'both' ? 'lg:grid-cols-2 items-start' : 'h-full'}`}
                    >
                        {/* Text View */}
                        {(viewMode === 'text' || viewMode === 'both') && (
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                                {loading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : pageData ? (
                                    <div className="space-y-6">
                                        {pageData.content?.map((item, idx) => (
                                            <ContentItem key={idx} item={item} lang={lang} showFurigana={showFurigana} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-slate-500">
                                        <p>Translation pending...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Image View - Sticky in Both Mode */}
                        {(viewMode === 'image' || viewMode === 'both') && (
                            <div className={`
                 rounded-2xl flex items-start justify-center overflow-hidden border border-slate-200 dark:border-slate-800 relative
                 ${viewMode === 'both' ? 'lg:sticky lg:top-4 bg-slate-100 dark:bg-slate-900 h-fit' : 'bg-slate-100 dark:bg-slate-900 h-full items-center'}
              `}>
                                <img
                                    src={`/images/p_${currentFileId}.png`}
                                    alt={`Page ${currentFileId}`}
                                    className={`object-contain ${viewMode === 'both' ? 'w-full max-h-[85vh]' : 'max-w-full max-h-full'}`}
                                    loading="lazy"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-slate-400 p-4">Image not available</span>' }}
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Sub-component for individual content items
const ContentItem = ({ item, lang, showFurigana }) => {
    const flags = { vi: '🇻🇳', en: '🇬🇧', my: '🇲🇲', ja: '🇯🇵' };

    // Helper to process text
    const processText = (text, terms) => {
        if (!showFurigana || !terms) return text;
        return <FuriganaText text={text} terms={terms} />;
    };

    const jaText = processText(item.ja, item.terms);
    const targetText = item[lang] || item.ja; // Fallback to JA if missing

    switch (item.type) {
        case 'heading':
        case 'lesson_header':
            return (
                <div className="mb-4">
                    {lang !== 'ja' ? (
                        <div className="border-l-4 border-blue-500 pl-4 py-1.5">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{jaText}</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300">{targetText}</p>
                        </div>
                    ) : (
                        <h3 className="text-xl font-bold border-l-4 border-blue-500 pl-4 py-1.5">{jaText}</h3>
                    )}
                </div>
            );

        case 'paragraph':
            return (
                <div className="mb-4 group">
                    {lang !== 'ja' ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 flex items-center gap-2">
                                <span>🇯🇵</span> {jaText}
                            </p>
                            <p className="text-slate-800 dark:text-slate-200 font-medium flex gap-2">
                                <span>{flags[lang] || '🌐'}</span> {targetText}
                            </p>
                        </div>
                    ) : (
                        <p className="leading-relaxed text-slate-700 dark:text-slate-300">{jaText}</p>
                    )}
                </div>
            );

        case 'table':
            return (
                <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        {item.headers && (
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    {(item.headers[lang] || item.headers.ja || []).map((h, i) => (
                                        <th key={i} className="px-4 py-2 text-left font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {(item.rows || []).map((row, rI) => (
                                <tr key={rI} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    {(row[lang] || row.ja || []).map((cell, cI) => (
                                        <td key={cI} className="px-4 py-2">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case 'exam_tip':
            return (
                <div className="my-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden">
                    <div className="bg-emerald-100/50 dark:bg-emerald-900/40 px-4 py-2 flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                        <span>🎯</span>
                        <span>{item.title?.[lang] || item.title?.ja || 'Exam Tip'}</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="text-emerald-900 dark:text-emerald-100">{processText(item.content?.ja, item.content?.terms)}</div>
                        {lang !== 'ja' && (
                            <div className="text-emerald-700 dark:text-emerald-400 text-sm flex gap-2 border-t border-emerald-200 dark:border-emerald-800/50 pt-2 mt-2">
                                <span>{flags[lang]}</span>
                                <span>{item.content?.[lang]}</span>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'learn_more':
        case 'info_box':
            return (
                <div className="my-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
                    <div className="bg-blue-100/50 dark:bg-blue-900/40 px-4 py-2 flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
                        <span>💡</span>
                        <span>{item.title?.[lang] || item.title?.ja || 'Learn More'}</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="text-blue-900 dark:text-blue-100">{processText(item.content?.ja, item.content?.terms)}</div>
                        {lang !== 'ja' && (
                            <div className="text-blue-700 dark:text-blue-400 text-sm flex gap-2 border-t border-blue-200 dark:border-blue-800/50 pt-2 mt-2">
                                <span>{flags[lang]}</span>
                                <span>{item.content?.[lang]}</span>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'quote_box':
            return (
                <div className="my-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-slate-400 italic">
                    <p className="text-slate-800 dark:text-slate-200 mb-1">{processText(item.ja, item.terms)}</p>
                    {lang !== 'ja' && <p className="text-slate-500 dark:text-slate-400 text-sm">{item[lang]}</p>}
                </div>
            );

        case 'exam_question':
            const answer = item.answer || '';
            return (
                <div className="my-8 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 shadow-sm bg-white dark:bg-slate-900">
                    <div className="flex justify-between items-center mb-4">
                        <span className="bg-slate-800 text-white dark:bg-white dark:text-slate-900 px-3 py-1 rounded-full text-xs font-bold">問題 {item.number}</span>
                        <span className="text-slate-400 text-xs">{item.year}</span>
                    </div>

                    <div className="mb-6 space-y-2">
                        <p className="font-medium text-lg">{item.question?.ja}</p>
                        {lang !== 'ja' && <p className="text-slate-500 text-sm">{item.question?.[lang]}</p>}
                    </div>

                    <div className="space-y-2">
                        {(item.options?.ja || []).map((opt, i) => {
                            const isCorrect = opt.startsWith(answer) || opt.includes(`${answer}.`);
                            const optTrans = item.options?.[lang]?.[i];
                            return (
                                <div key={i} className={`p-3 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-800'}`}>
                                    <div className={isCorrect ? 'text-green-700 dark:text-green-400 font-bold' : ''}>{opt}</div>
                                    {lang !== 'ja' && optTrans && <div className="text-xs text-slate-500 mt-1">{optTrans}</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );

        case 'answer_explanation':
            return (
                <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <div className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">解答 {item.number} - 正解：{item.answer}</div>
                    <div className="text-sm space-y-2">
                        <div className="text-slate-800 dark:text-slate-200">{processText(item.explanation?.ja, item.terms)}</div>
                        {lang !== 'ja' && <div className="text-slate-500 dark:text-slate-400 border-t border-yellow-200 dark:border-yellow-800/50 pt-2">{item.explanation?.[lang]}</div>}
                    </div>
                </div>
            );

        case 'chapter_title':
            return (
                <div className="text-center my-10">
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 pb-2">{item.ja}</h2>
                    {lang !== 'ja' && <p className="text-xl text-slate-500">{item[lang]}</p>}
                </div>
            );

        default:
            return null;
    }
};

export default ContentRenderer;
