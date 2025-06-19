import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../config/setup';

test('雪球手机号登录发送验证码', async ({ page }) => {
  await page.goto('https://xueqiu.com/');
  // 等待“验证码登录”tab出现
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  // 点击“发送验证码”
  await page.getByText('').click();
  await page.getByText('发送验证码', { exact: true }).first().click();
  // 检查验证码输入框可见，说明验证码已发送
  await page.getByText('重新发送').first().click();
});