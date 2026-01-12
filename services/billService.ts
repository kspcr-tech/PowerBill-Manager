import { Bill } from '../types';

/**
 * Browsers block direct scripts from fetching data from external domains (CORS)
 * unless explicitly allowed. This service handles simulated data with realistic
 * behavior for GitHub Pages deployment.
 */
export const fetchBillFromSource = async (ukscNo: string): Promise<Bill> => {
  console.log(`Querying billing info for UKSC: ${ukscNo}`);
  
  // Realism delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);

  // Deterministic but realistic generation
  const seed = parseInt(ukscNo.slice(-3)) || 123;
  const amount = (seed * 1.5) + 300;
  const units = Math.floor(amount / 6.5);

  return {
    amount: Math.round(amount),
    units: units,
    date: today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    dueDate: dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: (seed % 3 === 0) ? 'Paid' : 'Unpaid'
  };
};