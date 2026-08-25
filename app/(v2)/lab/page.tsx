import { getLabPositions } from "@/actions/lab"
import { LabCanvas, type LabItem } from "@/components/v2/lab/lab-canvas"
import StickyNote from "@/components/v2/lab/sticky-note"

const Lab = async () => {
  const positions = await getLabPositions()

  const items: LabItem[] = [
    {
      id: 'sticky-mcp',
      defaultPosition: { x: 160, y: 160 },
      element: (
        <StickyNote
          id='001'
          content="MCP serverize this portfolio"
          className="bg-pink-100 border-pink-400"
          type='Complete'
        />
      ),
    },
  ]

  return (
    <div className=" h-full w-full">
      <LabCanvas items={items} initialPositions={positions} />
    </div>
  )

}

export default Lab
