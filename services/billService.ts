import { BillDetails } from '../types';

export const fetchBillDetails = async (ukscNo: string): Promise<BillDetails> => {
  // NOTE: In a real browser environment, directly fetching from tgsouthernpower.org 
  // will likely be blocked by CORS unless they have set specific headers.
  // We will simulate a fetch delay and return mock data that looks realistic.
  // If the API was CORS-friendly, we would use fetch() here.
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  // Randomize slightly for demo purposes so different IDs look different
  const randomAmount = Math.floor(Math.random() * 5000) + 500;
  const randomUnits = Math.floor(randomAmount / 5);
  const isPaid = Math.random() > 0.3;

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 15);

  return {
    ukscNo,
    billingDate: today.toLocaleDateString(),
    dueDate: dueDate.toLocaleDateString(),
    amount: randomAmount,
    unitsConsumed: randomUnits,
    status: isPaid ? 'Paid' : 'Pending',
    fetchedAt: new Date().toISOString(),
  };
};
