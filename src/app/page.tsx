import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/course-apply?step=1')
}
