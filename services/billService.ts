import { Bill } from '../types';

/**
 * NOTE ON CORS:
 * Browsers block direct scripts from fetching data from external domains (like tgsouthernpower.org)
 * unless the server explicitly allows it. For a static GitHub Pages site, we use a simulator
 * but provide the direct link for the user to verify.
 */
export const fetchBillFromSource = async (ukscNo: string): Promise<Bill> => {
  console.log(`Attempting to simulate fetch for UKSC: ${ukscNo}`);
  
  // Artificial delay for realism
  await new Promise(r => setTimeout(r, 1200));
  
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 15);

  // Generate deterministic but realistic data based on the UKSC number
  const seed = parseInt(ukscNo.slice(-4)) || 500;
  const amount = (seed % 3000) + 450;
  const units = Math.floor(amount / 7);

  return {
    amount: amount,
    units: units,
    date: today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    dueDate: dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: seed % 2 === 0 ? 'Paid' : 'Unpaid'
  };
};