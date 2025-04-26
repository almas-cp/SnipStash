"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import React from "react";

const codeSnippets = [
  {
    id: 1,
    title: "React useEffect Hook",
    description: "A simple example of the useEffect hook in React",
    language: "JavaScript",
    code: 'useEffect(() => {\n  console.log("Component mounted");\n  return () => {\n    console.log("Component unmounted");\n  };\n}, []);',
  },
  {
    id: 2,
    title: "Python List Comprehension",
    description: "Example of list comprehension in Python",
    language: "Python",
    code: "numbers = [1, 2, 3, 4, 5]\nsquared = [x**2 for x in numbers]\nprint(squared)  # [1, 4, 9, 16, 25]",
  },
  {
    id: 3,
    title: "TypeScript Interface",
    description: "Define a TypeScript interface",
    language: "TypeScript",
    code: "interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n}",
  },
];

export default function Home() {
  const [search, setSearch] = React.useState("");
  
  const showSuccessToast = () => {
    toast.success("Snippet copied to clipboard!");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="font-bold">SnipStash</span>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <div className="mb-2 mt-4 text-lg font-medium">
                            SnipStash
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Store, organize, and share your code snippets efficiently.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                    <NavigationMenuLink asChild>
                      <Link href="#" className={navigationMenuTriggerStyle()}>
                        Documentation
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#" className={navigationMenuTriggerStyle()}>
                        API Reference
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="#" className={navigationMenuTriggerStyle()}>
                    Features
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="#" className={navigationMenuTriggerStyle()}>
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Your Code Snippets Organized
            </h1>
            <p className="text-lg text-muted-foreground">
              A beautiful and efficient way to manage and share your code snippets.
            </p>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Search snippets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Snippets</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {codeSnippets.map((snippet) => (
                  <Card key={snippet.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{snippet.title}</CardTitle>
                      <CardDescription>{snippet.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-3 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">{snippet.language}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(snippet.code);
                          showSuccessToast();
                        }}
                      >
                        Copy
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Snippets</CardTitle>
                  <CardDescription>
                    Your most recently added or viewed code snippets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>You haven't viewed any snippets recently.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Snippets</CardTitle>
                  <CardDescription>
                    Your favorite code snippets for quick access.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>You haven't added any snippets to your favorites yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-4">
            <Button onClick={() => toast.info("Create a new snippet feature coming soon!")}>
              Create New Snippet
            </Button>
            <Button variant="outline" onClick={() => toast("This is a basic toast notification")}>
              Show Toast
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with shadcn/ui and Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
