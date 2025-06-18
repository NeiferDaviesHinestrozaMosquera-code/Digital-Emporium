
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/testimonials">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Testimonials</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Add New Testimonial</h1>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
          <CardDescription>Fill in the information for the new testimonial.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialForm formAction="create" />
        </CardContent>
      </Card>
    </div>
  );
}
