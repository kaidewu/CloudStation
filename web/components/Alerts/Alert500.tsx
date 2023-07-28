import React from 'react';

const Alert500 = ({status_code, error_message, error_code}) =>{
    return(
        <React.Fragment>
            <div role="alert">
                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                    Error {status_code}
                </div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                    <p>{error_code}</p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Alert500