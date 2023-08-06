"use client"

import React, { useEffect, useState } from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { Box } from '@chakra-ui/react'


const VideosGallery = ({ videos, ServerMediaURL }) => {

  const [isLoading, setLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  // Check if data.drive.videos is available and not empty
  if (!videos || videos?.length === 0) {
    return null
  }

  // Assuming each row contains 5 cards, we group the videos into rows of 5
  const rows = []

  for (let i = 0; i < videos.length; i += 5) {
    const rowvideos = videos.slice(i, i + 5)
    rows.push(rowvideos)
  }

  const openLightbox = (index) => {
    setCurrentVideoIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const nextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
  }
  
  return (
    <div className="d-flex justify-content-center">
      <div className="photo-gallery">
        {/* Loop through rows */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row photos">
            {row?.map((video, index) => {
              if (video?.video_name.endsWith('_thumb.jpg')) {
                return null
              }
              return(
                <div key={index} className="col-2 item" onClick={() => openLightbox(index)}>
                  <video
                  controls
                  poster={
                    video.video_thumbnail_path
                      ? `${ServerMediaURL}/${video.video_thumbnail_path}`
                      : `${ServerMediaURL}/thumbnail_preview.png`
                  }>
                    <source src={`${ServerMediaURL}/${video.video_relative_path}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {isLightboxOpen && (
        <Lightbox
          mainSrc={`${ServerMediaURL}/${videos[currentVideoIndex].video_relative_path}`}
          nextSrc={`${ServerMediaURL}/${videos[(currentVideoIndex + 1) % videos.length].video_relative_path}`}
          prevSrc={`${ServerMediaURL}/${videos[(currentVideoIndex - 1 + videos.length) % videos.length].video_relative_path}`}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={prevVideo}
          onMoveNextRequest={nextVideo}
        />
      )}
    </div>
  )
}

export default VideosGallery
