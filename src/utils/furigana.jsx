/**
 * Furigana Utility for parsing and creating ruby tags
 * Fixed to prevent duplicate annotations on overlapping terms
 */

export const createRuby = (kanji, reading) => {
    if (!reading) return kanji;
    return `<ruby>${kanji}<rt>${reading}</rt></ruby>`;
};

export const parseText = (text, terms) => {
    if (!text || !terms || terms.length === 0) return text || '';

    // Sort terms by length (descending) to match longest phrases first
    const sortedTerms = [...terms].sort((a, b) => (b.kanji?.length || 0) - (a.kanji?.length || 0));

    // Create a map to track which positions have already been processed
    // This prevents overlapping replacements (e.g., 国家試験 containing 試験)
    let result = text;
    const processedRanges = [];

    sortedTerms.forEach(term => {
        if (!term.kanji || !term.reading) return;

        const kanji = term.kanji;
        const ruby = createRuby(kanji, term.reading);

        // Find all occurrences of this kanji in the ORIGINAL text
        let searchIndex = 0;
        let newResult = '';
        let lastIndex = 0;

        // We need to work on the current result, but check against original positions
        // Simple approach: only replace if the kanji is not inside an existing <ruby> tag
        const tempResult = result;
        let match;
        const regex = new RegExp(kanji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

        while ((match = regex.exec(tempResult)) !== null) {
            const matchStart = match.index;
            const matchEnd = matchStart + kanji.length;

            // Check if this match is inside a <ruby> tag
            const beforeMatch = tempResult.substring(0, matchStart);
            const rubyTagsOpened = (beforeMatch.match(/<ruby>/g) || []).length;
            const rubyTagsClosed = (beforeMatch.match(/<\/ruby>/g) || []).length;

            // If we're inside a ruby tag (more opens than closes), skip this match
            if (rubyTagsOpened > rubyTagsClosed) {
                continue;
            }

            // Also skip if this exact position overlaps with already processed ranges
            const isOverlapping = processedRanges.some(range =>
                (matchStart >= range.start && matchStart < range.end) ||
                (matchEnd > range.start && matchEnd <= range.end)
            );

            if (!isOverlapping) {
                processedRanges.push({ start: matchStart, end: matchEnd });
            }
        }

        // Now do the actual replacement, but skip matches inside ruby tags
        result = tempResult.replace(regex, (match, offset) => {
            const beforeMatch = tempResult.substring(0, offset);
            const rubyTagsOpened = (beforeMatch.match(/<ruby>/g) || []).length;
            const rubyTagsClosed = (beforeMatch.match(/<\/ruby>/g) || []).length;

            // If inside a ruby tag, don't replace
            if (rubyTagsOpened > rubyTagsClosed) {
                return match;
            }

            return ruby;
        });
    });

    return result;
};

// React component version
export const FuriganaText = ({ text, terms }) => {
    const html = parseText(text, terms);
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};
