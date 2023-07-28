import React from 'react'

const Breadcrumbs = ({ breadcrumbs, callAPI}) => {
    const tmpItem = breadcrumbs.reduce((accumulator, item) => accumulator + item + '/', '')

    return (
        <>
            {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                    <span className="mx-5 text-gray-900 dark:text-gray-400">/</span>
                    <a
                        onClick={() => callAPI(tmpItem)}
                        className="text-gray-900 dark:text-gray-400 hover:underline"
                    >
                        {item}
                    </a>
                </React.Fragment>
            ))}
        </>
    );
};

export default Breadcrumbs
