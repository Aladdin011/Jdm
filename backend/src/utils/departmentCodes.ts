/**
 * Utility for generating and managing unique 5-digit department codes
 */

// Define base codes for each department
const departmentBaseCodes: Record<string, number> = {
  'secretariat-admin': 10000,
  'business-development': 20000,
  'project-management': 30000,
  'accounting': 40000,
  'human-resources': 50000,
  'digital-marketing': 60000,
  'business-administration': 70000
};

/**
 * Generate a unique 5-digit department code for a specific department
 * @param department The department name
 * @returns A unique 5-digit code for the department
 */
export function generateDepartmentCode(department: string): string {
  // Get the base code for the department or use 90000 for unknown departments
  const base = departmentBaseCodes[department] || 90000;
  
  // Generate a random offset between 0 and 999 to ensure uniqueness
  const randomOffset = Math.floor(Math.random() * 1000);
  
  // Combine base and offset, then ensure it's exactly 5 digits
  return String(base + randomOffset).slice(0, 5);
}

/**
 * Get a list of all departments with their base codes
 * @returns An object mapping department names to their base codes
 */
export function listAllDepartmentCodes(): Record<string, number> {
  return { ...departmentBaseCodes };
}

/**
 * Get the display name for a department
 * @param department The department ID
 * @returns The human-readable department name
 */
export function getDepartmentDisplayName(department: string): string {
  const displayNames: Record<string, string> = {
    'secretariat-admin': 'Secretariat & Administration',
    'business-development': 'Business Development',
    'project-management': 'Project Management',
    'accounting': 'Accounting & Finance',
    'human-resources': 'Human Resources',
    'digital-marketing': 'Digital Marketing',
    'business-administration': 'Business Administration'
  };

  return displayNames[department] || department.replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}