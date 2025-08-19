import fs from 'fs';
import path from 'path';

const dashboards = [
  {
    file: 'src/components/dashboards/BusinessAdministrationDashboard.tsx',
    department: 'business-administration'
  },
  {
    file: 'src/components/dashboards/DigitalMarketingDashboard.tsx', 
    department: 'digital-marketing'
  },
  {
    file: 'src/components/dashboards/ProjectDashboard.tsx',
    department: 'project'
  },
  {
    file: 'src/components/dashboards/SecretariatDashboard.tsx',
    department: 'secretariat'
  }
];

dashboards.forEach(({ file, department }) => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find and replace the DashboardThemeWrapper usage
    const oldPattern = /<DashboardThemeWrapper\s+title=/;
    const newPattern = `<DashboardThemeWrapper\n      department="${department}"\n      title=`;
    
    if (content.includes('<DashboardThemeWrapper') && !content.includes(`department="${department}"`)) {
      content = content.replace(oldPattern, newPattern);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Updated ${file} with department="${department}"`);
    } else {
      console.log(`⚠️ ${file} already has department prop or pattern not found`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
});

console.log('\n🎉 Dashboard prop updates completed!');
