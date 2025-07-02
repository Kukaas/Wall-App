"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PostInput from "@/components/PostInput";
import PostFeed from "@/components/PostFeed";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Util for human-readable timestamps
function timeAgo(date: Date) {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "now";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

// Post type
interface Post {
    id: string;
    message: string;
    image?: string; // base64 or URL
    createdAt: string; // ISO string
}

export default function Wall() {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<string | undefined>(undefined);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMobile = useIsMobile();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editMessage, setEditMessage] = useState("");
    const [editImage, setEditImage] = useState<string | undefined>(undefined);
    const [editImageFile, setEditImageFile] = useState<File | undefined>(undefined);

    // Fetch posts from Supabase on mount
    useEffect(() => {
        const fetchPosts = async () => {
            setLoadingPosts(true);
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("id, message, image, created_at")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                if (data) {
                    setPosts(
                        data.map((p: any) => ({
                            id: p.id,
                            message: p.message,
                            image: p.image,
                            createdAt: p.created_at,
                        }))
                    );
                }
            } catch (err) {
                // Optionally, show an error or setPosts([])
            }
            setLoadingPosts(false);
        };
        fetchPosts();
    }, []);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        let imageUrl: string | undefined = undefined;
        if (imageFile) {
            imageUrl = image;
        }
        try {
            const { data, error } = await supabase.from("posts").insert([
                {
                    message: message.trim(),
                    image: imageUrl,
                },
            ]).select();
            if (error) throw error;
            if (data && data[0]) {
                setPosts([{ id: data[0].id, message: data[0].message, image: data[0].image, createdAt: data[0].created_at }, ...posts]);
                toast.success("Posted successfully!")
            }
        } catch (err) {
            alert('Failed to share post.');
        }
        setMessage("");
        setImage(undefined);
        setImageFile(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("posts").delete().eq("id", id);
            if (error) throw error;
            setPosts(posts.filter((post) => post.id !== id));
            toast.success("Post deleted!");
        } catch (err) {
            alert('Failed to delete post.');
        }
        setLoading(false);
    };

    const handleEdit = (post: Post) => {
        setEditingId(post.id);
        setEditMessage(post.message);
        setEditImage(post.image);
        setEditImageFile(undefined);
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setEditImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditSave = async (id: string) => {
        setLoading(true);
        let imageUrl: string | undefined = editImage;
        if (editImageFile) {
            imageUrl = editImage;
        }
        try {
            const { data, error } = await supabase.from("posts").update({
                message: editMessage,
                image: imageUrl,
            }).eq("id", id).select();
            if (error) throw error;
            setPosts(posts.map((post) => post.id === id ? { ...post, message: editMessage, image: imageUrl } : post));
            setEditingId(null);
            setEditMessage("");
            setEditImage(undefined);
            setEditImageFile(undefined);
            toast.success("Post updated!");
        } catch (err) {
            alert('Failed to update post.');
        }
        setLoading(false);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditMessage("");
        setEditImage(undefined);
        setEditImageFile(undefined);
    };

    return (
        <div className={"w-full min-h-screen flex flex-col sm:flex-row " + (isMobile ? "" : "gap-8 px-8")}>
            {/* Sidebar or Topbar */}
            <div className={isMobile ? "block sm:hidden" : "hidden sm:flex sm:w-[260px] flex-shrink-0 justify-center sm:justify-end bg-transparent"}>
                <Sidebar isMobile={isMobile} />
            </div>
            {/* Main wall area */}
            <div className={"flex-1 flex flex-col items-center px-0 sm:px-0 py-8 gap-4 " + (isMobile ? "pt-20" : "")}>
                <div className="w-full flex flex-col items-center">
                    <PostInput
                        message={message}
                        setMessage={setMessage}
                        image={image}
                        setImage={setImage}
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        fileInputRef={fileInputRef}
                        loading={loading}
                        handleShare={handleShare}
                    />
                    <div className="w-full h-[1px] bg-[#e4e6eb] my-2" />
                    {loadingPosts ? (
                        <div className="w-full flex flex-col gap-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-full">
                                    <Skeleton className="h-[140px] w-full mb-2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <PostFeed
                            posts={posts}
                            timeAgo={timeAgo}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            editingId={editingId}
                            editMessage={editMessage}
                            setEditMessage={setEditMessage}
                            editImage={editImage}
                            handleEditImageChange={handleEditImageChange}
                            handleEditSave={handleEditSave}
                            handleEditCancel={handleEditCancel}
                            loading={loading}
                        />
                    )}
                </div>
                {/* Floating action button for new post on mobile */}
                {isMobile && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-6 right-6 z-30 bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        aria-label="New Post"
                    >
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7H5" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
}
