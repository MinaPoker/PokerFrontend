import FrameBox from './frame-box'
import StyledButton from './styled-button'

export default function Daily({ onClose }) {
 
  return (
    <FrameBox
      title={
        <div className='bg-[url("/title-dialy.png")] bg-no-repeat bg-top h-[96px] -translate-y-1/2'></div>
      }
      onClose={onClose} 
    >
      // Main content area of the Daily component
      <div className='w-[540px] m-10 text-center text-white'>
        // Content to be displayed goes here
      </div>
      // Footer area of the component
      <div className='flex justify-center'>
        // Additional elements or buttons can be placed here
      </div>
    </FrameBox>
  )
}
