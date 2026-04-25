import { GetServerSideProps } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default function Dashboard({ email }: { email: string }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
      <p className="text-gray-400">{email}</p>
      <p className="text-green-400 mt-4 text-sm">✓ Auth working</p>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { redirect: { destination: '/auth', permanent: false } }
  }
  return { props: { email: session.user.email ?? '' } }
}
