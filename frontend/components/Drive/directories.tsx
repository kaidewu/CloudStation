import React from 'react'
import {
    LinkBox,
    Heading,
    LinkOverlay,
    Button,
    Text
} from '@chakra-ui/react'

const Directories = ({ directories, callAPI }) => {
  // Check if data.drive.directories is available and not empty
  if (!directories || directories.length === 0) {
    return null
  }

  return (
    <>
        {directories.map((dir, index) => {
            return(
                <LinkBox key={index} p='5' borderWidth='1px' rounded='md'>
                    <Heading size='sm' my='2'>
                        <LinkOverlay 
                        onClick={() => callAPI(dir?.directory_relative_path)}>
                            { dir?.directory_name }
                        </LinkOverlay>
                    </Heading>
                </LinkBox>
            )
        })}
    </>
  )
}

export default Directories