// @ts-check
import { expect, test, } from '@playwright/test';
import { ENV_CONFIG } from '../config/setup';

const w = async ({ page, duration = 3000 }) => {
  await page.waitForTimeout(Math.random() * duration);
}

test('阿里云', async ({ page }) => {
  await page.goto('https://account.aliyun.com/register/qr_register.htm');
  await w({ page });
  await page.locator('#alibaba-register-box').contentFrame().getByRole('textbox', { name: '+' }).click();
  await page.locator('#alibaba-register-box').contentFrame().getByRole('textbox', { name: '+' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await w({ page });
  await page.locator('#alibaba-register-box').contentFrame().getByRole('button', { name: '获取验证码' }).click();
});

test('企查查', async ({ page }) => {
  await page.goto('https://www.qcc.com/');
  await page.waitForTimeout(Math.random() * 2000);
  await page.getByRole('button', { name: '登录 | 注册' }).click();
  await page.getByText('其他方式登录').nth(1).click();
  await page.waitForTimeout(Math.random() * 2000);
  await page.locator('div').filter({ hasText: /^打开 企查查APP 或 微信扫一扫登录扫码成功请在APP中点击登录二维码已失效点击刷新登录即表示已阅读并同意《用户协议》和《隐私政策》$/ }).locator('span').nth(2).click();
  await page.getByText('验证码登录', { exact: true }).click();
  await page.getByRole('textbox', { name: '请输入手机号码' }).click();
  await page.getByRole('textbox', { name: '请输入手机号码' }).fill(ENV_CONFIG.TARGET_TEL_NUM)
  await page.getByText('获取验证码').click();
  await expect(page.getByText('重新发送')).toBeVisible();
});

test("Boss直聘", async ({ page }) => {
  await page.goto("https://www.zhipin.com/web/user/");
  await page.getByRole("textbox", { name: "手机号" }).click();
  await page.getByRole("textbox", { name: "手机号" }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByRole("checkbox").check();
  await page.getByText("发送验证码").click();
  await page.locator('.yidun_logo').click();
});

test("抖音", async ({ page }) => {
  await page.goto('https://www.douyin.com');
  await page.getByRole('textbox', { name: '请输入手机号' }).click();
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByText('获取验证码').click();
});


test("快手", async ({ page }) => {
  await page.goto('https://www.kuaishou.com/brilliant');
  await w({ page });
  await page.getByText('登录').click();
  await page.getByText('手机号登录').click();
  await w({ page });
  await page.getByRole('textbox', { name: '请输入手机号' }).click();
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await w({ page });
  await page.getByText('获取验证码').click();
  await expect(page.getByText('60s')).toBeVisible();
});


test("豌豆荚", async ({ page }) => {
  await page.goto('https://www.wandoujia.com/apps/280621');
  await page.locator('#header_avatar').click();
  await w({ page });
  const element = await page.getByText('');
  const box = await element.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 500, box.y + box.height / 2);
    await page.mouse.up();
  }
  await w({ page });
  await page.getByRole('textbox', { name: '请输入手机号码' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await w({ page });
  await page.getByText('获取验证码').click();
  await expect(page.getByText('重新获取')).toBeVisible();
});

test('天猫', async ({ page }) => {
  await page.goto('https://login.taobao.com/havanaone/login/login.htm?bizName=taobao');
  await page.getByRole('link', { name: '短信登录' }).click();
  await page.getByRole('textbox', { name: '请输入手机号' }).click();
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByRole('link', { name: '获取验证码' }).click();
  await expect(page.getByText('重发')).toBeVisible();
});

test('凤凰网', async ({ page }) => {
  await page.goto('https://user.ifeng.com/register');
  await page.getByRole("textbox", { name: "手机号" })
    .fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByText('获取验证码', { exact: true }).click();
  await expect(page.getByText('重新获取')).toBeVisible();
});

test("私募网", async ({ page }) => {
  await page.goto("https://www.simuwang.com/crtUpload?back_url=https://fof.simuwang.com/login&apply_type=0");
  await page.getByRole("textbox", { name: "请输入手机号" }).click();
  await page
    .getByRole("textbox", { name: "请输入手机号" })
    .fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByRole("button", { name: "重发" }).click();
});
