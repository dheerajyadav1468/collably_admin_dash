"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { InfoIcon } from "lucide-react"
import DefaultLayoutBrand from "../../components/Layouts/DefaultLayoutBrand"

const steps: string[] = ["General", "Usage Restriction", "Usage Limit"]

export default function CouponCreate() {
  const [currentStep, setCurrentStep] = useState<number>(0)

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <DefaultLayoutBrand>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center">
          <h1 className="text-3xl font-bold text-white">Coupon Create</h1>
          <div className="ml-4 h-1 flex-1 rounded bg-muted">
            <div
              className="h-1 rounded bg-[#ff0055] transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-secondary bg-card">
          <CardContent className="p-6">
            <div className="flex gap-4 border-b border-secondary pb-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`cursor-pointer border-b-2 pb-2 font-medium ${
                    index === currentStep
                      ? "border-[#ff0055] text-[#ff0055]"
                      : "border-transparent text-white"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {step}
                </div>
              ))}
            </div>

            {currentStep === 0 && (
              <div className="mt-6 grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">
                    Name<span className="text-red-500">*</span>
                  </Label>
                  <Input id="name" placeholder="Name" className="bg-black" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="code" className="text-white">
                    Code<span className="text-red-500">*</span>
                  </Label>
                  <Input id="code" placeholder="Code" className="bg-black" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discount-type" className="text-white">
                    Discount Type
                  </Label>
                  <Select defaultValue="flat">
                    <SelectTrigger className="bg-black">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discount-amount" className="text-white">
                    Discount Amount<span className="text-red-500">*</span>
                  </Label>
                  <Input id="discount-amount" placeholder="Discount Amount" className="bg-black" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="free-shipping" />
                  <Label htmlFor="free-shipping" className="text-white">
                    Check this box if the coupon grants free shipping. A free shipping method must be enabled in your
                    shipping zone and be set to require &apos;a valid free shipping coupon&apos;
                  </Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="start-date" className="text-white">
                    Start Date<span className="text-red-500">*</span>
                  </Label>
                  <Input id="start-date" type="date" className="bg-white" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="end-date" className="text-white">
                    End Date<span className="text-red-500">*</span>
                  </Label>
                  <Input id="end-date" type="date" className="bg-white" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-white">
                    Status
                  </Label>
                  <Select defaultValue="active">
                    <SelectTrigger className="bg-black">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="mt-6 grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="vendor" className="text-white">
                    Brand
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-black">
                      <SelectValue placeholder="Search for Brand by name" />
                    </SelectTrigger>
                    <SelectContent className="bg-black">
                      <SelectItem value="vendor1">Brand 1</SelectItem>
                      <SelectItem value="vendor2">Brand 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="products" className="text-white">
                    Products
                  </Label>
                  <Input id="products" placeholder="Products" className="bg-black" />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="minimum-spend" className="text-white">
                      Minimum Spend
                    </Label>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input id="minimum-spend" placeholder="Minimum Spend" className="bg-black" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="mt-6 grid gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="usage-limit" className="text-white">
                      Usage Limit
                    </Label>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input id="usage-limit" placeholder="Usage Limit" className="bg-black" />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {currentStep === 0 ? (
                <div />
              ) : (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-secondary bg-background text-white hover:bg-secondary"
                >
                  Previous
                </Button>
              )}
              {currentStep === steps.length - 1 ? (
                <Button className="bg-[#ff0055] text-white hover:bg-[#e6234d]">Save</Button>
              ) : (
                <Button onClick={handleNext} className="bg-[#ff0055] text-white hover:bg-[#e6234d]">
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayoutBrand>
  )
}
