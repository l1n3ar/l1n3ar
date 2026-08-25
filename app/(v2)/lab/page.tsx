import { getLabPositions } from "@/actions/lab"
import { LabCanvas } from "@/components/v2/lab/lab-canvas"

const Lab = async () => {
  const positions = await getLabPositions()
  return <LabCanvas initialPositions={positions} />
}

export default Lab
