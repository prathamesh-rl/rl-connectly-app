"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MonthlyOverviewTab from "@/components/dashboard/tabs/monthly-overview-tab"
import ProductViewTab from "@/components/dashboard/tabs/product-view-tab"
import ProjectViewTab from "@/components/dashboard/tabs/project-view-tab"
import CampaignPerformanceTab from "@/components/dashboard/tabs/campaign-performance-tab"
import AlertSetupDialog from "@/components/dashboard/alert-setup-dialog"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline text-left">Dashboard</h1>
        <div className="ml-auto">
          <AlertSetupDialog />
        </div>
      </div>

      <Tabs defaultValue="monthly-overview" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="monthly-overview">Monthly Overview</TabsTrigger>
          <TabsTrigger value="product-view">Product View</TabsTrigger>
          <TabsTrigger value="project-view">Project View</TabsTrigger>
          <TabsTrigger value="campaign-performance">Campaigns</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly-overview" className="mt-6">
          <MonthlyOverviewTab />
        </TabsContent>
        <TabsContent value="product-view" className="mt-6">
          <ProductViewTab />
        </TabsContent>
        <TabsContent value="project-view" className="mt-6">
          <ProjectViewTab />
        </TabsContent>
        <TabsContent value="campaign-performance" className="mt-6">
          <CampaignPerformanceTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
