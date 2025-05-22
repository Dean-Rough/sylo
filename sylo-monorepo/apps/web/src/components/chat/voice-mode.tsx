"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoiceModeProps {
  onSpeechResult: (text: string) => void;
  isProcessing: boolean;
  lastAssistantMessage: string | null;
}

export function VoiceMode({ onSpeechResult, isProcessing, lastAssistantMessage }: VoiceModeProps) {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
          
        if (event.results[0].isFinal) {
          onSpeechResult(transcript);
          stopListening();
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        stopListening();
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
    }
    
    if (speechSynthesis) {
      setSpeechSynthesisSupported(true);
      synthRef.current = speechSynthesis;
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        stopListening();
      }
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onSpeechResult, toast]);

  // Handle speaking the assistant's response
  useEffect(() => {
    if (lastAssistantMessage && speechSynthesisSupported && !isProcessing && !isListening) {
      speakText(lastAssistantMessage);
    }
  }, [lastAssistantMessage, speechSynthesisSupported, isProcessing, isListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        
        // Stop any ongoing speech
        if (synthRef.current) {
          synthRef.current.cancel();
          setIsSpeaking(false);
        }
        
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
      }
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      // Create a new utterance
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.lang = 'en-US';
      
      // Set event handlers
      utteranceRef.current.onstart = () => setIsSpeaking(true);
      utteranceRef.current.onend = () => setIsSpeaking(false);
      utteranceRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        toast({
          title: "Speech Synthesis Error",
          description: "Failed to speak the response. Please try again.",
          variant: "destructive",
        });
      };
      
      // Speak the text
      synthRef.current.speak(utteranceRef.current);
    }
  };

  const toggleSpeaking = () => {
    if (synthRef.current) {
      if (isSpeaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      } else if (lastAssistantMessage) {
        speakText(lastAssistantMessage);
      }
    }
  };

  if (!speechSupported && !speechSynthesisSupported) {
    return (
      <div className="flex items-center justify-center p-2 bg-muted/50 rounded-md">
        <p className="text-sm text-muted-foreground">Voice mode not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
      {speechSupported && (
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      )}
      
      {speechSynthesisSupported && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSpeaking}
          disabled={!lastAssistantMessage || isProcessing}
          title={isSpeaking ? "Stop speaking" : "Speak response"}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      )}
      
      <p className="text-xs text-muted-foreground">
        {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Voice mode enabled"}
      </p>
    </div>
  );
}