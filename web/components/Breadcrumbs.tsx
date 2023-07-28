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
            <span className="mx-5 text-gray-900 dark:text-gray-400">/</span>
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
