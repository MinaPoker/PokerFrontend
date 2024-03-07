export default function FrameBox({
  children,
  showClose = true,
  title,
  onClose,
}) {
  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-black/50 z-50 flex justify-center items-center'>

      <div className='rounded-xl relative'>

        <div className='min-w-[300px] max-w-[1100px] min-h-[10px] max-h-[480px] bg-[url("/table.png")] bg-[center_-20px]
          border-[#edc281] border-4
          overflow-hidden rounded-xl shadow-[0_6px_0_0_#c1862d]'>
          {children}
          {/* Render the children elements passed to the FrameBox */}
        </div>

        {/* Title display area, non-interactive */}
        <div className='absolute top-0 left-0 w-full pointer-events-none'>
          {title}
          {/* Display the title of the FrameBox */}
        </div>

        {/* Conditional rendering of the close button */}
        {showClose && (
          <div
            className='absolute -right-7 -top-7 w-14 h-14 cursor-pointer bg-no-repeat bg-center bg-[url("/close-icon.png")]'
            onClick={handleCloseClick}
          // Close button with custom icon, positioned outside the top-right corner of the FrameBox
          ></div>
        )}
      </div>
    </div>
  );
}
