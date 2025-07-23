"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"

export default function AlertSetupDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Setup Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setup a New Alert</DialogTitle>
          <DialogDescription>
            Configure alerts for critical metrics to get notified.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="metric" className="text-right">
              Metric
            </Label>
            <Select>
              <SelectTrigger id="metric" className="col-span-3">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery_rate">Delivery Rate</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="sent_count">Sent Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="condition" className="text-right">
              Condition
            </Label>
            <Select>
              <SelectTrigger id="condition" className="col-span-3">
                <SelectValue placeholder="Select a condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below">Is below</SelectItem>
                <SelectItem value="above">Is above</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="threshold" className="text-right">
              Threshold
            </Label>
            <Input id="threshold" type="number" placeholder="e.g. 90" className="col-span-3" />
          </div>
          <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-4 md:items-center md:gap-4">
            <Label htmlFor="message" className="md:text-right">
              Message
            </Label>
            <Textarea
              id="message"
              className="col-span-3"
              placeholder="e.g. Delivery rate for {product} is {value}%, which is below the threshold of {threshold}%."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Alert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
