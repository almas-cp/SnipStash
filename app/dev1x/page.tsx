"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type User = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
};

type Snippet = {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[] | string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type DebugData = {
  users: User[];
  snippets: Snippet[];
  meta: {
    userCount: number;
    snippetCount: number;
    timestamp: string;
  };
};

export default function Dev1xPage() {
  const [data, setData] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/dev1x");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Error fetching debug data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Debug View: Data Directory</h1>
          <p className="text-muted-foreground mt-2">
            This page displays the current contents of the data directory for debugging purposes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            Refresh Data
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Debug Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      ) : data ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>Summary information about the data files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded bg-muted">
                  <p className="text-sm font-medium">User Count</p>
                  <p className="text-2xl font-bold">{data.meta.userCount}</p>
                </div>
                <div className="p-4 rounded bg-muted">
                  <p className="text-sm font-medium">Snippet Count</p>
                  <p className="text-2xl font-bold">{data.meta.snippetCount}</p>
                </div>
                <div className="p-4 rounded bg-muted">
                  <p className="text-sm font-medium">Last Refreshed</p>
                  <p className="text-sm">{formatDate(data.meta.timestamp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users ({data.users.length})</TabsTrigger>
              <TabsTrigger value="snippets">Snippets ({data.snippets.length})</TabsTrigger>
              <TabsTrigger value="raw">Raw JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.users.map(user => (
                  <Card key={user.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        <span>{user.name || "No Name"}</span>
                        <span className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</span>
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p><span className="font-medium">Created:</span> {formatDate(user.createdAt)}</p>
                        <p><span className="font-medium">Updated:</span> {formatDate(user.updatedAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="snippets">
              <div className="grid grid-cols-1 gap-4">
                {data.snippets.map(snippet => (
                  <Card key={snippet.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{snippet.title}</CardTitle>
                        <span className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                          {snippet.language}
                        </span>
                      </div>
                      <CardDescription>{snippet.description || "No description"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-3 rounded-md overflow-x-auto max-h-40">
                        <pre className="text-sm">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm"><span className="font-medium">Owner ID:</span> {snippet.userId}</p>
                        <p className="text-sm"><span className="font-medium">Created:</span> {formatDate(snippet.createdAt)}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Array.isArray(snippet.tags) ? 
                            snippet.tags.map((tag, i) => (
                              <span key={i} className="bg-muted text-xs px-2 py-1 rounded">{tag}</span>
                            ))
                            : typeof snippet.tags === 'string' ? 
                              <span className="bg-muted text-xs px-2 py-1 rounded">{snippet.tags}</span>
                              : null
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw JSON Data</CardTitle>
                  <CardDescription>Complete data from JSON files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
} 