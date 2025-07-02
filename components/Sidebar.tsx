import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { useState } from "react";

export default function Sidebar({ isMobile }: { isMobile: boolean }) {
    const [open, setOpen] = useState(false);
    const sidebarInfo = (
        <div className="flex flex-col items-center gap-4 p-4 w-full">
            <Avatar className="size-24 shadow-md border-4 border-white">
                <AvatarImage src="/chester.jpg" alt="Profile" />
                <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-0.5">
                <span className="font-semibold text-base">Chester  Luke Maligaso</span>
                <span className="text-muted-foreground text-xs">wall</span>
            </div>
            <div className="w-full flex flex-col gap-1 text-xs mt-1">
                <div>
                    <span className="font-medium text-muted-foreground">Networks</span>
                    <div>Marindque State University</div>
                </div>
                <div>
                    <span className="font-medium text-muted-foreground">Current City</span>
                    <div>Marinduque, Philippines</div>
                </div>
            </div>
            <div className="w-full h-[1px] bg-[#e4e6eb] my-2" />
            <div className="w-full flex flex-col gap-1 text-xs">
                <span className="font-medium text-muted-foreground">About</span>
                <div className="text-[13px] text-gray-700 leading-snug">
                    Full Stack Developer passionate about programming, UI/UX, and building purposeful software. Loves React, Next.js, TypeScript, and clean design. Always learning and sharing knowledge!
                </div>
            </div>
        </div>
    );
    return isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
            <header className="w-full flex items-center justify-between px-4 py-3 bg-white shadow-sm fixed top-0 left-0 z-20 border-b border-border backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                        <AvatarImage src="/chester.jpg" alt="Profile" />
                        <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-base">Chester Luke Maligaso</span>
                </div>
                <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">Info</Button>
                </DrawerTrigger>
            </header>
            <DrawerContent className="pt-8 pb-8">
                <DrawerHeader>
                    <DrawerTitle>Profile Info</DrawerTitle>
                </DrawerHeader>
                {sidebarInfo}
                <DrawerClose asChild>
                    <Button variant="outline" className="mx-auto mt-2">Close</Button>
                </DrawerClose>
            </DrawerContent>
        </Drawer>
    ) : (
        <aside className="w-[260px] flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow border border-border sticky top-8 self-start mt-8 ml-4">
            {sidebarInfo}
        </aside>
    );
}
