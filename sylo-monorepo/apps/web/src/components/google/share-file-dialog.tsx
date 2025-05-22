"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface ShareFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: DriveFile;
  onFileShared: () => void;
}

export function ShareFileDialog({ isOpen, onClose, file, onFileShared }: ShareFileDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"reader" | "commenter" | "writer" | "fileOrganizer">("reader");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email address is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/google/drive/files/${file.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: email,
          role,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to share file");
      }
      
      toast({
        title: "Success",
        description: `${file.name} has been shared with ${email}`,
      });
      
      setEmail("");
      onFileShared();
    } catch (err) {
      console.error("Error sharing file:", err);
      toast({
        title: "Error",
        description: "Failed to share file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Share "{file.name}"</DialogTitle>
            <DialogDescription>
              Enter an email address to share this file with.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Permission</Label>
              <Select value={role} onValueChange={(value: "reader" | "commenter" | "writer" | "fileOrganizer") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Viewer (can view)</SelectItem>
                  <SelectItem value="commenter">Commenter (can comment)</SelectItem>
                  <SelectItem value="writer">Editor (can edit)</SelectItem>
                  <SelectItem value="fileOrganizer">Organizer (can organize)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sharing..." : "Share"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}