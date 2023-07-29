import React, { useState } from 'react'

const Breadcrumbs = ({ breadcrumbs, callAPI }) => {
  const [currentPath, setCurrentPath] = useState('')

  const handleBreadcrumbClick = (path) => {
    setCurrentPath(path)
    callAPI(path)
  }

  return (
    <>
      {breadcrumbs.map((item, index) => {
        const path = breadcrumbs.slice(0, index + 1).join('/')
        return (
          <React.Fragment key={index}>
            <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <a
              onClick={() => handleBreadcrumbClick(path)}
              className={`text-gray-900 dark:text-gray-400 hover:underline ${
                currentPath === path ? 'font-bold' : ''
              }`}
            >
              {item}
            </a>
          </React.Fragment>
        )
      })}
    </>
  )
}

export default Breadcrumbs
