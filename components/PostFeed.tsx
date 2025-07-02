import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

interface Post {
    id: string;
    message: string;
    image?: string;
    createdAt: string;
}

export default function PostFeed({
    posts,
    timeAgo,
    onEdit,
    onDelete,
    editingId,
    editMessage,
    setEditMessage,
    editImage,
    handleEditImageChange,
    handleEditSave,
    handleEditCancel,
    loading,
}: {
    posts: Post[];
    timeAgo: (d: Date) => string;
    onEdit: (post: Post) => void;
    onDelete: (id: string) => void;
    editingId: string | null;
    editMessage: string;
    setEditMessage: (v: string) => void;
    editImage: string | undefined;
    handleEditImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditSave: (id: string) => void;
    handleEditCancel: () => void;
    loading: boolean;
}) {
    const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
    return (
        <div className="w-full flex flex-col gap-3">
            {posts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 bg-white rounded-lg shadow-sm border border-border">No posts yet. Be the first to share!</div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="group">
                        <Card className="w-full bg-white border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                            <CardContent className="py-4 px-4 flex flex-col gap-2">
                                {editingId === post.id ? (
                                    <form className="flex flex-col gap-2" onSubmit={e => { e.preventDefault(); handleEditSave(post.id); }}>
                                        <div className="flex items-center gap-3 mb-1">
                                            <Avatar className="size-10">
                                                <AvatarImage src="/chester.jpg" alt="Profile" />
                                                <AvatarFallback>M</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold text-[15px]">Chester Luke Maligaso</span>
                                            <span className="text-xs text-muted-foreground ml-2">{timeAgo(new Date(post.createdAt))}</span>
                                        </div>
                                        <Textarea
                                            value={editMessage}
                                            onChange={e => setEditMessage(e.target.value.slice(0, 280))}
                                            maxLength={280}
                                            className="resize-none min-h-16 bg-[#f0f2f5] border border-border rounded-lg shadow-none focus:ring-2 focus:ring-blue-200 text-base"
                                            required
                                            disabled={loading}
                                        />
                                        <div className="flex items-center gap-2 mt-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleEditImageChange}
                                                className="file:mr-2 file:py-1 file:px-3 file:rounded file:border file:bg-muted file:text-xs file:font-medium file:text-foreground"
                                                disabled={loading}
                                            />
                                            {editImage && (
                                                <img
                                                    src={editImage}
                                                    alt="Preview"
                                                    className="h-10 w-10 object-cover rounded border shadow-sm"
                                                />
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-2 justify-end">
                                            <Button type="button" variant="outline" size="sm" onClick={handleEditCancel} disabled={loading}>Cancel</Button>
                                            <Button type="submit" size="sm" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
                                                {loading ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 mb-1 relative">
                                            <Avatar className="size-10">
                                                <AvatarImage src="/chester.jpg" alt="Profile" />
                                                <AvatarFallback>M</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold text-[15px]">Chester Luke Maligaso</span>
                                            <span className="text-xs text-muted-foreground ml-2">{timeAgo(new Date(post.createdAt))}</span>
                                            <div className="ml-auto">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-7">
                                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor" /><circle cx="12" cy="12" r="2" fill="currentColor" /><circle cx="19" cy="12" r="2" fill="currentColor" /></svg>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onEdit(post)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setDeleteDialogId(post.id)} className="text-red-600 focus:text-red-600">
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                {deleteDialogId === post.id && (
                                                    <AlertDialog open onOpenChange={open => { if (!open) setDeleteDialogId(null); }}>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete post?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. Are you sure you want to delete this post?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction asChild>
                                                                    <Button
                                                                        variant="destructive"
                                                                        onClick={() => { onDelete(post.id); setDeleteDialogId(null); }}
                                                                        disabled={loading}
                                                                    >
                                                                        {loading ? <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> : null}
                                                                        Delete
                                                                    </Button>
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </div>
                                        <div className="whitespace-pre-line break-words text-[15px] text-gray-900 leading-normal">
                                            {post.message}
                                        </div>
                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                className="mt-2 max-h-96 w-full rounded-md border object-contain shadow-sm"
                                            />
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ))
            )}
        </div>
    );
}
