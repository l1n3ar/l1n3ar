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
        className: "bg-pink-100 border-pink-400",
        type: 'Complete',
      },
    },
  ]

  return (
    <div className="h-full w-full relative">
      <LabCanvas items={items} initialPositions={positions} />
    </div>
  )

}

export default Lab
