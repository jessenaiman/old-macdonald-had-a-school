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
import { TEACHER_GRADE_ITEMS, type ActivePage } from "./site-navigation";
import { ResponsiveBrandEmblem } from "./brand/ResponsiveBrandEmblem";

export function MobileNavigation({ active }: { active?: ActivePage }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Open navigation menu"
          >
            <Menu aria-hidden="true" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          className="w-full overflow-y-auto sm:max-w-sm"
          side="right"
          showCloseButton={false}
        >
          <SheetHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b pb-4">
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
                size="icon"
                aria-label="Close navigation menu"
              >
                <X aria-hidden="true" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link
                href="/lessons"
                aria-current={active === "lessons" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                Lessons
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/#browse-by-subject" aria-current={active === "topics" ? "page" : undefined} onClick={() => setOpen(false)}>
                Subjects
              </Link>
            </Button>
            <div className="my-2 border-t pt-3">
              <p className="px-4 pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Grades</p>
              <div className="flex flex-col gap-1">
                {TEACHER_GRADE_ITEMS.map((grade) => (
                  <Button asChild variant="ghost" className="w-full justify-start" key={grade.key}>
                    <Link href={grade.href} aria-current={active === grade.key ? "page" : undefined} onClick={() => setOpen(false)}>
                      {grade.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link
                href="/songs"
                aria-current={active === "songs" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                For Teachers
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link
                href="/about"
                aria-current={active === "about" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                About
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link
                href="/search"
                aria-current={active === "search" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                Search
              </Link>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
