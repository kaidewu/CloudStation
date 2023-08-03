"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { Box } from '@chakra-ui/react'


const ImagesGallery = ({ images, ServerMediaURL }) => {

  const [isLoading, setLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Check if data.drive.images is available and not empty
  if (!images || images?.length === 0) {
    return null
  }

  // Assuming each row contains 5 cards, we group the images into rows of 5
  const rows = []

  for (let i = 0; i < images.length; i += 5) {
    const rowImages = images.slice(i, i + 5)
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
    <Box>
      <div className="photo-gallery">
        {/* Loop through rows */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row photos">
            {row?.map((image, index) => {
              if (image?.image_name.endsWith('_thumb.jpg')) {
                return null
              }
              return(
                <div key={index} className="col-sm-6 col-md-4 col-lg-3 item" onClick={() => openLightbox(index)}>
                  <Image
                    src={`${ServerMediaURL}/${image.image_relative_path}`}
                    alt={image?.image_name}
                    height={image?.image_dimensions.height / 7}
                    width={image?.image_dimensions.width / 7}
                    onLoadingComplete={() => setLoading(false)}
                    quality={70}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
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
    </Box>
  )
}

export default ImagesGallery
