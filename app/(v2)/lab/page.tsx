import { getLabPositions } from "@/actions/lab"
import { LabBoard } from "@/components/v2/lab/lab-board"

const Lab = async () => {
  const positions = await getLabPositions()
  return <LabBoard initialPositions={positions} />
}

export default Lab
