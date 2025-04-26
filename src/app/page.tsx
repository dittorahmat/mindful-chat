
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { provideAiFeedback } from '@/ai/flows/provide-ai-feedback';
import { Trash2, Bot, User, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useLocalStorage from '@/hooks/use-local-storage';
import type { ProvideAiFeedbackInput } from '@/ai/flows/provide-ai-feedback';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export default function MindfulChat() {
  const [messages, setMessages] = useLocalStorage<Message[]>('mindfulChatMessages', []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      // Find the viewport element within the ScrollArea component
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollViewport) {
        // Use requestAnimationFrame to ensure scrolling happens after the DOM update
        requestAnimationFrame(() => {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
        });
      }
    }
  }, [messages]); // Rerun effect when messages array changes


  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const newUserMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: trimmedInput,
    };

    // Create the array with the new user message
    const updatedMessagesWithUser = [...messages, newUserMessage];
    // Update state immediately to show user message
    setMessages(updatedMessagesWithUser);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Format chat history for the AI using the array that *already includes* the new user message
      const chatHistoryString = updatedMessagesWithUser
        .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
        .join('\n');

      const input: ProvideAiFeedbackInput = { chatMessages: chatHistoryString };
      const aiResponse = await provideAiFeedback(input);

      const aiMessage: Message = {
        id: Date.now() + 1, // Ensure unique ID
        sender: 'ai',
        text: aiResponse.feedback,
      };
      // Update state by adding the AI message to the array that *already contains* the user message
      setMessages([...updatedMessagesWithUser, aiMessage]);

    } catch (err) {
      console.error('Error getting AI feedback:', err);
      setError('Sorry, I encountered an error trying to respond. Please try again.');
      // Revert to the state *with* the user's message if AI fails
      setMessages(updatedMessagesWithUser);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null); // Clear error when clearing chat
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl h-[85vh] flex flex-col shadow-lg rounded-lg overflow-hidden"> {/* Added overflow-hidden */}
        <CardHeader className="flex flex-row items-center justify-between border-b p-4 bg-card flex-shrink-0"> {/* Added flex-shrink-0 */}
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Bot className="text-primary" /> Mindful Chat
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClearChat} aria-label="Clear chat history">
            <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden"> {/* Ensure CardContent itself allows overflow */}
          <ScrollArea className="h-full" ref={scrollAreaRef}> {/* ScrollArea takes full height of parent */}
             <div className="p-4 space-y-4"> {/* Add padding back here */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                   {message.sender === 'ai' && <Bot className="h-6 w-6 text-primary self-start flex-shrink-0" />}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    {/* Using whitespace-pre-wrap to respect newlines and wrap text */}
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  </div>
                   {message.sender === 'user' && <User className="h-6 w-6 text-secondary-foreground self-start flex-shrink-0" />}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center gap-2">
                   <Bot className="h-6 w-6 text-primary self-start flex-shrink-0" />
                   <div className="bg-accent text-accent-foreground rounded-lg p-3 shadow-sm flex items-center space-x-2">
                     <Loader2 className="h-4 w-4 animate-spin" />
                     <span className="text-sm italic">Thinking...</span>
                   </div>
                 </div>
              )}
               {error && (
                <Alert variant="destructive" className="mt-4">
                   <AlertTitle>Error</AlertTitle>
                   <AlertDescription>{error}</AlertDescription>
                 </Alert>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t bg-card flex-shrink-0"> {/* Added flex-shrink-0 */}
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
              aria-label="Chat input"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} aria-label="Send message">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
