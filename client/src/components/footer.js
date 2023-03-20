import React from 'react'

function Footer() {
  return (
    <>
    
    <div className='footer' style={{display :'flex '}}>
      <hr/>
      <div style={{ flex: '1', paddingRight: '20px' }}>
      <ul className='nobull'>
        <li><b>VirusTotal</b></li>
      </ul>
      </div>
      <div style={{ flex: '1', paddingRight: '20px' }}>
      <ul className='nobull'>
        <li><b>Community</b></li>
      </ul>

      </div>
      <div style={{ flex: '1', paddingRight: '20px' }}>
      <ul className='nobull'>
        <li><b>Join</b></li>
      </ul>
      </div>
      <div style={{ flex: '1', paddingRight: '20px' }}>
      <ul className='nobull'>
        <li><b>Tools</b></li>
      </ul>
      </div>
    </div>
    </>
  )
}

export default Footer;