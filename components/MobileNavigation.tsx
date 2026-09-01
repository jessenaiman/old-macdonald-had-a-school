"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
 Sheet,
 SheetClose,
 SheetContent,
 SheetDescription,
 SheetHeader,
 SheetTitle,
 SheetTrigger,
} from "@/components/ui/sheet";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";
import { NAV_ITEMS, TEACHER_GRADE_ITEMS, type ActivePage } from "./site-navigation";

/**
 * Responsive navigation composition using the installed shadcn Sheet.
 * Both header modes expose the same primary and grade-specific pathways.
 */
export function MobileNavigation({ active }: { active?: ActivePage }) {
 const [open, setOpen] = useState(false);

 return (
  <div>
   <Sheet open={open} onOpenChange={setOpen}>
    {/* Ghost has no default foreground; on the bg-brand-navy header the icon would be
            invisible, so pin it to the header's foreground token (semantic, not ad-hoc). */}
    <SheetTrigger asChild>
     <Button
      variant="ghost"
      size="icon-lg"
      className="size-11 text-brand-navy-foreground"
      aria-label="Open navigation menu"
     >
      <Menu data-icon="inline-start" aria-hidden="true" />
      <span className="sr-only">Open navigation menu</span>
     </Button>
    </SheetTrigger>

    <SheetContent
     className="overflow-y-auto bg-brand-paper text-brand-paper-foreground"
     side="right"
     showCloseButton={false}
    >
     <SheetHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b p-4 sm:p-6">
      <ResponsiveBrandEmblem />
      <div className="min-w-0 text-left">
       <SheetTitle>Old MacDonald Had a School</SheetTitle>
       <SheetDescription>
        Lessons, subjects, and teacher resources
       </SheetDescription>
      </div>
      <SheetClose asChild>
       <Button
        variant="ghost"
        size="icon-lg"
        className="size-11"
        aria-label="Close navigation menu"
       >
        <X data-icon="inline-start" aria-hidden="true" />
       </Button>
      </SheetClose>
     </SheetHeader>

     <nav className="flex flex-col gap-1 p-4 sm:p-6" aria-label="Mobile navigation">
      {NAV_ITEMS.map((item) => (
       <Button asChild variant="ghost" className="min-h-11 w-full justify-start" key={item.key}>
        <Link href={item.href} aria-current={active === item.key ? "page" : undefined} onClick={() => setOpen(false)}>
         {item.label}
        </Link>
       </Button>
      ))}

      <p className="px-3 pt-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
       Grades
      </p>
      {TEACHER_GRADE_ITEMS.map((grade) => (
       <Button
        asChild
        variant="ghost"
        className="grade-navigation-button min-h-11 w-full justify-start"
        data-grade={grade.key}
        key={grade.key}
       >
        <Link href={grade.href} aria-current={active === grade.key ? "page" : undefined} onClick={() => setOpen(false)}>
         {grade.label}
        </Link>
       </Button>
      ))}
     </nav>
    </SheetContent>
   </Sheet>
  </div>
 );
}
