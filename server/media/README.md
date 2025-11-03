# Local Media Storage

This folder contains media files that are automatically scanned and displayed in the gallery.

## Structure
- `images/` - Place your image files here (JPG, PNG, WEBP, etc.)
- `videos/` - Place your video files here (MP4, MOV, AVI, etc.)

## How it works
1. Drop your image or video files into the respective folders
2. The system automatically scans these folders on startup
3. Files are added to the database and displayed in the gallery
4. Customers can purchase and download these files just like Google Drive content

## Supported formats
**Images:** .jpg, .jpeg, .png, .gif, .webp, .bmp
**Videos:** .mp4, .mov, .avi, .mkv, .webm

## Notes
- Files are identified by their filename
- If you rename or delete a file, the system will update automatically on next scan
- Watermarks are automatically added to image previews
