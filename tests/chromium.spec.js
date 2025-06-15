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

// test("Boss直聘", async ({ page }) => {
//   await page.goto("https://www.zhipin.com/web/user/");
//   await page.getByRole("textbox", { name: "手机号" }).click();
//   await page.getByRole("textbox", { name: "手机号" }).fill(ENV_CONFIG.TARGET_TEL_NUM);
//   await page.getByRole("checkbox").check();
//   await page.getByText("发送验证码").click();

//   // 检查是否弹出滑动/点选验证码验证区域
//   const verifyPopup = page.locator('text=请在下图依次点击：');
//   if (await verifyPopup.isVisible({ timeout: 3000 })) {
//     // 如果弹出，尝试点击“关闭验证”按钮
//     const closeBtn = page.getByRole('button', { name: '关闭验证' });
//     if (await closeBtn.isVisible({ timeout: 2000 })) {
//       await closeBtn.click();
//     } else {
//       // 或等待用户手动处理，或等待验证区域消失
//       await page.waitForSelector('text=请在下图依次点击：', { state: 'detached', timeout: 10000 });
//     }
//   }

//   // 验证区域关闭后再继续
//   await page.getByText(/获取验证码|点击按钮进行验证|点击完成验证/).click({ timeout: 5000 });
//   // “已发送”可能不会出现，建议用可见性断言而不是点击
//   await expect(page.getByText('已发送')).toBeVisible({ timeout: 5000 });
// });

test('抖音', async ({ page }) => {
  await page.goto('https://www.douyin.com');
  await page.getByRole('textbox', { name: '请输入手机号' }).click();
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByText('获取验证码').click();
});


test('快手', async ({ page }) => {
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


test('豌豆荚', async ({ page }) => {
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

test('澎湃新闻手机号登录发送验证码', async ({ page }) => {
  test.setTimeout(20000);
  await page.goto('https://www.thepaper.cn/newsDetail_forward_28627857');
  // 点击右上角登录
  await page.getByText('登录').click();
  // 等待登录弹窗出现
  await expect(page.getByRole('textbox', { name: '输入手机号' })).toBeVisible({ timeout: 5000 });
  // 输入手机号
  await page.getByRole('textbox', { name: '输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  // 点击获取验证码
  await page.getByRole('button', { name: '获取验证码' }).click();
  // 可选：断言验证码输入框出现
  await expect(page.getByRole('textbox', { name: '输入验证码' })).toBeVisible({ timeout: 5000 });
});

test('百度', async ({ page }) => {
  await page.goto('https://www.baidu.com/');
  await page.getByRole('link', { name: '登录' }).click();
  await page.getByText('短信登录').click();
  await w({ page });
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByRole('checkbox', { name: '阅读并接受' }).check();
  await page.getByRole('button', { name: '发送验证码' }).click();
  await w({ page });
  await page.getByRole('button', { name: '立即注册' }).click();
  await expect(page.getByText('59')).toBeVisible();
});

test('天猫', async ({ page }) => {
  await page.goto('https://login.taobao.com/havanaone/login/login.htm?bizName=taobao');
  await page.getByRole('link', { name: '短信登录' }).click();
  await page.getByRole('textbox', { name: '请输入手机号' }).click();
  await w({ page });
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByRole('link', { name: '获取验证码' }).click();
  await w({ page });
  await expect(page.getByText('重发')).toBeVisible();
});

test('凤凰网', async ({ page }) => {
  await page.goto('https://user.ifeng.com/register');
  await page.getByRole("textbox", { name: "手机号" })
    .fill(ENV_CONFIG.TARGET_TEL_NUM);
  await page.getByText('获取验证码', { exact: true }).click();
  await expect(page.getByText('重新获取')).toBeVisible();
});

test('夸克网盘', async ({ page }) => {
  test.setTimeout(10000); // 设置测试超时时间为 10 秒
  // 1. 访问夸克网盘
  await page.goto('https://pan.quark.cn/');

  // 2. 点击"手机登录"按钮
  await page.getByText('手机登录').click();

  // 3. 切换到 iframe, 输入手机号
  const frame = page.frameLocator('iframe');
  await frame.getByRole('textbox', { name: '手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);

  // 4. 点击"获取短信验证码"按钮
  await frame.getByText('获取短信验证码').click();

  // 5. 检查倒计时出现, 说明验证码已发送
  await expect(page.locator('iframe').contentFrame().getByText('获取短信验证码 (57)s')).toBeVisible();
});

test('迅雷云盘', async ({ page }) => {
  // 1. 访问迅雷云盘登录页
  await page.goto('https://pan.xunlei.com/login');

  // 2. 切换到登录 iframe
  const frame = page.frameLocator('iframe');

  // 3. 输入手机号
  await frame.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);

  // 4. 点击“获取验证码”按钮
  await frame.getByText('获取验证码').click();

  // 5. 检查验证码倒计时或验证码输入框可见，说明验证码已发送
  await expect(frame.getByRole('textbox', { name: '请输入验证码' })).toBeVisible();
});

test('知乎', async ({ page }) => {
  // 1. 访问知乎登录页
  await page.goto('https://www.zhihu.com/signin');

  // 2. 选择“验证码登录”tab（如果未默认选中）
  await page.getByRole('button', { name: '验证码登录' }).click();

  // 3. 输入手机号
  await page.getByRole('textbox', { name: '' }).first().fill(ENV_CONFIG.TARGET_TEL_NUM);

  // 4. 点击“获取短信验证码”按钮
  await page.getByRole('button', { name: '获取短信验证码' }).click();

  // 5. 检查验证码输入框可见，说明验证码已发送
  await expect(page.getByRole('textbox', { name: '' }).nth(1)).toBeVisible();
});

test('夸克AI', async ({ page }) => {
  // 访问夸克AI首页
  await page.goto('https://ai.quark.cn/');
  // 点击右上角登录按钮
  await page.getByText('登录').click();
  // 切换到登录iframe
  const frame = await page.frameLocator('iframe').first();
  // 输入手机号
  await frame.getByPlaceholder('输入手机号码').fill(ENV_CONFIG.TARGET_TEL_NUM);
  // 点击获取验证码
  await frame.getByText('获取验证码').click();
  // 断言验证码输入框可见
  await expect(frame.getByPlaceholder('请输入验证码')).toBeVisible();
})

test('雪球网', async ({ page }) => {
  await page.goto('https://xueqiu.com/');
  // 等待“验证码登录”tab出现
  await page.getByRole('textbox', { name: '请输入手机号' }).fill(ENV_CONFIG.TARGET_TEL_NUM);
  // 点击“发送验证码”
  await page.getByText('').click();
  await page.getByText('发送验证码', { exact: true }).first().click();
  // 检查验证码输入框可见，说明验证码已发送
  await page.getByText('重新发送').first().click();
})