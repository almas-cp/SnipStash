"use client";

import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronRight, Code, Database, Tag, Search, ClipboardCopy, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function LandingPage() {
  const sqlSnippet = `SELECT snippets.title, users.name
FROM snippets
JOIN users ON snippets.user_id = users.id
WHERE snippets.language = 'SQL'`;

  const pythonSnippet = `import requests
from datetime import datetime

def fetch_snippets(language="python", days=7):
    """Fetch recent code snippets by language."""
    url = "https://api.snipstash.com/snippets"
    params = {"language": language}`;

  const bashSnippet = `#!/bin/bash

# Backup all code snippets to a file
backup_snippets() {
  local output_dir="$HOME/snippet_backups"
  local date_str=$(date +%Y-%m-%d)
  local output_file="$output_dir/snippets_$date_str.json"`;

  const copyToClipboard = (text: string, snippetType: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${snippetType} snippet copied to clipboard`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/90 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth">
              <Button variant="outline">Sign in</Button>
            </Link>
            <Link href="/auth">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 bg-grid-pattern bg-foreground/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative">
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 animate-float-up">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Smart code snippet organizer</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-float-up delay-100">
              Never lose a useful code <span className="text-gradient">snippet</span> again
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-float-up delay-200">
              SnipStash intelligently organizes your code snippets with automatic categorization, easy search, and instant access when you need them.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-float-up delay-300">
              <Link href="/auth" className="flex-1">
                <Button size="lg" className="w-full">
                  Start saving snippets
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features" className="flex-1">
                <Button size="lg" variant="outline" className="w-full">
                  See features
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Language Demo Cards */}
          <div className="mt-20">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SQL Card */}
                <div className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  {/* Glowing backdrop that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-blue-500/5 to-background opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Card header */}
                  <div className="p-4 border-b border-border bg-black flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">SQL</h3>
                    <div className="text-blue-400">
                      <Database className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Code content */}
                  <div className="relative p-5 font-mono text-sm overflow-hidden h-48 bg-black">
                    <pre className="text-gray-300">
                      <code>
                        <span className="text-blue-400">SELECT</span> snippets.title, users.name{"\n"}
                        <span className="text-blue-400">FROM</span> snippets{"\n"}
                        <span className="text-blue-400">JOIN</span> users <span className="text-blue-400">ON</span> snippets.user_id = users.id{"\n"}
                        <span className="text-blue-400">WHERE</span> snippets.language = <span className="text-amber-300">'SQL'</span>
                      </code>
                    </pre>
                    
                    {/* Overlay that appears on hover */}
                    <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 bg-background/20 border-white/20 text-white hover:bg-background/30"
                        onClick={() => copyToClipboard(sqlSnippet, "SQL")}
                      >
                        <ClipboardCopy className="w-4 h-4" />
                        Copy Query
                      </Button>
                    </div>
                  </div>
                  
                  {/* Card footer */}
                  <div className="p-3 text-center border-t border-border bg-black">
                    <p className="text-sm font-medium text-white">Database Queries</p>
                    <p className="text-xs text-gray-400">Store and organize your SQL queries</p>
                  </div>
                </div>
                
                {/* Python Card */}
                <div className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  {/* Glowing backdrop that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-green-500/5 to-background opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Card header */}
                  <div className="p-4 border-b border-border bg-black flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Python</h3>
                    <div className="text-green-400">
                      <Code className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Code content */}
                  <div className="relative p-5 font-mono text-sm overflow-hidden h-48 bg-black">
                    <pre className="text-gray-300">
                      <code>
                        <span className="text-green-500">import</span> requests{"\n"}
                        <span className="text-green-500">from</span> datetime <span className="text-green-500">import</span> datetime{"\n"}
                        {"\n"}
                        <span className="text-yellow-500">def</span> <span className="text-yellow-300">fetch_snippets</span>(language=<span className="text-amber-300">"python"</span>, days=<span className="text-blue-400">7</span>):{"\n"}
                        <span className="text-blue-300">    """Fetch recent code snippets by language."""</span>{"\n"}
                        {"    "}url = <span className="text-amber-300">"https://api.snipstash.com/snippets"</span>{"\n"}
                        {"    "}params = {"{"}<span className="text-amber-300">"language"</span>: language{"}"}
                      </code>
                    </pre>
                    
                    {/* Overlay that appears on hover */}
                    <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 bg-background/20 border-white/20 text-white hover:bg-background/30"
                        onClick={() => copyToClipboard(pythonSnippet, "Python")}
                      >
                        <ClipboardCopy className="w-4 h-4" />
                        Copy Function
                      </Button>
                    </div>
                  </div>
                  
                  {/* Card footer */}
                  <div className="p-3 text-center border-t border-border bg-black">
                    <p className="text-sm font-medium text-white">Python Utilities</p>
                    <p className="text-xs text-gray-400">Save your Python helper functions</p>
                  </div>
                </div>
                
                {/* Bash Card */}
                <div className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  {/* Glowing backdrop that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-background opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Card header */}
                  <div className="p-4 border-b border-border bg-black flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Bash</h3>
                    <div className="bg-amber-500 text-white rounded p-1">
                      <span className="font-mono text-xs font-bold">$_</span>
                    </div>
                  </div>
                  
                  {/* Code content */}
                  <div className="relative p-5 font-mono text-sm overflow-hidden h-48 bg-black">
                    <pre className="text-gray-300">
                      <code>
                        <span className="text-gray-500"># Backup all code snippets to a file</span>{"\n"}
                        <span className="text-amber-400">#!/bin/bash</span>{"\n"}
                        {"\n"}
                        <span className="text-amber-400">backup_snippets</span>() {"{"}{"\n"}
                        {"  "}<span className="text-green-500">local</span> output_dir=<span className="text-amber-300">"$HOME/snippet_backups"</span>{"\n"}
                        {"  "}<span className="text-green-500">local</span> date_str=$(date +%Y-%m-%d){"\n"}
                        {"  "}<span className="text-green-500">local</span> output_file=<span className="text-amber-300">"$output_dir/snippets_$date_str.json"</span>
                      </code>
                    </pre>
                    
                    {/* Overlay that appears on hover */}
                    <div className="absolute inset-0 bg-amber-900/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 bg-background/20 border-white/20 text-white hover:bg-background/30"
                        onClick={() => copyToClipboard(bashSnippet, "Bash")}
                      >
                        <ClipboardCopy className="w-4 h-4" />
                        Copy Script
                      </Button>
                    </div>
                  </div>
                  
                  {/* Card footer */}
                  <div className="p-3 text-center border-t border-border bg-black">
                    <p className="text-sm font-medium text-white">Shell Scripts</p>
                    <p className="text-xs text-gray-400">Organize your automation scripts</p>
                  </div>
                </div>
              </div>
              
              {/* Caption */}
              <p className="text-center text-muted-foreground mt-6">
                Hover over a card to interact with example snippets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Smart features for developers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SnipStash helps you organize code snippets without extra effort
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Code />}
              title="Smart Auto-Tagging"
              description="Automatically categorizes your code with intelligent pattern recognition for loops, API calls, error handling, and more."
              className="hover-lift"
            />
            <FeatureCard 
              icon={<Database />}
              title="Multi-Language Support"
              description="Store snippets across JavaScript, Python, Bash, SQL and other languages with proper syntax highlighting."
              className="hover-lift"
            />
            <FeatureCard 
              icon={<Tag />}
              title="Custom Tagging"
              description="Add your own tags and descriptions to organize snippets your way in addition to the automatic categorization."
              className="hover-lift"
            />
            <FeatureCard 
              icon={<Search />}
              title="Powerful Search"
              description="Find any snippet instantly by language, tag, or full-text search within your code library."
              className="hover-lift"
            />
            <FeatureCard 
              icon={<ClipboardCopy />}
              title="One-Click Copy"
              description="Copy any snippet to your clipboard instantly, ready to paste into your project."
              className="hover-lift"
            />
            <FeatureCard 
              icon={<Zap />}
              title="Developer-First"
              description="Built by developers for developers, with a clean UI that gets out of your way."
              className="hover-lift"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How SnipStash works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple workflow to save and organize your code snippets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard 
              number={1}
              title="Save a snippet"
              description="Paste any code snippet, select the language, add optional title or tags."
              className="hover-lift"
            />
            <StepCard 
              number={2}
              title="Auto-categorization"
              description="SnipStash automatically analyzes your code and adds relevant tags based on patterns it detects."
              className="hover-lift"
            />
            <StepCard 
              number={3}
              title="Find and use"
              description="Search, filter and copy snippets whenever you need them in your projects."
              className="hover-lift"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-10 text-center max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to organize your code snippets?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join developers who are saving time and staying organized with SnipStash.
            </p>
            <Link href="/auth">
              <Button size="lg">
                Get started for free
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-auto">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" />
              <p className="mt-4 text-muted-foreground">
                The smart way to store and organize your code snippets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it works</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SnipStash. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component for feature cards
function FeatureCard({ icon, title, description, className }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-6", className)}>
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

// Component for step cards
function StepCard({ number, title, description, className }: {
  number: number;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-6 text-center", className)}>
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 mx-auto">
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
} 