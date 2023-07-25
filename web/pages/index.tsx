import React from 'react'
import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import Image from 'next/image'
import { Player } from 'video-react'
import Drive from '../types/Drive'
import Error from '../types/Error'

export const getStaticProps: GetStaticProps<{
  repo: Drive | Error
}> = async () => {
  const res = await fetch('http://192.168.1.47:8888/api/v1/drive/hackee')
  const repo = await res.json()
  if (repo.is_error) {
    const error: Error = {
        is_error: true,
        error_code: repo.error_code,
        status_code: repo.status_code,
        error_message: repo.error_message
      }
    return { props: { repo: error } }
  } else {
    return { props: { repo } }
  }
}

export default function Page ({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    repo.is_error ? (
      repo.status_code === 404 ? (
        <>
          <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div className="flex">
              <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                  <p className="font-bold">Error {repo.status_code}</p>
                  <p className="text-sm">{repo.error_message}</p>
                </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div role="alert">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
              Error {repo.status_code}
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p>{repo.error_message}</p>
            </div>
          </div>
        </>
      )
    ) : (
        <>
            <div>
                <h2>{ repo.basepath }</h2>
                <div className='Directories'>
                  <h3>Directories</h3>
                  <ul>
                    {repo.drive.directories.map((directory, index) => (
                      <li key={index}>{directory.directory_name}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <h3>Images</h3>
                  <div>
                    {repo.drive.images.map((image, index) => (
                      <Image 
                        key={index}
                        className="h-auto max-w-full rounded-lg"
                        src={`http://192.168.1.47:8080/${image.image_relative_path}`}
                        width={(image.image_dimensions.width) / 10}
                        height={(image.image_dimensions.height) / 10}
                        alt={image.image_name}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <h3>Videos</h3>
                  <div>
                    {repo.drive.videos.map((video, index) => (
                      <Player
                        key={index}
                        playsInline
                        src={`http://192.168.1.47:8080/${video.video_relative_path}`}
                      />
                    ))}
                  </div>
                </div>
                <div className='Others'>
                  <h3>Others</h3>
                  <ul>
                    {repo.drive.others.map((other, index) => (
                      <li key={index}>{other.other_name}</li>
                    ))}
                  </ul>
                </div>
            </div>
        </>
    )
  )
}