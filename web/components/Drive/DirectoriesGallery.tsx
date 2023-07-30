import React from 'react'

const DirectoriesGallery = ({ data, callAPI }) => {
  // Check if data.drive.directories is available and not empty
  if (!data?.drive.directories || data.drive.directories.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      <div className="-m-1 flex flex-wrap md:-m-2">
        {data.drive.directories.map((directory, index) => (
          <button
            key={index}
            onClick={() => callAPI(directory.directory_relative_path)}
            className="flex w-1/3 flex-wrap hover:scale-110 active:scale-100 duration-200 bg-white-200 dark:bg-gray-900 rounded-lg p-4 shadow-md"
          >
            <div className="w-full p-1 md:p-2">
              {/* Folder Icon */}
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-700 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 2l2 2h9a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h4l2-2zm0 0v8a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2h-4a2 2 0 00-2 2z"
                />
              </svg>

              <p className="font-normal text-gray-700 dark:text-gray-400 text-center">{directory.directory_name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DirectoriesGallery
