import Dimensions from './Dimensions'

type Video = {
    video_name: string
    video_absolute_path: string
    video_relative_path: string
    video_thumbnail_path: string
    //video_created_time: string
    //video_modified_time: string
    //video_size: string
    video_dimensions: Dimensions[]
}

export default Video