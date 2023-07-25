import React from 'react'
import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import Logs from '../../types/Logs'

export const getStaticProps: GetStaticProps<{
    repo: Logs
  }> = async () => {
    const res = await fetch('http://192.168.1.47:8888/api/v1/error/log')
    const repo = await res.json()
    return { props: { repo } }
}

export default function ErrorLogs({
    repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return(
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    {repo.map((errorlog, index) => (
                        <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View More</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}