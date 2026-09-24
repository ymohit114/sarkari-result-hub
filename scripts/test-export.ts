import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const appDir = path.join(process.cwd(), 'app');
const apiDir = path.join(appDir, 'api');
const tempApiDir = path.join(process.cwd(), '.temp_api');

const adminDir = path.join(appDir, 'admin');
const tempAdminDir = path.join(process.cwd(), '.temp_admin');

try {
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, tempApiDir);
    console.log('Moved app/api to temporary location.');
  }

  if (fs.existsSync(adminDir)) {
    fs.renameSync(adminDir, tempAdminDir);
    console.log('Moved app/admin to temporary location.');
  }

  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true, force: true });
    console.log('Cleaned .next cache.');
  }

  console.log('Running static export build...');
  execSync('npm run build', {
    stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES: 'true' },
  });
  console.log('✅ Static export build succeeded!');
} catch (error) {
  console.error('Build error:', error);
} finally {
  if (fs.existsSync(tempApiDir)) {
    fs.renameSync(tempApiDir, apiDir);
    console.log('Restored app/api.');
  }
  if (fs.existsSync(tempAdminDir)) {
    fs.renameSync(tempAdminDir, adminDir);
    console.log('Restored app/admin.');
  }
}
