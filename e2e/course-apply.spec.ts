import { test, expect } from '@playwright/test'

const BASE = '/course-apply'

test.describe('수강 신청 폼 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}?step=1`)
  })

  // ─── Step 1 ───────────────────────────────────────────────────────────

  test('Step 1: 필수값 미입력 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.getByRole('button', { name: '다음' }).click()
    await expect(page.getByText('이름은 2자 이상이어야 합니다.')).toBeVisible()
    await expect(page.getByText('올바른 이메일 형식이 아닙니다.')).toBeVisible()
    await expect(page.getByText('전화번호는 숫자 10~11자리여야 합니다.')).toBeVisible()
    await expect(page.getByText('나이대를 선택해주세요.')).toBeVisible()
  })

  test('Step 1: 유효한 값 입력 후 Step 2로 이동한다', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await expect(page).toHaveURL(/step=2/)
    await expect(page.getByText('Step 2. 수강 정보')).toBeVisible()
  })

  // ─── Step 2 ───────────────────────────────────────────────────────────

  test('Step 2: 수강 목적이 기타일 때 기타 입력 필드가 표시된다', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=2/)

    await page.selectOption('#courseGoal', '기타')
    await expect(page.getByPlaceholder('수강 목적을 직접 입력해주세요.')).toBeVisible()
  })

  test('Step 2: 수강 목적이 기타에서 다른 값으로 변경되면 기타 필드가 사라진다', async ({
    page,
  }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=2/)

    await page.selectOption('#courseGoal', '기타')
    await page.getByPlaceholder('수강 목적을 직접 입력해주세요.').fill('테스트')
    await page.selectOption('#courseGoal', '취업')
    await expect(page.getByPlaceholder('수강 목적을 직접 입력해주세요.')).not.toBeVisible()
  })

  test('Step 2: 수강 경험 있음 선택 시 기존 수강 강의명 입력 필드가 표시된다', async ({
    page,
  }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=2/)

    await page.getByLabel('있음').check()
    await expect(page.getByPlaceholder('이전에 수강한 강의명을 입력해주세요.')).toBeVisible()
  })

  // ─── 뒤로가기 시 입력값 유지 ───────────────────────────────────────────

  test('이전 단계로 돌아가도 입력값이 유지된다', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=2/)

    await page.getByRole('button', { name: '이전' }).click()
    await page.waitForURL(/step=1/)

    await expect(page.locator('#name')).toHaveValue('홍길동')
    await expect(page.locator('#email')).toHaveValue('test@example.com')
  })

  // ─── 전체 흐름 ─────────────────────────────────────────────────────────

  test('정상적인 수강 신청 완료 흐름이 동작한다', async ({ page }) => {
    // Step 1
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=2/)

    // Step 2
    await page.waitForSelector('#courseId option:not([value=""])')
    await page.selectOption('#courseId', { index: 1 })
    await page.selectOption('#courseGoal', '자기계발')
    await page.getByLabel('없음').check()
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=3/)

    // Step 3 — 확인 화면
    await expect(page.getByText('Step 3. 신청 확인')).toBeVisible()
    await expect(page.getByText('홍길동')).toBeVisible()

    await page.getByRole('button', { name: '신청 완료' }).click()
    await page.waitForURL(/step=complete/)

    await expect(page.getByText('수강 신청이 완료되었습니다.')).toBeVisible()
    await expect(page.getByText('신청 번호')).toBeVisible()
  })

  // ─── 완료 화면 → 처음으로 ──────────────────────────────────────────────

  test('처음으로 돌아가기 버튼을 클릭하면 Step 1로 이동하고 폼이 초기화된다', async ({
    page,
  }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=2/)
    await page.waitForSelector('#courseId option:not([value=""])')
    await page.selectOption('#courseId', { index: 1 })
    await page.selectOption('#courseGoal', '취업')
    await page.getByLabel('없음').check()
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=3/)
    await page.getByRole('button', { name: '신청 완료' }).click()
    await page.waitForURL(/step=complete/)

    await page.getByRole('button', { name: '처음으로 돌아가기' }).click()
    await page.waitForURL(/step=1/)
    await expect(page.locator('#name')).toHaveValue('')
  })

  // ─── 브라우저 뒤로가기 ─────────────────────────────────────────────────

  test('브라우저 뒤로가기 버튼이 이전 스텝으로 이동한다', async ({ page }) => {
    await fillStep1(page)
    await page.getByRole('button', { name: '다음' }).click()
    await page.waitForURL(/step=2/)

    await page.goBack()
    await expect(page).toHaveURL(/step=1/)
  })
})

async function fillStep1(page: import('@playwright/test').Page) {
  await page.fill('#name', '홍길동')
  await page.fill('#email', 'test@example.com')
  await page.fill('#phone', '01012345678')
  await page.selectOption('#ageGroup', '20대')
}
