import { redirect } from 'next/navigation'
import { auth } from "@/auth"
import { Navbar } from '@/components/navigation/Navbar'
import { Session } from 'next-auth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth() as Session | null

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
