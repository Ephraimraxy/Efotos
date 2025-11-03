import fs from "fs/promises";
import path from "path";
import { type InsertContent } from "@shared/schema";

const MEDIA_DIR = path.join(process.cwd(), "server/media");
const IMAGES_DIR = path.join(MEDIA_DIR, "images");
const VIDEOS_DIR = path.join(MEDIA_DIR, "videos");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];

export interface LocalFileInfo {
  title: string;
  type: "image" | "video";
  localFilePath: string;
  mimeType: string;
  fileSize: number;
  duration?: number;
}

async function getFileStats(filePath: string): Promise<{ size: number }> {
  const stats = await fs.stat(filePath);
  return { size: stats.size };
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
    ".webm": "video/webm",
    ".m4v": "video/x-m4v",
  };
  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

async function scanDirectory(
  dirPath: string,
  type: "image" | "video",
  allowedExtensions: string[]
): Promise<LocalFileInfo[]> {
  try {
    await fs.access(dirPath);
  } catch {
    console.log(`Directory ${dirPath} does not exist, creating it...`);
    await fs.mkdir(dirPath, { recursive: true });
    return [];
  }

  const files = await fs.readdir(dirPath);
  const fileInfos: LocalFileInfo[] = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const ext = path.extname(file).toLowerCase();

    if (allowedExtensions.includes(ext)) {
      try {
        const stats = await getFileStats(filePath);
        const title = path.basename(file, ext);
        
        fileInfos.push({
          title,
          type,
          localFilePath: filePath,
          mimeType: getMimeType(ext),
          fileSize: stats.size,
        });
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }

  return fileInfos;
}

export async function scanLocalMediaFiles(): Promise<LocalFileInfo[]> {
  console.log("Scanning local media files...");

  const [images, videos] = await Promise.all([
    scanDirectory(IMAGES_DIR, "image", IMAGE_EXTENSIONS),
    scanDirectory(VIDEOS_DIR, "video", VIDEO_EXTENSIONS),
  ]);

  const allFiles = [...images, ...videos];
  console.log(`Found ${images.length} images and ${videos.length} videos`);

  return allFiles;
}

export function convertToInsertContent(fileInfo: LocalFileInfo): InsertContent {
  return {
    title: fileInfo.title,
    type: fileInfo.type,
    localFilePath: fileInfo.localFilePath,
    mimeType: fileInfo.mimeType,
    fileSize: fileInfo.fileSize,
    duration: fileInfo.duration,
    googleDriveId: null,
    googleDriveUrl: null,
  };
}

export { IMAGES_DIR, VIDEOS_DIR, MEDIA_DIR };
