import Directory from './Directory'
import Image from './Image'
import Video from './Video'
import Other from './Other'

type Drive = {
    is_error: boolean;
    drive: {
      directories: Directory[];
      images: Image[];
      videos: Video[];
      others: Other[];
    }
}

export default Drive