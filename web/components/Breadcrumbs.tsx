import React from 'react'

const Breadcrumbs = ({ breadcrumbs }) => {
    return (
        <>
            {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                    <span className="mx-5 text-gray-900 dark:text-gray-400">/</span>
                    <a href="#" className="text-gray-900 dark:text-gray-400 hover:underline">
                        {item}
                    </a>
                </React.Fragment>
            ))}
        </>
    )
}

export default Breadcrumbs