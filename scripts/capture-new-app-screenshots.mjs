import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'portfolio/assets/screenshots');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const screenshots = [];
const save = async (page, filename) => {
  await page.screenshot({ path: path.join(output, filename), animations: 'disabled' });
  const size = fs.statSync(path.join(output, filename)).size;
  if (size < 15000) throw new Error(`Unexpectedly small screenshot: ${filename} (${size} bytes)`);
  screenshots.push({ filename, size });
};

try {
  // EDC Pocket: real, locally served source with a fictional saved schedule.
  const edc = await browser.newPage({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  await edc.addInitScript(() => {
    localStorage.setItem('edcpocket_2026_v1', JSON.stringify({
      selected: [1, 5, 18], friendName: 'Sample festival plan', lead: 15, meet: null
    }));
  });
  await edc.goto('http://127.0.0.1:4193/', { waitUntil: 'domcontentloaded' });
  await edc.locator('.set-card').first().waitFor({ timeout: 30000 });
  await edc.waitForTimeout(600);
  await save(edc, 'edc-lineup.png');
  await edc.locator('.nav-btn[data-tab="plan"]').click();
  await edc.locator('.plan-heading').waitFor({ timeout: 15000 });
  await edc.waitForTimeout(300);
  await save(edc, 'edc-plan.png');
  await edc.close();

  // Command: fictional projects and tasks, not the repository's personal starter list.
  const command = await browser.newPage({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  await command.addInitScript(() => {
    const projects = [
      { id: 'reading', title: 'Reading list', category: 'Personal', status: 'active',
        description: 'Keep a short list of books worth reading.', next: 'Choose a book for the weekend.',
        reviewDate: '', updatedAt: '2026-11-06' },
      { id: 'site', title: 'Community website', category: 'Software', status: 'active',
        description: 'Create a mobile-friendly neighborhood guide.', next: 'Review the home page layout.',
        reviewDate: '', updatedAt: '2026-11-06' },
      { id: 'trip', title: 'Weekend trip', category: 'Personal', status: 'active',
        description: 'Plan a short getaway with friends.', next: 'Compare two places to stay.',
        reviewDate: '', updatedAt: '2026-11-06' },
      { id: 'photos', title: 'Photo archive', category: 'Personal', status: 'waiting',
        description: 'Sort and back up old pictures.', next: 'Organize the first folder.',
        reviewDate: '', updatedAt: '2026-11-06' }
    ];
    const tasks = [
      { id: 't1', title: 'Review the website layout', projectId: 'site', status: 'open',
        priority: 'high', dueDate: '', notes: '' },
      { id: 't2', title: 'Choose the next book', projectId: 'reading', status: 'open',
        priority: 'medium', dueDate: '', notes: '' },
      { id: 't3', title: 'Compare places to stay', projectId: 'trip', status: 'open',
        priority: 'medium', dueDate: '', notes: '' },
      { id: 't4', title: 'Sort the first photo folder', projectId: 'photos', status: 'open',
        priority: 'low', dueDate: '', notes: '' },
      { id: 't5', title: 'Write a few project notes', projectId: 'site', status: 'open',
        priority: 'low', dueDate: '', notes: '' }
    ];
    const ideas = [
      { id: 'i1', title: 'Build a small recipe organizer', description: 'Collect favorite dishes.',
        createdAt: '2026-11-06' },
      { id: 'i2', title: 'Learn basic photography', description: 'Try a weekend class.',
        createdAt: '2026-11-06' }
    ];
    localStorage.setItem('command.v1', JSON.stringify({ schemaVersion: 1, projects, tasks, ideas }));
  });
  await command.goto('http://127.0.0.1:4194/', { waitUntil: 'domcontentloaded' });
  await command.locator('.page-title').waitFor({ timeout: 30000 });
  await command.locator('.project-card').first().waitFor({ timeout: 15000 });
  await command.waitForTimeout(350);
  await save(command, 'command-home.png');
  await command.locator('.tab[data-view="projects"]').click();
  await command.locator('.project-card').first().waitFor({ timeout: 15000 });
  await command.waitForTimeout(250);
  await save(command, 'command-projects.png');
  await command.close();
  for (const screenshot of screenshots) console.log('Captured', screenshot.filename, screenshot.size, 'bytes');
} finally {
  await browser.close();
}
