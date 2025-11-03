import { storage } from "./storage";
import { scanLocalMediaFiles, convertToInsertContent } from "./fileScanner";
import type { Content } from "@shared/schema";
import fs from "fs/promises";

export interface SyncResult {
  added: number;
  removed: number;
  unchanged: number;
  errors: string[];
}

export async function syncLocalMediaFiles(): Promise<SyncResult> {
  console.log("Starting local media sync...");
  
  const result: SyncResult = {
    added: 0,
    removed: 0,
    unchanged: 0,
    errors: [],
  };

  try {
    const localFiles = await scanLocalMediaFiles();
    const allContent = await storage.getAllContent();
    
    const localFilePaths = new Set(localFiles.map(f => f.localFilePath));
    const dbLocalContent = allContent.filter(c => c.localFilePath);

    for (const fileInfo of localFiles) {
      try {
        const existing = await storage.getContentByLocalPath(fileInfo.localFilePath);
        
        if (!existing) {
          await storage.createContent(convertToInsertContent(fileInfo));
          result.added++;
          console.log(`Added: ${fileInfo.title}`);
        } else {
          result.unchanged++;
        }
      } catch (error) {
        const errorMsg = `Error adding ${fileInfo.title}: ${error}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
      }
    }

    for (const dbContent of dbLocalContent) {
      if (!dbContent.localFilePath) continue;
      
      if (!localFilePaths.has(dbContent.localFilePath)) {
        try {
          await fs.access(dbContent.localFilePath);
          result.unchanged++;
        } catch {
          await storage.deleteContentByLocalPath(dbContent.localFilePath);
          result.removed++;
          console.log(`Removed (file deleted): ${dbContent.title}`);
        }
      }
    }

    console.log(`Sync complete: +${result.added}, -${result.removed}, =${result.unchanged}`);
  } catch (error) {
    const errorMsg = `Sync failed: ${error}`;
    console.error(errorMsg);
    result.errors.push(errorMsg);
  }

  return result;
}

let isSyncing = false;

export async function syncWithLock(): Promise<SyncResult | null> {
  if (isSyncing) {
    console.log("Sync already in progress, skipping...");
    return null;
  }

  isSyncing = true;
  try {
    return await syncLocalMediaFiles();
  } finally {
    isSyncing = false;
  }
}
