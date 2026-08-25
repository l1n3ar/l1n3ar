import StickyNote from "@/components/v2/lab/sticky-note"

const Lab = () => {
  return (
    <div className='h-full w-full flex items-center justify-center '>
      <StickyNote
        id='001'
        // title='MCP serverize'
        content="turn this page into MCP server"
        className="bg-yellow-100 border-yellow-400"
        type='Complete'
      />

    </div>
  )
}

export default Lab