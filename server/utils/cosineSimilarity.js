const cosineSimilarity = (a, b) => {

  // SAFETY CHECK
  if (!a || !b || a.length !== b.length) {
    return 0;
  }

  // DOT PRODUCT
  const dotProduct = a.reduce(
    (sum, value, index) => {
      return sum + value * b[index];
    },
    0
  );

  // MAGNITUDE OF VECTOR A
  const magnitudeA = Math.sqrt(
    a.reduce((sum, value) => {
      return sum + value * value;
    }, 0)
  );

  // MAGNITUDE OF VECTOR B
  const magnitudeB = Math.sqrt(
    b.reduce((sum, value) => {
      return sum + value * value;
    }, 0)
  );

  // AVOID DIVIDE BY ZERO
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  // COSINE SIMILARITY
  return dotProduct / (magnitudeA * magnitudeB);
};

module.exports = cosineSimilarity;