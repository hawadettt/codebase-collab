'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart, Globe, Trophy } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function HomePage() {
    const { t } = useLanguage();
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

    return (
        <div className="flex flex-col gap-6">
            <Card className="relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg p-6 text-center text-white">
                {heroImage && 
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover -z-10 brightness-50"
                        data-ai-hint={heroImage.imageHint}
                    />
                }
                <div className="max-w-3xl">
                    <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl drop-shadow-md">
                        {t.homeTitle}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-neutral-200">
                        {t.homeDescription}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button size="lg" asChild>
                            <Link href="/dashboard">{t.sidebarDashboard} <ArrowRight className="ms-2 h-5 w-5" /></Link>
                        </Button>
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/services">{t.sidebarServices}</Link>
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Trophy className="h-10 w-10 text-primary" />
                            <div>
                                <CardTitle>{t.stat1Title}</CardTitle>
                                <CardDescription>{t.stat1Value}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                         <div className="flex items-center gap-4">
                            <Globe className="h-10 w-10 text-primary" />
                            <div>
                                <CardTitle>{t.stat2Title}</CardTitle>
                                <CardDescription>{t.stat2Value}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                         <div className="flex items-center gap-4">
                            <BarChart className="h-10 w-10 text-primary" />
                            <div>
                                <CardTitle>{t.stat3Title}</CardTitle>
                                <CardDescription>{t.stat3Value}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
