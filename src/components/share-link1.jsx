import FrameBox from './frame-box'
import StyledButton from './styled-button'
import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default function ShareLink1({ onClose }) {
  const [ url, setUrl ] = useState(null) 
  const [ copyed, setCopyed ] = useState(false) 

  useEffect(() => {
    const currentUrl = new URL(location.href)
    const shareUrl = new URL(location.pathname, location.origin)
    shareUrl.searchParams.set('gameId', currentUrl.searchParams.get('gameId'))
    setUrl(shareUrl.toString()) 
  }, [])

  return (
    <FrameBox
      title={<div className='title-styling'></div>} 
      onClose={onClose} 
    >
      <div className='content-container'>
        <h4 className='heading'>Match created!</h4>
        <p>Instructions for sharing the match.</p>
        <p><img className='icon' src='/share-link-icon.png'/></p>
        <p>Information about the match accessibility.</p>
        <p className='share-link'>
          <CopyToClipboard text={url} onCopy={() => {
            setCopyed(true); 
            setTimeout(() => setCopyed(false), 3000) 
          }}>
            <a className='link'>{url}</a> 
          </CopyToClipboard>
        </p>
      </div>
      <div className='button-container'>
        <CopyToClipboard text={url} onCopy={() => {
          setCopyed(true);
          setTimeout(() => setCopyed(false), 3000)
        }}>
          <StyledButton className='button-style'><div className='button-text'>{copyed ? 'COPYED' : 'COPY LINK' }</div></StyledButton>
        </CopyToClipboard>
      </div>
    </FrameBox>
  )
}
