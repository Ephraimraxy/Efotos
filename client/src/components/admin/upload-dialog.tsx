import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Video, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UploadFile = {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  id: string;
};

export default function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: UploadFile[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending',
      id: Math.random().toString(36).substring(7),
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      const formData = new FormData();
      
      selectedFiles.forEach(({ file }) => {
        formData.append('files', file);
      });

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            
            setSelectedFiles(prev => prev.map((f, idx) => {
              const filesPerChunk = 100 / selectedFiles.length;
              const currentFileIndex = Math.floor(percentComplete / filesPerChunk);
              
              if (idx < currentFileIndex) {
                return { ...f, progress: 100, status: 'completed' };
              }
              if (idx === currentFileIndex) {
                const fileProgress = ((percentComplete % filesPerChunk) / filesPerChunk) * 100;
                return { ...f, progress: Math.min(99, fileProgress), status: 'uploading' };
              }
              return { ...f, progress: 0, status: 'pending' };
            }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            
            if (response.errors && response.errors.length > 0) {
              setSelectedFiles(prev => prev.map(f => {
                const hasError = response.errors.some((e: any) => e.filename === f.file.name);
                return hasError ? { ...f, progress: 0, status: 'error' } : { ...f, progress: 100, status: 'completed' };
              }));
            } else {
              setSelectedFiles(prev => prev.map(f => ({ ...f, progress: 100, status: 'completed' })));
            }
            
            resolve(response);
          } else {
            setSelectedFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          setSelectedFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
          reject(new Error('Network error during upload'));
        });

        xhr.open('POST', '/api/content/upload-local');
        xhr.send(formData);
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      
      if (data.errors && data.errors.length > 0) {
        toast({
          title: "Partial Upload Success",
          description: `${data.successCount} file(s) uploaded, ${data.errorCount} failed`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload Complete",
          description: `${data.successCount} file(s) uploaded successfully`,
        });
      }
      
      setTimeout(() => {
        if (data.successCount > 0) {
          setOpen(false);
          setSelectedFiles([]);
        }
        setIsUploading(false);
      }, 2000);
    },
    onError: (error: Error) => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate();
  };

  const totalProgress = selectedFiles.length > 0
    ? selectedFiles.reduce((acc, file) => acc + file.progress, 0) / selectedFiles.length
    : 0;

  const completedFiles = selectedFiles.filter(f => f.status === 'completed').length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-upload">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Images & Videos</DialogTitle>
          <DialogDescription>
            Upload images and videos from your device. Multiple files supported.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isUploading}
              className="flex-1"
              data-testid="button-select-files"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFiles.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                data-testid="button-start-upload"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {selectedFiles.length} File(s)
                  </>
                )}
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">
                  {completedFiles} / {selectedFiles.length} files
                </span>
              </div>
              <Progress value={totalProgress} className="h-2" data-testid="progress-overall" />
              <p className="text-xs text-muted-foreground">
                {Math.round(totalProgress)}% complete
              </p>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Selected Files ({selectedFiles.length})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedFiles.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-3 p-3 bg-accent rounded-lg"
                    data-testid={`file-item-${uploadFile.id}`}
                  >
                    <div className="shrink-0">
                      {uploadFile.file.type.startsWith('image/') ? (
                        <Image className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Video className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploadFile.status === 'uploading' && (
                        <Progress 
                          value={uploadFile.progress} 
                          className="h-1 mt-1" 
                          data-testid={`progress-${uploadFile.id}`}
                        />
                      )}
                    </div>
                    <div className="shrink-0">
                      {uploadFile.status === 'completed' ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      ) : uploadFile.status === 'uploading' ? (
                        <Badge variant="secondary">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          {Math.round(uploadFile.progress)}%
                        </Badge>
                      ) : uploadFile.status === 'error' ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(uploadFile.id)}
                          disabled={isUploading}
                          data-testid={`button-remove-${uploadFile.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFiles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No files selected</p>
              <p className="text-sm">Click "Select Files" to choose images and videos</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
