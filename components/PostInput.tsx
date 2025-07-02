import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import React from "react";

export default function PostInput({
    message,
    setMessage,
    image,
    setImage,
    imageFile,
    setImageFile,
    fileInputRef,
    loading,
    handleShare,
}: {
    message: string;
    setMessage: (v: string) => void;
    image: string | undefined;
    setImage: (v: string | undefined) => void;
    imageFile: File | undefined;
    setImageFile: (f: File | undefined) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    loading: boolean;
    handleShare: (e: React.FormEvent) => void;
}) {
    return (
        <div className="w-full bg-white border border-border shadow-sm rounded-lg p-4 mb-2">
            <form className="flex flex-col gap-2" onSubmit={handleShare} autoComplete="off">
                <div className="flex items-start gap-3">
                    <Avatar className="size-12 mt-1">
                        <AvatarImage src="/chester.jpg" alt="Profile" />
                        <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                        maxLength={280}
                        placeholder="What's on your mind?"
                        className="resize-none min-h-16 bg-[#f0f2f5] border border-border rounded-lg shadow-none focus:ring-2 focus:ring-blue-200 text-base flex-1"
                        required
                    />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImageFile(file);
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    setImage(ev.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="file:mr-2 file:py-1 file:px-3 file:rounded file:border file:bg-muted file:text-xs file:font-medium file:text-foreground"
                    />
                    {image && (
                        <img
                            src={image}
                            alt="Preview"
                            className="h-10 w-10 object-cover rounded border shadow-sm"
                        />
                    )}
                    <Button
                        type="submit"
                        disabled={!message.trim() || loading}
                        className="ml-auto px-5 py-1.5 rounded-md shadow-sm bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all"
                    >
                        Share
                    </Button>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                    {280 - message.length} characters remaining
                </div>
            </form>
        </div>
    );
}
