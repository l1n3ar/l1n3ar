import StickyNote from "@/components/v2/lab/sticky-note"

const Lab = () => {
  return (
    <div className='h-full w-full flex items-center justify-center '>
      <StickyNote
        title="MCP Server"
        id='001'
        content="Turning this into an MCP server Turning this into an MCP server Turning this into an MCP server Turning this into an MCP server"
        className="bg-green-300 border rounded-lg"
        type='To-Do'
      />

    </div>
  )
}

export default Lab