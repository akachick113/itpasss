// Mappings from Legacy App
export const chapterRanges = {
    0: [1, 10],      // 序章: pages 1-10
    1: [11, 54],     // 第1章: pages 11-54
    2: [55, 96],     // 第2章: pages 55-96
    3: [97, 124],    // 第3章: pages 97-124
    4: [125, 174],   // 第4章: pages 125-174
    5: [175, 222],   // 第5章: pages 175-222
    6: [223, 256],   // 第6章: pages 223-256
    7: [257, 278],   // 第7章: pages 257-278
    8: [279, 314],   // 第8章: pages 279-314
    9: [315, 370],   // 第9章: pages 315-370
    10: [371, 390],  // 第10章: pages 371-390
    11: [391, 595]   // 第11章+索引: pages 391-595
};

export const FILE_OFFSET = 16;
export const TOTAL_PAGES = 611;

export const getPagesForChapter = (chapterId) => {
    const range = chapterRanges[chapterId];
    if (!range) return [];

    const startFile = range[0] + FILE_OFFSET;
    const endFile = range[1] + FILE_OFFSET;

    // Create array of page numbers e.g. [17, 18, ... 26]
    return Array.from({ length: endFile - startFile + 1 }, (_, i) => startFile + i);
};

export const getPageId = (pageNum) => {
    return String(pageNum).padStart(4, '0');
};
