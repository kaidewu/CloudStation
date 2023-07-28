import React, { useState } from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css' // Import the CSS for the lightbox

const VideosGallery = ({ data, ServerMediaURL }) => {
  const [isLoading, setLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  // Check if data.drive.videos is available and not empty
  if (!data?.drive.videos || data.drive.videos.length === 0) {
    return null
  }

  // Assuming each row contains 5 cards, we group the videos into rows of 5
  const rows = []
  const videos = data?.drive.videos

  for (let i = 0; i < videos.length; i += 5) {
    const rowVideos = videos.slice(i, i + 5)
    rows.push(rowVideos)
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
    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      {/* Loop through rows */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap -m-1 md:-m-2">
          {/* Loop through videos in the row */}
          {row.map((video, index) => (
            <div key={index} className="w-full md:w-1/5 p-1 md:p-2">
              <div
                className="w-full h-48 md:h-56 relative cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                {/* Replace video component with video thumbnail */}
                <video
                  className="w-full h-full rounded-lg object-cover object-center"
                  controls
                  poster={
                    video.video_thumbnail_path
                      ? `${ServerMediaURL}/${video.video_thumbnail_path}`
                      : `${ServerMediaURL}/thumbnail_preview.png`
                  }
                >
                  <source src={`${ServerMediaURL}/${video.video_relative_path}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      ))}
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
