'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CodingPractice } from '@/components/v2/l1n3ar/coding-practice';
import { OffTheClock } from '@/components/v2/l1n3ar/off-the-clock';
import type { CodingProfiles, OffTheClock as OffTheClockContent } from '@/lib/types';

export function L1n3ar({
  codingProfiles, offTheClock,
}: {
  codingProfiles?: CodingProfiles;
  offTheClock: OffTheClockContent;
}) {
  return (
    <div>
      <Tabs defaultValue="coding">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="coding" className="text-0_7">Coding Practice</TabsTrigger>
          <TabsTrigger value="offclock" className="text-0_7">Off the clock</TabsTrigger>
        </TabsList>
        <TabsContent value="coding">
          <CodingPractice profiles={codingProfiles} />
        </TabsContent>
        <TabsContent value="offclock">
          <OffTheClock content={offTheClock} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
