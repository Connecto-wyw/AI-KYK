import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const results: Record<string, unknown> = {}

  // 1. 환경변수 확인
  results.env = {
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    TOSS_CLIENT_KEY: !!process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    TOSS_SECRET_KEY: !!process.env.TOSS_SECRET_KEY,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || '(not set)',
  }

  // 2. 테이블 존재 여부 확인
  const service = createServiceClient()
  const tables = ['products', 'teams', 'team_members', 'orders', 'payments']
  const tableStatus: Record<string, unknown> = {}

  for (const table of tables) {
    const { error } = await service.from(table).select('id').limit(1)
    tableStatus[table] = error ? `ERROR: ${error.message}` : 'OK'
  }
  results.tables = tableStatus

  // 3. products 시드 데이터 확인
  const { data: products, error: prodError } = await service
    .from('products')
    .select('id, name_ko')
    .in('id', [1, 2, 3])

  results.products = prodError
    ? `ERROR: ${prodError.message}`
    : (products?.length ? products : 'EMPTY - 시드 데이터 없음')

  return NextResponse.json(results, { status: 200 })
}
