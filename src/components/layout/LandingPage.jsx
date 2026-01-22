import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LandingPage = ({ onStart }) => {
    // Generate sakura petals
    const petals = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
        size: Math.random() * 10 + 10,
    }));

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-zen-bg text-zen-ink font-serif selection:bg-zen-sakuraDark selection:text-zen-ink">

            {/* Sakura Background Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {petals.map((petal, i) => (
                    <div
                        key={petal.id}
                        className="absolute top-[-10%]"
                        style={{
                            left: petal.left,
                            width: `${petal.size}px`,
                            height: `${petal.size}px`,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f9a8d4'%3E%3Cpath d='M12 2C8 2 6 5 6 9C6 14 11 18 12 22C13 18 18 14 18 9C18 5 16 2 12 2Z'/%3E%3C/svg%3E")`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            animationName: 'sakuraFall',
                            animationDuration: petal.animationDuration,
                            animationDelay: petal.animationDelay,
                            animationIterationCount: 'infinite',
                            animationTimingFunction: 'linear',
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">

                {/* Vertical Text (Tategaki style hint) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 2 }}
                    className="absolute top-10 right-10 md:right-20 text-6xl md:text-8xl font-serif pointer-events-none select-none hidden md:block"
                    style={{ writingMode: 'vertical-rl' }}
                >
                    合格
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="mb-12"
                >
                    <div className="mb-6 mx-auto w-16 h-16 border-2 border-zen-ink/10 rounded-full flex items-center justify-center">
                        <span className="font-serif text-2xl text-zen-ink/80">I</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-widest mb-4 leading-relaxed text-zen-ink">
                        ITパスポート<br />
                        <span className="text-zen-ink/80">試験</span>
                        <span className="text-zen-sakuraDark mx-2">●</span>
                        <span className="text-zen-ink/80">合格ガイド</span>
                    </h1>

                    <div className="w-20 h-[1px] bg-zen-ink/20 mx-auto my-8" />

                    <p className="text-sm md:text-base text-zen-ink/60 max-w-md mx-auto tracking-widest leading-loose">
                        知識を深め、未来を切り拓く。<br />
                        あなたのための、最もシンプルな学習体験。
                    </p>
                </motion.div>

                {/* Minimal CTA Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, backgroundColor: '#fce7f3' }} // Light pink hover
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onClick={onStart}
                    className="group relative px-10 py-3 bg-transparent border border-zen-ink/30 rounded-full overflow-hidden transition-all duration-300"
                >
                    <span className="relative z-10 flex items-center gap-4 font-serif text-zen-ink tracking-widest">
                        学習を開始する
                        <ArrowRight className="w-4 h-4 text-zen-ink/40 group-hover:translate-x-1 group-hover:text-zen-ink transition-all" />
                    </span>
                </motion.button>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 text-xs text-zen-ink/30 tracking-[0.2em] font-serif"
            >
                EST. 2026
            </motion.div>
        </div>
    );
};

export default LandingPage;
