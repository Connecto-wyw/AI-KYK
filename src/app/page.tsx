import { redirect } from 'next/navigation'

export default function Home() {
  // Automatically redirect ro root /kyk landing
  redirect('/kyk')
}
