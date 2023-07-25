import Directory from '../components/Directory'
import Image from '../components/Image'
import Video from '../components/Video'
import Other from '../components/Other'

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