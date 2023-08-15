import os
import re
import sys
import traceback
import time
import cv2
from errors.error import Error

# Insert errors into ERRROR_ERROR_LOGS and get JSON of errors
def insert_errorlogs(
    error_header: str = None, 
    function: str = "",
    error_body: str = None):
    return Error(
            error_info=sys.exc_info()[0].__name__ if error_header is None else error_header,
            filename=__file__,
            error_body=f"cloudstation.api.api_v1.routers.drive.drive -> {function}()",
            error_traceback=traceback.format_exc() if error_body is None else error_body
        ).error()

def get_drive(
        drive_path: str,
        order_by: str,
        basepath: str
):
    try:
        content_abspath = os.path.join(basepath, drive_path) # re.sub(r"[^a-zA-Z0-9/]|^/", "", drive_path)

        if not os.path.exists(content_abspath):
            raise insert_errorlogs(
                "FileNotFoundError",
                "get_drive",
                f"'{content_abspath}' not found"
                )

        return get_content(abspath=content_abspath, relpath=drive_path, order_by=order_by)
    
    except:
        return insert_errorlogs(function="get_drive")


def get_content(abspath: str, relpath: str, order_by: str):
    try:
        get_all_dirs = [content for content in os.listdir(abspath) if os.path.isdir(os.path.join(abspath, content))]
        get_all_files = [content for content in os.listdir(abspath) if os.path.isfile(os.path.join(abspath, content))]

        results = {
            "is_error": False,
            "directories": get_directories(dirs_names= get_all_dirs, abspath=abspath, relpath=relpath, order_by=order_by)
        }

        results.update(get_files(files_names=get_all_files, abspath=abspath, relpath=relpath, order_by=order_by))

        return results

    except:
        return insert_errorlogs(function="get_content")


def get_directories(dirs_names: list, abspath: str, relpath: str, order_by: str):
    try:
        directories = []

        if order_by is not None:
            if order_by == "asc":
                dirs_names.sort()
            elif order_by == "desc":
                dirs_names.sort(reverse=True)

        for dir in dirs_names:


            dir_abspath = os.path.join(abspath, dir)

            directories.append({
                "directory_name": dir,
                "directory_absolute_path": dir_abspath,
                "directory_relative_path": os.path.join(relpath, dir).replace("\\", "/"),
                #"directory_created_time": time.strftime('%d/%m/%Y %H:%M:%S',
                                                            #time.localtime(os.path.getctime(dir_abspath))),
                #"directory_modified_time": time.strftime('%d/%m/%Y %H:%M:%S',
                                                            #time.localtime(os.path.getmtime(dir_abspath))),
                #"directory_size": get_size(dir_abspath)
            })

        return directories

    except:
        return insert_errorlogs(function="get_directories")


def get_files(files_names: list, abspath: str, relpath: str, order_by: str):
    try:
        video_formats = ['.3g2', '.3gp', '.asf', '.avi', '.flv', '.h264', '.m4v', '.mkv', '.mov', '.mp4',
                        '.mpg', '.mpeg', '.rm', '.swf', '.vob', '.wmv']
        image_formats = ['.bmp', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff', '.webp']

        files = {
            "images": [],
            "videos": [],
            "others": []
        }

        if order_by == 'asc':
            files_names.sort()
        elif order_by == 'desc':
            files_names.sort(reverse=True)

        for file in files_names:

            file_abspath = os.path.join(abspath, file)
            video_thumbnail = ""

            if os.path.splitext(file_abspath)[1].lower() in image_formats:
                format_type = "images"
                dimensions_file = get_image_dimensions(file_abspath)
            elif os.path.splitext(file_abspath)[1].lower() in video_formats:
                format_type = "videos"
                dimensions_file = get_video_dimensions(file_abspath)
                video_thumbnail = extract_frame_from_video(file_abspath)
            else:
                format_type = "others"
                dimensions_file = ""

            files[format_type].append({
                f"{format_type.rstrip('s')}_name": file,
                f"{format_type.rstrip('s')}_absolute_path": file_abspath,
                f"{format_type.rstrip('s')}_relative_path": os.path.join(relpath, file).replace("\\", "/"),
                f"{format_type.rstrip('s')}_thumbnail_path": video_thumbnail if video_thumbnail != "" else {},
                #f"{format_type.rstrip('s')}_created_time": time.strftime('%d/%m/%Y %H:%M:%S', time.localtime(os.path.getctime(file_abspath))),
                #f"{format_type.rstrip('s')}_modified_time": time.strftime('%d/%m/%Y %H:%M:%S', time.localtime(os.path.getmtime(file_abspath))),
                #f"{format_type.rstrip('s')}_size": get_size(file_abspath),
                f"{format_type.rstrip('s')}_dimensions": {'height': dimensions_file[1], 'width': dimensions_file[0]} if dimensions_file != "" else {}
            })

        return files

    except:
        return insert_errorlogs(function="get_files")


def get_size(path: str):
    try:
        """
        Get the size of the content.
        """
        try:
            total_size = 0
            if os.path.isfile(path):
                total_size = os.stat(path).st_size
            elif os.path.isdir(path):
                with os.scandir(path) as it:
                    for entry in it:
                        if entry.is_file():
                            total_size += entry.stat().st_size
                        elif entry.is_dir():
                            total_size += os.path.getsize(entry.path)
            if total_size < 1024:
                file_size = f'{total_size:.2f}B'
            elif total_size < (1024 * 1024):
                file_size = f'{total_size / 1024:.2f}KB'
            elif total_size < (1024 * 1024 * 1024):
                file_size = f'{total_size / (1024 * 1024):.2f}MB'
            else:
                file_size = f'{total_size / (1024 * 1024 * 1024):.2f}GB'
            return file_size
        except:
            return '----'
    except:
        return insert_errorlogs(function="get_size")


def get_image_dimensions(image_path):
    try:
        """
        Get the width and height of an image file.
        """
        from PIL import Image
        with Image.open(image_path) as img:
            width, height = img.size
        return width, height
    
    except:
        return insert_errorlogs(function="get_image_dimensions")


def get_video_dimensions(video_path):
    try:
        """
        Get the width and height of a video file.
        """
        from moviepy.editor import VideoFileClip
        video = VideoFileClip(video_path)
        width, height = video.size
        video.close()
        return width, height

    except:
        return insert_errorlogs(function="get_video_dimensions")

def extract_frame_from_video(video_path):
    try:
        # Load the video
        cap = cv2.VideoCapture(video_path)

        # Check if the video was opened successfully
        if not cap.isOpened():
            return insert_errorlogs(
                "Exception",
                "extract_frame_from_video",
                f"Error: Unable to open the video {video_path}"
            )

        # Get the frame count and frame rate of the video
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_rate = int(cap.get(cv2.CAP_PROP_FPS))

        # Set the frame number to the middle frame
        frame_to_extract = frame_count // 2

        # Set the frame number to the middle frame or any specific frame number you want
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_to_extract)

        # Read the frame from the video
        ret, frame = cap.read()

        # Release the video capture object
        cap.release()

        if not ret:
            print("Error: Unable to read frame from the video.")
            return

        # Get the original filename without extension
        file_name = os.path.splitext(os.path.basename(video_path))[0]

        # Save the extracted frame with the "_thumb" suffix in the same directory as the video
        output_filename = os.path.join(os.path.dirname(video_path), f"{file_name}_thumb.jpg")
        cv2.imwrite(output_filename, frame)

        return output_filename
    
    except:
        return insert_errorlogs(function="extract_frame_from_video")