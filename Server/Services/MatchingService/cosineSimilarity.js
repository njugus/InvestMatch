
//function to compute cosine similarity
const cosineSimilarity = (a, b) => {
    let dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    let magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    let magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return magA && magB ? dotProduct / (magA * magB) : 0; // Avoid division by zero
};


export default cosineSimilarity;
