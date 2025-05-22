"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Save, Trash2, Edit, FileText } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

export function WhiteboardInterface() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("sylo-notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Failed to parse saved notes:", error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sylo-notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    setActiveNote(null);
    setTitle("");
    setContent("");
    setTags([]);
    setIsEditing(true);
  };

  const editNote = (note: Note) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setIsEditing(true);
  };

  const viewNote = (note: Note) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    if (activeNote?.id === noteId) {
      setActiveNote(null);
      setTitle("");
      setContent("");
      setTags([]);
      setIsEditing(false);
    }
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
    });
  };

  const saveNote = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your note.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const now = new Date();
      
      if (activeNote) {
        // Update existing note
        const updatedNote = {
          ...activeNote,
          title,
          content,
          updatedAt: now,
          tags,
        };
        
        setNotes(notes.map((note) => (note.id === activeNote.id ? updatedNote : note)));
        setActiveNote(updatedNote);
      } else {
        // Create new note
        const newNote: Note = {
          id: Date.now().toString(),
          title,
          content,
          createdAt: now,
          updatedAt: now,
          tags,
        };
        
        setNotes([...notes, newNote]);
        setActiveNote(newNote);
      }
      
      setIsEditing(false);
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
      {/* Notes List Sidebar */}
      <div className="col-span-3 border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-medium">Notes</h3>
        </div>
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full justify-start mb-2" 
            onClick={createNewNote}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notes yet. Create your first note!
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${
                    activeNote?.id === note.id ? "bg-accent" : ""
                  }`}
                  onClick={() => viewNote(note)}
                >
                  <div className="truncate flex-1">
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        editNote(note);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor/Viewer */}
      <div className="col-span-9 border rounded-lg overflow-hidden">
        {activeNote || isEditing ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="font-medium"
                />
              ) : (
                <h3 className="font-medium">{title}</h3>
              )}
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveNote}
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start typing your note here..."
                  className="min-h-[200px] resize-none border-0 focus-visible:ring-0 p-0"
                />
              ) : (
                <div className="whitespace-pre-wrap">{content}</div>
              )}
            </div>
            <div className="p-4 border-t">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    #{tag}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={addTag}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No note selected</h3>
            <p className="text-muted-foreground mb-4">
              Select a note from the sidebar or create a new one
            </p>
            <Button onClick={createNewNote}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}