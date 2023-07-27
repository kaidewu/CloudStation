import Directory from './Directory'
import Image from './/Image'
import Video from './Video'
import Other from './Other'

type Drive = {
    basepath: string;
    is_error: boolean;
    params: {
      drive_path: string;
      orderby: string | null;
    }
    drive: {
      directories: Directory[];
      images: Image[];
      videos: Video[];
      others: Other[];
    }
}

export default Drive