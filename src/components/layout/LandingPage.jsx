import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Globe2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage = ({ onStart, isDark }) => {
    return (
        <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

            {/* Background Blobs (More prominent than main app) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute top-[30%] left-[30%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col items-center text-center">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12"
                >
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-sm font-medium">
                        <Sparkles size={16} className="text-yellow-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                            New Premium Experience
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        Master the <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                            IT Passport Exam
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        The ultimate study guide designed for success. <br />
                        Multi-language support, smart furigana, and a beautiful learning environment.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full max-w-4xl"
                >
                    {[
                        { icon: Globe2, title: "Multi-Language", desc: "Japanese, Vietnamese, English, & Myanmar support." },
                        { icon: BookOpen, title: "Smart Furigana", desc: "Intelligent readings for Kanji to help you learn faster." },
                        { icon: CheckCircle2, title: "Track Progress", desc: "Visualize your journey through all 11 chapters." }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700 shadow-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    onClick={onStart}
                    className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Start Learning Now
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
            </div>

            {/* Footer Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 text-slate-400 dark:text-slate-600 text-sm"
            >
                © 2026 IT Passport Study Guide
            </motion.div>
        </div>
    );
};

export default LandingPage;
