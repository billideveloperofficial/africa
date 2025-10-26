"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Button } from "./ui/button"

const niches = ["Fashion", "Beauty", "Lifestyle", "Tech", "Gaming", "Travel", "Food", "Health", "Fitness", "Music"]
const platforms = ["TikTok", "Instagram", "YouTube", "Twitter"]

export function FilterSidebar() {
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Accordion type="multiple" defaultValue={['niche', 'followers', 'price', 'platform']} className="w-full">
                    <AccordionItem value="niche">
                        <AccordionTrigger className="text-base font-semibold">Niche</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            {niches.map(niche => (
                                <div key={niche} className="flex items-center space-x-2">
                                    <Checkbox id={`niche-${niche}`} />
                                    <Label htmlFor={`niche-${niche}`} className="font-normal">{niche}</Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="platform">
                        <AccordionTrigger className="text-base font-semibold">Platform</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            {platforms.map(platform => (
                                <div key={platform} className="flex items-center space-x-2">
                                    <Checkbox id={`platform-${platform}`} />
                                    <Label htmlFor={`platform-${platform}`} className="font-normal">{platform}</Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="followers">
                        <AccordionTrigger className="text-base font-semibold">Followers</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <RadioGroup defaultValue="any" className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="any" id="any" />
                                    <Label htmlFor="any" className="font-normal">Any</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1k-10k" id="1k-10k" />
                                    <Label htmlFor="1k-10k" className="font-normal">1K - 10K</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="10k-100k" id="10k-100k" />
                                    <Label htmlFor="10k-100k" className="font-normal">10K - 100K</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="100k-1m" id="100k-1m" />
                                    <Label htmlFor="100k-1m" className="font-normal">100K - 1M</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1m+" id="1m+" />
                                    <Label htmlFor="1m+" className="font-normal">1M+</Label>
                                </div>
                            </RadioGroup>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="price">
                        <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                           <Slider defaultValue={[50, 500]} max={1000} step={10} />
                           <div className="flex justify-between items-center gap-4">
                               <Input type="number" placeholder="$50" />
                               <span className="text-muted-foreground">-</span>
                               <Input type="number" placeholder="$500" />
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Button className="w-full">Apply Filters</Button>
            </CardContent>
        </Card>
    )
}
