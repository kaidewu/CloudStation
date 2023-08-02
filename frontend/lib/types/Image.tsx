import Dimensions from './Dimensions'

type Image = {
    image_name: string
    image_absolute_path: string
    image_relative_path: string
    //image_created_time: string;
    //image_modified_time: string;
    //image_size: string;
    image_dimensions: Dimensions[]
}

export default Image
  