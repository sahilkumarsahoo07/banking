/**
 * Lead Scoring Engine
 * Calculates a score from 0-100 based on financial health
 */
const calculateScore = (data) => {
  let score = 0;

  const { loanAmount, annualIncome, existingEmis, turnover, businessType } = data;

  if (!annualIncome || annualIncome === 0) return 0;

  // 1. FOIR Score (Lower is better)
  const monthlyIncome = annualIncome / 12;
  const foir = (existingEmis / monthlyIncome) * 100;
  
  if (foir < 30) score += 40;
  else if (foir < 50) score += 25;
  else if (foir < 65) score += 10;

  // 2. Income vs Loan Multiplier
  const multiplier = loanAmount / annualIncome;
  if (multiplier < 3) score += 30;
  else if (multiplier < 5) score += 15;
  else if (multiplier < 8) score += 5;

  // 3. Turnover Score
  if (turnover > 10000000) score += 30; // 1Cr+
  else if (turnover > 5000000) score += 20; // 50L+
  else if (turnover > 2000000) score += 10; // 20L+

  // 4. Business Type Bonus
  if (businessType === 'pvt_ltd') score += 5;
  if (businessType === 'llp') score += 3;

  return Math.min(100, score);
};

module.exports = { calculateScore };
