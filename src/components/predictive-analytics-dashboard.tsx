'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-provider";
import { Brain, Bot, Loader2, CalendarClock, TrendingUp, Sparkles, MapPin, Search, Info, Satellite, Cloudy, Wind, Snowflake, Sunrise, Flame } from "lucide-react";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { predictHarvestTime, PredictHarvestTimeOutput } from '@/ai/flows/predict-harvest-time';
import { findMarketOpportunities, FindMarketOpportunitiesOutput } from '@/ai/flows/find-market-opportunities';
import { getMarketSignal, GetMarketSignalOutput, MarketSignal } from '@/ai/flows/get-market-signal';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Thermometer } from 'lucide-react';


function HarvestAdvisor() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [crop, setCrop] = useState('');
    const [location, setLocation] = useState('Egypt');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PredictHarvestTimeOutput | null>(null);

    const handlePredict = async () => {
        if (!crop.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const prediction = await predictHarvestTime({ 
                crop, 
                location,
                language: language === 'ar' ? 'Arabic' : 'English'
            });
            setResult(prediction);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: t.aiSearchFailTitle, description: t.aiSearchFailDescription });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 rounded-lg border p-6">
            <h3 className="font-headline text-xl flex items-center gap-2"><CalendarClock className="h-5 w-5 text-primary" />{t.harvestAdvisorTitle}</h3>
            <p className="text-muted-foreground">{t.harvestAdvisorDescription}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="crop-harvest">{t.harvestAdvisorCropLabel}</Label>
                    <Input id="crop-harvest" value={crop} onChange={e => setCrop(e.target.value)} placeholder="e.g. Navel Oranges"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location-harvest">{t.harvestAdvisorLocationLabel}</Label>
                    <Input id="location-harvest" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Minya, Egypt"/>
                </div>
            </div>
            <Button onClick={handlePredict} disabled={isLoading}>
                {isLoading && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                {t.harvestAdvisorButton}
            </Button>
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mx-4 text-muted-foreground">{t.geminiAnalyzing}</p>
                </div>
            )}
            {result && (
                <div className="space-y-4 pt-4">
                    <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle className="font-bold">{result.optimalWindow}</AlertTitle>
                        <AlertDescription>{t.harvestResultsTitle}</AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        <h4 className="font-semibold">{t.harvestFactorsTitle}</h4>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-sm">
                            {result.keyFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold">{t.harvestAdviceTitle}</h4>
                        <p className="text-muted-foreground text-sm">{result.strategicAdvice}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function MarketOpportunityFinder() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [crop, setCrop] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FindMarketOpportunitiesOutput | null>(null);

    const handleSearch = async () => {
        if (!crop.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const opportunities = await findMarketOpportunities({ 
                crop, 
                exportingCountry: "Egypt",
                language: language === 'ar' ? 'Arabic' : 'English'
            });
            setResult(opportunities);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: t.aiSearchFailTitle, description: t.aiSearchFailDescription });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 rounded-lg border p-6">
            <h3 className="font-headline text-xl flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />{t.marketOpportunityTitle}</h3>
            <p className="text-muted-foreground">{t.marketOpportunityDescription}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="crop-market">{t.marketOpportunityCropLabel}</Label>
                    <Input id="crop-market" value={crop} onChange={e => setCrop(e.target.value)} placeholder="e.g. Egyptian Garlic"/>
                </div>
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                {t.marketOpportunityButton}
            </Button>
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mx-4 text-muted-foreground">{t.geminiAnalyzing}</p>
                </div>
            )}
            {result && (
                <div className="space-y-4 pt-4">
                   <h4 className="font-semibold">{t.marketOpportunityResultsTitle}</h4>
                    {result.opportunities.map((opp, i) => (
                        <div key={i} className="p-4 border rounded-md bg-muted/30">
                            <div className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4" /> {opp.region} ({opp.window})</div>
                            <p className="font-semibold text-primary">{opp.opportunity}</p>
                            <p className="text-sm text-muted-foreground">{opp.reasoning}</p>
                            <p className="text-xs font-mono pt-2">{t.confidenceScore}: {opp.confidenceScore.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const weatherData = [
  { day: 'Mon', temp: 28 },
  { day: 'Tue', temp: 30 },
  { day: 'Wed', temp: 32 },
  { day: 'Thu', temp: 31 },
  { day: 'Fri', temp: 29 },
  { day: 'Sat', temp: 27 },
  { day: 'Sun', temp: 26 },
];
const chartConfig = {
  temp: {
    label: "Temp (°C)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function SatelliteDashboard() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4 rounded-lg border p-6">
        <h3 className="font-headline text-xl flex items-center gap-2"><Satellite className="h-5 w-5 text-primary" />{t.satelliteDashboardTitle}</h3>
        <p className="text-muted-foreground">{t.satelliteDashboardDescription}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t.satelliteCropHealth}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold">88%</span>
                            <Progress value={88} className="h-4 flex-1" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Based on NDVI index analysis</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t.satelliteHarvestPrediction}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                           <CalendarClock className="h-8 w-8 text-primary" />
                           <div >
                                <p className="text-2xl font-bold">14-20 Nov</p>
                                <p className="text-xs text-muted-foreground">Optimal harvest window</p>
                           </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t.satelliteWeatherForecast}</CardTitle>
                    <CardDescription>Next 7 days (Mock Data)</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] w-full">
                   <ChartContainer config={chartConfig} className="h-full w-full">
                      <LineChart data={weatherData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis hide/>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line dataKey="temp" type="monotone" stroke="var(--color-temp)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

function MarketSignalIndex() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [crop, setCrop] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GetMarketSignalOutput | null>(null);

    const handleSearch = async () => {
        if (!crop.trim()) return;
        setIsLoading(true);
        setResult(null);
        try {
            const signal = await getMarketSignal({ 
                crop, 
                exportingCountry: "Egypt",
                language: language === 'ar' ? 'Arabic' : 'English'
            });
            setResult(signal);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: t.aiSearchFailTitle, description: t.aiSearchFailDescription });
        } finally {
            setIsLoading(false);
        }
    };

    const getSignalUI = (signal: MarketSignal | undefined) => {
        switch (signal) {
            case 'SELL_NOW': return <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700"><p className="font-bold text-green-800 dark:text-green-200">{t.marketSignalSell}</p></div>;
            case 'MONITOR': return <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700"><p className="font-bold text-yellow-800 dark:text-yellow-200">{t.marketSignalMonitor}</p></div>;
            case 'WAIT': return <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700"><p className="font-bold text-red-800 dark:text-red-200">{t.marketSignalWait}</p></div>;
            default: return null;
        }
    }
    
    return (
        <div className="space-y-4 rounded-lg border p-6">
            <h3 className="font-headline text-xl flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />{t.marketIndexTitle}</h3>
            <p className="text-muted-foreground">{t.marketIndexDescription}</p>
             <div className="flex items-end gap-2">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="crop-signal">{t.marketIndexCropLabel}</Label>
                    <Input id="crop-signal" value={crop} onChange={e => setCrop(e.target.value)} placeholder="e.g. Egyptian Onions"/>
                </div>
                 <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
                    {t.marketIndexButton}
                </Button>
            </div>
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mx-4 text-muted-foreground">{t.geminiAnalyzing}</p>
                </div>
            )}
            {result && (
                <div className="space-y-4 pt-4">
                    <div>
                        <h4 className="font-semibold mb-2">{t.marketIndexSignal}</h4>
                        {getSignalUI(result.signal)}
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">{t.marketIndexReasoning}</h4>
                        <p className="text-muted-foreground text-sm">{result.reasoning}</p>
                        <p className="text-xs font-mono pt-2">{t.confidenceScore}: {result.confidenceScore.toFixed(2)}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function ClimateAlerts() {
    const { t } = useLanguage();
    const alerts = [
        { type: t.climateAlertHeatwave, farm: 'Wadi Farms, Minya', desc: t.climateAlertHeatwaveDesc, icon: <Flame className="h-5 w-5 text-red-500" /> },
        { type: t.climateAlertFrost, farm: 'Delta Greens, Beheira', desc: t.climateAlertFrostDesc, icon: <Snowflake className="h-5 w-5 text-blue-400" /> },
        { type: t.climateAlertHighWind, farm: 'Sinai Orchards, North Sinai', desc: t.climateAlertHighWindDesc, icon: <Wind className="h-5 w-5 text-gray-500" /> },
    ];
    return (
        <div className="space-y-4 rounded-lg border p-6">
            <h3 className="font-headline text-xl flex items-center gap-2"><Cloudy className="h-5 w-5 text-primary" />{t.climateAlertsTitle}</h3>
            <p className="text-muted-foreground">{t.climateAlertsDescription}</p>
            <div className="space-y-4">
                {alerts.map((alert, i) => (
                    <Alert key={i} variant={alert.type === t.climateAlertHeatwave ? "destructive" : "default"}>
                        {alert.icon}
                        <AlertTitle>{alert.type}: {alert.farm}</AlertTitle>
                        <AlertDescription>
                            {alert.desc}
                        </AlertDescription>
                    </Alert>
                ))}
            </div>
        </div>
    )
}


export function PredictiveAnalyticsDashboard() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Brain className="h-6 w-6" /> {t.predictiveAnalyticsTitle}
          </CardTitle>
          <CardDescription>{t.predictiveAnalyticsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <Info className="h-4 w-4 !text-blue-500" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">{t.aiDataSourceTitle}</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                    {t.aiDataSourceDescription}
                </AlertDescription>
            </Alert>
            <SatelliteDashboard />
            <Separator />
            <MarketSignalIndex />
            <Separator />
            <ClimateAlerts />
            <Separator />
            <HarvestAdvisor />
            <Separator />
            <MarketOpportunityFinder />
        </CardContent>
      </Card>
    </div>
  );
}
