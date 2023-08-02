import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
} from '@chakra-ui/react'
import React, { useState } from 'react'

const Breadcrumbs = ({breadcrumbItems, callAPI}) => {
    const [currentPath, setCurrentPath] = useState("")

    const handleBreadcrumbClick = (path) => {
      setCurrentPath(path)
      callAPI(path)
    }

    return (
        <Breadcrumb>
            <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleBreadcrumbClick("")}>Home</BreadcrumbLink>
            </BreadcrumbItem>
          {breadcrumbItems.map((item, index) => {
            const path = breadcrumbItems.slice(0, index + 1).join('/')
            return (
                currentPath === path ? (
                    <BreadcrumbItem key={index} isCurrentPage>
                        <BreadcrumbLink onClick={() => handleBreadcrumbClick(path)}>{ item }</BreadcrumbLink>
                    </BreadcrumbItem>
                ): (
                    <BreadcrumbItem key={index}>
                        <BreadcrumbLink onClick={() => handleBreadcrumbClick(path)}>{ item }</BreadcrumbLink>
                    </BreadcrumbItem>
                )
            )
            })}
        </Breadcrumb>
        )

}

export default Breadcrumbs