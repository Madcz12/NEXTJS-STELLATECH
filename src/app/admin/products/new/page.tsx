"use client"

import Link from "next/link";
import { ChevronLeft, Upload } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct } from "@/lib/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}

export default function NewProductPage() {
  return (
    <form action={createProduct}>
      <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild type="button">
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Create Product
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" type="button" asChild>
              <Link href="/admin/products">Discard</Link>
            </Button>
            <SubmitButton />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Enter the basic information for the product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full"
                      placeholder="Product name"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Product description"
                      className="min-h-32"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="0"
                      defaultValue="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="e.g., Laptops, Components, Peripherals"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>
                  Enter an image URL for the product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm" type="button" asChild>
            <Link href="/admin/products">Discard</Link>
          </Button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
