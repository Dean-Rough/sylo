"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  File, 
  Folder, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Code, 
  FileSpreadsheet, 
  FilePresentation, 
  FileQuestion,
  Upload,
  FolderPlus,
  MoreVertical,
  ChevronLeft,
  Download,
  Share,
  Trash,
  Search,
  X
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { ShareFileDialog } from "@/components/google/share-file-dialog";
import { CreateFolderDialog } from "@/components/google/create-folder-dialog";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  thumbnailLink?: string;
  parents?: string[];
  capabilities?: {
    canDownload?: boolean;
    canEdit?: boolean;
    canShare?: boolean;
    canDelete?: boolean;
  };
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export function DriveBrowser() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: "root", name: "My Drive" }]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchFiles = async (folderId: string | null = null, query: string | null = null) => {
    try {
      setLoading(true);
      
      let url = "/api/google/drive/files";
      const params = new URLSearchParams();
      
      if (folderId) {
        params.append("folderId", folderId);
      }
      
      if (query) {
        params.append("query", `name contains '${query}'`);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch Drive files");
      }
      
      const data = await response.json();
      setFiles(data.files || []);
      setError(null);
    } catch (err) {
      setError("Error loading Drive files. Please try again.");
      console.error("Error fetching Drive files:", err);
      toast({
        title: "Error",
        description: "Failed to load Drive files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentFolderId);
  }, [currentFolderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    fetchFiles(currentFolderId, searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    fetchFiles(currentFolderId);
  };

  const handleFolderClick = async (file: DriveFile) => {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      setCurrentFolderId(file.id);
      setBreadcrumbs([...breadcrumbs, { id: file.id, name: file.name }]);
      setIsSearching(false);
      setSearchQuery("");
    } else if (file.webViewLink) {
      window.open(file.webViewLink, "_blank");
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id === "root" ? null : newBreadcrumbs[newBreadcrumbs.length - 1].id);
    setIsSearching(false);
    setSearchQuery("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("name", files[0].name);
      
      if (currentFolderId) {
        formData.append("folderId", currentFolderId);
      }
      
      const response = await fetch("/api/google/drive/files/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      // Refresh file list
      fetchFiles(currentFolderId);
    } catch (err) {
      console.error("Error uploading file:", err);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsUploadDialogOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCreateFolder = async (folderName: string) => {
    try {
      const response = await fetch("/api/google/drive/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          parentFolderId: currentFolderId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create folder");
      }
      
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
      
      // Refresh file list
      fetchFiles(currentFolderId);
    } catch (err) {
      console.error("Error creating folder:", err);
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreateFolderDialogOpen(false);
    }
  };

  const handleDownloadFile = async (file: DriveFile) => {
    try {
      const response = await fetch(`/api/google/drive/files/${file.id}/download`);
      
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading file:", err);
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFile = async (file: DriveFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/google/drive/files/${file.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      
      // Refresh file list
      fetchFiles(currentFolderId);
    } catch (err) {
      console.error("Error deleting file:", err);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareFile = (file: DriveFile) => {
    setSelectedFile(file);
    setIsShareDialogOpen(true);
  };

  const handleFileShared = () => {
    setIsShareDialogOpen(false);
    toast({
      title: "Success",
      description: "File shared successfully",
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === "application/vnd.google-apps.folder") {
      return <Folder className="h-6 w-6 text-blue-500" />;
    } else if (mimeType === "application/vnd.google-apps.document" || mimeType.includes("text/")) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    } else if (mimeType === "application/vnd.google-apps.spreadsheet" || mimeType.includes("spreadsheet")) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    } else if (mimeType === "application/vnd.google-apps.presentation" || mimeType.includes("presentation")) {
      return <FilePresentation className="h-6 w-6 text-orange-500" />;
    } else if (mimeType.includes("image/")) {
      return <Image className="h-6 w-6 text-purple-500" />;
    } else if (mimeType.includes("video/")) {
      return <Video className="h-6 w-6 text-red-500" />;
    } else if (mimeType.includes("audio/")) {
      return <Music className="h-6 w-6 text-pink-500" />;
    } else if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("compressed")) {
      return <Archive className="h-6 w-6 text-yellow-500" />;
    } else if (mimeType.includes("code") || mimeType.includes("javascript") || mimeType.includes("json") || mimeType.includes("html") || mimeType.includes("css")) {
      return <Code className="h-6 w-6 text-gray-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (sizeInBytes: string) => {
    const size = parseInt(sizeInBytes, 10);
    if (isNaN(size)) return "Unknown size";
    
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Google Drive</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateFolderDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={breadcrumb.id}>
                      <BreadcrumbLink 
                        onClick={() => navigateToBreadcrumb(index)}
                        className="cursor-pointer"
                      >
                        {breadcrumb.name}
                      </BreadcrumbLink>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                {isSearching && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No files found in this folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div 
                    className="cursor-pointer p-4 flex items-center"
                    onClick={() => handleFolderClick(file)}
                  >
                    <div className="mr-3">
                      {file.thumbnailLink ? (
                        <img 
                          src={file.thumbnailLink} 
                          alt={file.name} 
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file.mimeType)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {file.modifiedTime && (
                          <span>Modified {format(new Date(file.modifiedTime), "MMM d, yyyy")}</span>
                        )}
                        {file.size && (
                          <span className="ml-2">• {formatFileSize(file.size)}</span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {file.capabilities?.canDownload && file.mimeType !== "application/vnd.google-apps.folder" && (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(file);
                          }}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                        {file.capabilities?.canShare && (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleShareFile(file);
                          }}>
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                        )}
                        {file.capabilities?.canDelete && (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file);
                          }}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Select a file to upload to {breadcrumbs[breadcrumbs.length - 1].name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedFile && (
        <ShareFileDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          file={selectedFile}
          onFileShared={handleFileShared}
        />
      )}

      <CreateFolderDialog
        isOpen={isCreateFolderDialogOpen}
        onClose={() => setIsCreateFolderDialogOpen(false)}
        onFolderCreated={handleCreateFolder}
      />
    </div>
  );
}