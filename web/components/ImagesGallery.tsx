import React, { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css' // Import the CSS for the lightbox

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ImagesGallery = ({ data, ServerMediaURL }) => {
  const [isLoading, setLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Check if data.drive.images is available and not empty
  if (!data?.drive.images || data.drive.images.length === 0) {
    return null
  }

  // Assuming each row contains 5 cards, we group the images into rows of 5
  const rows = []
  const images = data?.drive.images

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
    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      {/* Loop through rows */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap -m-1 md:-m-2">
          {/* Loop through images in the row */}
          {row.map((image, index) => {
            // Skip rendering images with names ending in "_thumb.jpg"
            if (image.image_name.endsWith('_thumb.jpg')) {
              return null
            }

            return (
              <div key={index} className="w-full md:w-1/5 p-1 md:p-2">
                <div
                  className="w-full h-48 md:h-56 relative cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    className={cn(
                      "block h-full w-full rounded-lg object-cover object-center",
                      isLoading ? "grayscale blur-2xl scale-110" : "grayscale-0 blur-0 scale-100"
                    )}
                    objectFit="cover"
                    src={`${ServerMediaURL}/${image.image_relative_path}`}
                    alt={image.image_name}
                    height={image.image_dimensions.height}
                    width={image.image_dimensions.width}
                    onLoadingComplete={() => setLoading(false)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ))}
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
