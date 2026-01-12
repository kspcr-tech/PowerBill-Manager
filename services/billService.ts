import { Bill } from '../types';

export const fetchBillFromSource = async (ukscNo: string): Promise<Bill> => {
  // Simulator to mimic real fetching since direct cross-origin fetches are blocked
  // In a real app with a proxy, you'd fetch: https://tgsouthernpower.org/billinginfo?ukscno=${ukscNo}
  await new Promise(r => setTimeout(r, 1000));
  
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 10);

  return {
    amount: Math.floor(Math.random() * 4500) + 400,
    units: Math.floor(Math.random() * 500) + 50,
    date: today.toLocaleDateString('en-IN'),
    dueDate: dueDate.toLocaleDateString('en-IN'),
    status: Math.random() > 0.5 ? 'Paid' : 'Unpaid'
  };
};