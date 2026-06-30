import { redirect } from 'next/navigation'

interface PageProps {
  params: { id: string }
}

export default function AnimalPage({ params }: PageProps) {
  redirect(`/adopcion/${params.id}`)
}
