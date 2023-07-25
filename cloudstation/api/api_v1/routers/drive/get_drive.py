import os
import re
import sys
import traceback
import time
from errors.error import Error


def get_drive(
        drive_path: str,
        order_by: str,
        basepath: str
):
    try:
        content_abspath = os.path.join(basepath, drive_path) # re.sub(r"[^a-zA-Z0-9/]|^/", "", drive_path)

        if not os.path.exists(content_abspath):
            raise FileNotFoundError(f"'{content_abspath}' not found")

        return {
            "basepath": content_abspath,
            "is_error": False,
            "params": {
                "drive_path": drive_path,
                "orderby": order_by
            },
            "drive": get_content(abspath=content_abspath, relpath=drive_path, order_by=order_by)
        }
    except:
        return Error(
            error_info=sys.exc_info(),
            filename=__file__,
            error_body="cloudstation.api.api_v1.routers.drive.get_drive -> get_drive()",
            error_traceback=traceback.format_exc()
        ).error()


def get_content(abspath: str, relpath: str, order_by: str):
    get_all_dirs = [content for content in os.listdir(abspath) if os.path.isdir(os.path.join(abspath, content))]
    get_all_files = [content for content in os.listdir(abspath) if os.path.isfile(os.path.join(abspath, content))]

    results = {
        "directories": get_directories(dirs_names= get_all_dirs, abspath=abspath, relpath=relpath, order_by=order_by),
    }

    results.update(get_files(files_names=get_all_files, abspath=abspath, relpath=relpath, order_by=order_by))

    return results


def get_directories(dirs_names: list, abspath: str, relpath: str, order_by: str):
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
            "directory_created_time": time.strftime('%d/%m/%Y %H:%M:%S',
                                                        time.localtime(os.path.getctime(dir_abspath))),
            "directory_modified_time": time.strftime('%d/%m/%Y %H:%M:%S',
                                                         time.localtime(os.path.getmtime(dir_abspath))),
            "directory_size": get_size(dir_abspath)
        })

    return directories


def get_files(files_names: list, abspath: str, relpath: str, order_by: str):

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

        if os.path.splitext(file_abspath)[1].lower() in image_formats:
            format_type = "images"
            dimensions_file = get_image_dimensions(file_abspath)
        elif os.path.splitext(file_abspath)[1].lower() in video_formats:
            format_type = "videos"
            dimensions_file = get_video_dimensions(file_abspath)
        else:
            format_type = "others"
            dimensions_file = ""

        files[format_type].append({
            f"{format_type.rstrip('s')}_name": file,
            f"{format_type.rstrip('s')}_absolute_path": file_abspath,
            f"{format_type.rstrip('s')}_relative_path": os.path.join(relpath, file).replace("\\", "/"),
            f"{format_type.rstrip('s')}_created_time": time.strftime('%d/%m/%Y %H:%M:%S', time.localtime(os.path.getctime(file_abspath))),
            f"{format_type.rstrip('s')}_modified_time": time.strftime('%d/%m/%Y %H:%M:%S', time.localtime(os.path.getmtime(file_abspath))),
            f"{format_type.rstrip('s')}_size": get_size(file_abspath),
            f"{format_type.rstrip('s')}_dimensions": {'height': dimensions_file[1], 'width': dimensions_file[0]} if dimensions_file != "" else {}
        })

    return files


def get_size(path: str):
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


def get_image_dimensions(image_path):
    """
    Get the width and height of an image file.
    """
    from PIL import Image
    with Image.open(image_path) as img:
        width, height = img.size
    return width, height


def get_video_dimensions(video_path):
    """
    Get the width and height of a video file.
    """
    from moviepy.editor import VideoFileClip
    video = VideoFileClip(video_path)
    width, height = video.size
    video.close()
    return width, height
