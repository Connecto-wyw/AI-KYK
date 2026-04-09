import { Suspense } from 'react'
import TeamDashboardClient from './TeamDashboardClient'

export default async function TeamDashboardPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ teamId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await params
  const resolvedSearch = await searchParams
  
  const isNew = resolvedSearch['new'] === 'true'
  const teamId = resolvedParams.teamId

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold">로딩 중...</div>}>
      <TeamDashboardClient teamId={teamId} isNew={isNew} />
    </Suspense>
  )
}
