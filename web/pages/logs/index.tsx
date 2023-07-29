import React, { useEffect, useState } from 'react'
import Logs from '@/types/Logs'
import Loading from '@/components/Loading'
import Navbar from '@/components/Navbar'

const ErrorLogEnpoint = process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT + ':' + process.env.NEXT_PUBLIC_CLOUDSTATION_ENDPOINT_PORT + '/api/v1/error/log/?ErrorCode='

const ErrorLogs = () => {
  const [log, setLog] = useState<Logs[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedLog, setSelectedLog] = useState<Logs | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function callAPI(errorCode: string) {
    setLoading(true)

    fetch(ErrorLogEnpoint + errorCode)
      .then(async (res) => {
        // set the data if the response is successful
        const logs = await res.json()
        setLog(logs)
      })
      .catch((e) => {
        // set the error if there's an error like 404, 400, etc
        if (e instanceof Error) {
          setError(e.message)
        }
      })
      .finally(() => {
        // set loading to false after everything has completed.
        setLoading(false)
      })
  }

  useEffect(() => {
    // Make the initial API call when the component mounts
    callAPI('')
  }, [])

  // display for error component
  const errorComponent = <div className="text-red-500">Error: {error}</div>

  // Function to handle opening the modal and calling the API for selected log
  const handleViewMore = (errorCode: string) => {
    setIsModalOpen(true)
    setSelectedLog(null)

    // Call the API with the selected errorCode
    fetch(ErrorLogEnpoint + errorCode)
      .then(async (res) => {
        const selectedLogData = await res.json()
        console.log('Selected Log Data:', selectedLogData)
        setSelectedLog(selectedLogData)
      })
      .catch((e) => {
        setError(e.message)
      })
  }

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const modalContent = selectedLog && (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Error Log Details</h2>
      <p>
        Error Id: {selectedLog.error_id}
        <br />
        Error Code: {selectedLog.error_code}
        <br />
        Error Info: {selectedLog.error_traceback}
        <br />
        Error Date: {selectedLog.error_date}
        {/* Add any other relevant log details here */}
      </p>
    </div>
  )

  return (
    <div>
      <Navbar />
      {loading ? (
        Loading
      ) : error ? (
        errorComponent
      ) : (
        <div className="p-20 relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* Table for logs */}
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Error Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Error Code
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Error Info
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Error Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
            <tbody>
              {log?.map((errorlog, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {errorlog.error_id}
                    </th>
                    <td className="px-6 py-4">
                        {errorlog.error_code}
                    </td>
                    <td className="px-6 py-4">
                        {errorlog.error_traceback ? errorlog.error_traceback.substring(0, 30) : ''}...
                    </td>
                    <td className="px-6 py-4">
                        {errorlog.error_date}
                    </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                      data-te-toggle="modal"
                      data-te-target="#exampleModal"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      onClick={() => handleViewMore(errorlog.error_code)}
                    >
                      View more
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {isModalOpen && selectedLog && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
              <div className="relative z-10 max-w-full overflow-hidden">
                {modalContent}
                <button
                  className="absolute top-0 right-0 m-4 p-2 text-white bg-gray-800 rounded-lg"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ErrorLogs
