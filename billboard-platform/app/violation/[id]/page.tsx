import { ViolationDetailPage } from "@/components/pages/violation-detail-page"

interface ViolationPageProps {
  params: {
    id: string
  }
}

export default function ViolationPage({ params }: ViolationPageProps) {
  return <ViolationDetailPage violationId={params.id} />
}
