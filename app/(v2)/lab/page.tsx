import { getLabPositions } from "@/actions/lab"
import { LabCanvas } from "@/components/v2/lab/lab-canvas"
import type { LabItemConfig } from "@/data/lab-registry"

const Lab = async () => {
  const positions = await getLabPositions()

  const items: LabItemConfig[] = [
    {
      id: '001',
      component: 'sticky-note',
      defaultPosition: { x: 160, y: 160 },
      props: {
        content: "MCP serverize this portfolio",
        className: "bg-yellow-100 border-yellow-400",
        type: 'In Progress',
      },
    },
  ]

  return <LabCanvas items={items} initialPositions={positions} />
}

export default Lab
