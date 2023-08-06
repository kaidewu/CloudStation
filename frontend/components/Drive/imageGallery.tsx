"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { 
  Box, 
  Container,
} from '@chakra-ui/react'


const ImagesGallery = ({ images, ServerMediaURL }) => {

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Check if data.drive.images is available and not empty
  if (!images || images?.length === 0) {
    return null
  }

  // Assuming each row contains 5 cards, we group the images into rows of 5
  const rows = []

  for (let i = 0; i < images.length; i += 4) {
    const rowImages = images.slice(i, i + 4)
    rows.push(rowImages)
  }

  const openLightbox = (index) => {
    setCurrentImageIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }
  
  return (
    <div className="d-flex justify-content-center">
      <Container maxW={"container.md"}>
        {/* Loop through rows */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row photos align-items-center">
            {row?.map((image, index) => {
              if (image?.image_name.endsWith('_thumb.jpg')) {
                return null
              }
              return(
                <div key={index} className="col" onClick={() => openLightbox(index)}>
                  <Image
                  src={`${ServerMediaURL}/${image.image_relative_path}`}
                  alt={image?.image_name}
                  height={256}
                  width={256}/>
                </div>
              )
            })}
          </div>
        ))}
      </Container>
      {isLightboxOpen && (
        <Lightbox
          mainSrc={`${ServerMediaURL}/${images[currentImageIndex].image_relative_path}`}
          nextSrc={`${ServerMediaURL}/${images[(currentImageIndex + 1) % images.length].image_relative_path}`}
          prevSrc={`${ServerMediaURL}/${images[(currentImageIndex - 1 + images.length) % images.length].image_relative_path}`}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={prevImage}
          onMoveNextRequest={nextImage}
        />
      )}
    </div>
  )
}

export default ImagesGallery
