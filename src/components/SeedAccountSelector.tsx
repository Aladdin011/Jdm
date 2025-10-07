import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SeedAccount } from '@/data/SeedAccounts';
import { toast } from 'sonner';

interface SeedAccountSelectorProps {
  onSelect?: (account: SeedAccount) => void;
}

const SeedAccountSelector: React.FC<SeedAccountSelectorProps> = ({ onSelect }) => {
  const { getSeedAccounts, loginWithSeedAccount } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  
  const seedAccounts = getSeedAccounts();
  
  // Filter accounts by department if a department is selected
  const filteredAccounts = selectedDepartment === 'all' 
    ? seedAccounts 
    : seedAccounts.filter(account => 
        account.department.toLowerCase().includes(selectedDepartment.toLowerCase()) ||
        account.dashboard.toLowerCase().includes(selectedDepartment.toLowerCase())
      );
  
  // Get unique departments for the filter dropdown
  const departments = ['all', ...new Set(seedAccounts.map(account => account.department))];
  
  const handleLoginWithSeed = async (account: SeedAccount) => {
    if (onSelect) {
      onSelect(account);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await loginWithSeedAccount(account.email);
      if (result.success) {
        toast.success(`Logged in as ${account.firstName} ${account.lastName}`);
      } else {
        toast.error(result.error || 'Failed to login with seed account');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error('Seed account login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        Test Accounts
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1 border-b border-gray-200 px-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Seed Accounts</h3>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Quick access test accounts for each dashboard</p>
          </div>
          <div className="py-1 max-h-96 overflow-y-auto">
            {filteredAccounts.map((account) => (
              <div key={account.id} className="px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.firstName} {account.lastName}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {account.department}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {account.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{account.description}</p>
                  </div>
                  <button
                    onClick={() => handleLoginWithSeed(account)}
                    disabled={isLoading}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Use'}
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-xs">
                    <span className="font-medium text-gray-700">Email:</span> {account.email}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium text-gray-700">Password:</span> {account.password}
                  </div>

                  <div className="text-xs">
                    <span className="font-medium text-gray-700">Dashboard:</span> {account.dashboard}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="py-1 border-t border-gray-200 px-4">
            <p className="text-xs text-gray-500">These accounts are for testing purposes only</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeedAccountSelector;