import React, { useEffect, useState } from 'react'
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box, useDisclosure } from '@chakra-ui/react'

const Alerts = ({errordata}) =>{
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => {
          setVisible(false)
        }, 8000);
    
        return () => clearTimeout(timeout)
      }, [])
    
      if (!visible) {
        return null
      }

    return(
        <>
            {errordata?.status_code !== 500 ? (
                <Alert 
                status="warning" 
                style={{
                    position: 'fixed',
                    top: '4px',
                    right: '4px',
                    width: '450px',
                    height: '100px',
                    zIndex: 9999,
                    borderRadius: '8px',
                  }}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Error {errordata?.status_code}</AlertTitle>
                        <AlertDescription>
                            {errordata?.error_message}
                        </AlertDescription>
                    </Box>
                </Alert>
                ) : (
                    <Alert 
                    status="error" 
                    style={{
                        position: 'fixed',
                        top: '4px',
                        right: '4px',
                        width: '500px',
                        height: '100px',
                        zIndex: 9999,
                        borderRadius: '8px',
                      }}>
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Error 500 - Internal Error</AlertTitle>
                            <AlertDescription>
                                {errordata?.error_code}
                            </AlertDescription>
                        </Box>
                    </Alert>
                )}
        </>
    )
}

export default Alerts