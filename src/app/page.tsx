import { redirect } from 'next/navigation'

export default function Home() {
  // Şimdilik direkt login sayfasına atıyoruz
  redirect('/login')
}