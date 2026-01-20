
"use client";

import { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  analyzeCodebaseForErrors,
  AnalyzeCodebaseForErrorsOutput,
} from "@/ai/flows/analyze-codebase-for-errors";
import {
  suggestCodeImprovements,
  SuggestCodeImprovementsOutput,
} from "@/ai/flows/suggest-code-improvements";
import {
  Bug,
  Lightbulb,
  ShieldAlert,
  Zap,
  Save,
  Loader2,
  FileCode,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";

type AnalysisResult = AnalyzeCodebaseForErrorsOutput & SuggestCodeImprovementsOutput;

const initialCode = `
import React, { useState } from 'react';

function InefficientComponent({ items }) {
  // This is an inefficient way to filter items on every render.
  const visibleItems = items.filter(item => {
    console.log('Filtering...');
    return item.isVisible;
  });

  return (
    <ul>
      {visibleItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

const App = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Item 1', isVisible: true },
    { id: 2, name: 'Item 2', isVisible: false },
    { id: 3, name: 'Item 3', isVisible: true },
  ]);

  // Unused variable
  const unused = 'I am not used';

  return (
    <div>
      <h1>My App</h1>
      <InefficientComponent items={data} />
      <button onClick={() => setData([...data])}>Re-render</button>
    </div>
  );
};

export default App;
`;

export default function CodeCollabDashboard() {
  const [code, setCode] = useState<string>(initialCode);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const [analysis, improvements] = await Promise.all([
        analyzeCodebaseForErrors({ codebase: code }),
        suggestCodeImprovements({ codebase: code, programmingLanguage: "typescript" }),
      ]);
      setAnalysisResult({ ...analysis, ...improvements });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to save your code.",
      });
      return;
    }
    const collectionRef = collection(firestore, 'users', user.uid, 'documents');
    addDocumentNonBlocking(collectionRef, {
      code,
      createdAt: serverTimestamp(),
      version: 1,
    });
    toast({
      title: "Code Saved",
      description: `Your code has been saved successfully.`,
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col">
            <Header />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <div className="grid h-full gap-6 lg:grid-cols-2">
                <Card className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-headline">Code Editor</CardTitle>
                      <CardDescription>Paste or write your code below.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-block">
                              <Button
                                onClick={handleSave}
                                variant="outline"
                                disabled={!user || isUserLoading}
                              >
                                <Save className="mr-2 h-4 w-4" /> Save
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!user && (
                            <TooltipContent>
                              <p>Please log in to save your code.</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                      <Button onClick={handleAnalyze} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="mr-2 h-4 w-4" />
                        )}
                        Analyze
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter your code here..."
                      className="h-full min-h-[60vh] resize-none font-code text-sm"
                    />
                  </CardContent>
                </Card>
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">AI Analysis</CardTitle>
                    <CardDescription>Errors, vulnerabilities, and improvements found by AI.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {isLoading && (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <p>Analyzing your code...</p>
                        </div>
                      </div>
                    )}
                    {!isLoading && !analysisResult && (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                          <FileCode className="h-12 w-12" />
                          <h3 className="font-semibold">Ready to analyze</h3>
                          <p className="max-w-xs text-sm">Click the 'Analyze' button to get insights on your code.</p>
                        </div>
                      </div>
                    )}
                    {analysisResult && (
                      <Accordion type="multiple" defaultValue={["errors", "vulnerabilities", "improvements"]} className="w-full">
                        <AnalysisSection title="Errors" icon={<Bug className="h-4 w-4 text-destructive" />} data={analysisResult.errors} />
                        <AnalysisSection title="Vulnerabilities" icon={<ShieldAlert className="h-4 w-4 text-chart-4" />} data={analysisResult.vulnerabilities} />
                        <AnalysisSection title="Improvements" icon={<Lightbulb className="h-4 w-4 text-chart-2" />} data={analysisResult.improvements} />
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AnalysisSection({ title, icon, data }: { title: string, icon: React.ReactNode, data: string[] }) {
  if (!data || data.length === 0) return null;

  return (
    <AccordionItem value={title.toLowerCase()}>
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">{data.length}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  )
}
