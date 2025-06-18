
import type { ClientInquiry, ClientInquiryStatus } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Info, Phone } from "lucide-react";
import AIQuoteGeneratorClient from "@/components/admin/AIQuoteGeneratorClient";
import { format } from 'date-fns';
import { updateInquiryStatusAction } from "@/components/admin/actions";
import InquiryStatusDropdown from "@/components/admin/inquiries/InquiryStatusDropdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import { db } from "@/lib/firebase/config";
import { ref, get, child } from "firebase/database";

async function getInquiriesFromDB(): Promise<ClientInquiry[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `inquiries`));
    if (snapshot.exists()) {
      const inquiriesObject = snapshot.val();
      const inquiriesArray = Object.keys(inquiriesObject)
        .map(key => ({ id: key, ...inquiriesObject[key] }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
      return inquiriesArray as ClientInquiry[];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching inquiries from Firebase DB:", error);
    return [];
  }
}

export default async function AdminInquiriesPage({ searchParams }: { searchParams?: { id?: string, newInquiryId?: string, status?: string } }) {
  const clientInquiries = await getInquiriesFromDB();
  
  const selectedInquiryId = searchParams?.id || searchParams?.newInquiryId; 
  const selectedInquiry = selectedInquiryId 
    ? clientInquiries.find(inq => inq.id === selectedInquiryId) 
    : clientInquiries.length > 0 ? clientInquiries[0] : null; 

  const inquiryStatuses: ClientInquiryStatus[] = ['New', 'Contacted', 'Quoted', 'Closed'];
  
  return (
    <div className="space-y-8">
      {searchParams?.status === 'success' && searchParams?.newInquiryId && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
          <Info className="h-4 w-4 !text-green-700" />
          <AlertTitle>Inquiry Submitted!</AlertTitle>
          <AlertDescription>
            The new inquiry (ID: {searchParams.newInquiryId}) has been successfully logged. You can view its details below if not already selected.
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-bold text-primary">Client Inquiries</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">All Inquiries</CardTitle>
              <CardDescription>View and manage all client quote requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id} className={selectedInquiry?.id === inquiry.id ? "bg-muted/50" : ""}>
                      <TableCell>
                        <div className="font-medium">{inquiry.name}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">{inquiry.email}</div>
                        {inquiry.phoneNumber && <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1"><Phone size={12}/> {inquiry.phoneNumber}</div>}
                        {inquiry.company && <div className="text-xs text-muted-foreground hidden sm:block"><em>{inquiry.company}</em></div>}
                      </TableCell>
                      <TableCell>{inquiry.serviceRequested}</TableCell>
                      <TableCell className="hidden md:table-cell">{format(new Date(inquiry.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                         <Badge variant={
                          inquiry.status === 'New' ? 'default' :
                          inquiry.status === 'Contacted' ? 'secondary' :
                          inquiry.status === 'Quoted' ? 'outline' : 
                          'destructive'
                        }
                        className={
                            inquiry.status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                            inquiry.status === 'Quoted' ? 'bg-purple-100 text-purple-700 border-purple-300' : 
                            'bg-gray-100 text-gray-700 border-gray-300' // Closed
                        }
                        >
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/inquiries?id=${inquiry.id}`} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <InquiryStatusDropdown
                          inquiryId={inquiry.id}
                          currentStatus={inquiry.status}
                          allStatuses={inquiryStatuses}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {clientInquiries.length === 0 && (
                <p className="p-4 text-center text-muted-foreground">No inquiries found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {selectedInquiry ? (
            <Card className="shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Inquiry Details</CardTitle>
                <CardDescription>From: {selectedInquiry.name} ({selectedInquiry.email})</CardDescription>
                {selectedInquiry.company && <CardDescription>Company: {selectedInquiry.company}</CardDescription>}
                 {selectedInquiry.phoneNumber && (
                  <CardDescription className="flex items-center gap-1">
                    <Phone size={14} className="text-muted-foreground"/> {selectedInquiry.phoneNumber}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Service Requested:</strong> {selectedInquiry.serviceRequested}</p>
                <p><strong>Date:</strong> {format(new Date(selectedInquiry.date), "PPP p")}</p>
                <div className="flex items-center gap-2">
                  <strong>Status:</strong> 
                   <Badge variant={
                        selectedInquiry.status === 'New' ? 'default' :
                        selectedInquiry.status === 'Contacted' ? 'secondary' :
                        selectedInquiry.status === 'Quoted' ? 'outline' : 
                        'destructive'
                        }
                        className={
                            selectedInquiry.status === 'New' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            selectedInquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                            selectedInquiry.status === 'Quoted' ? 'bg-purple-100 text-purple-700 border-purple-300' : 
                            'bg-gray-100 text-gray-700 border-gray-300'
                        }
                    >
                        {selectedInquiry.status}
                    </Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Request Details:</h4>
                  <div className="whitespace-pre-wrap p-2 border rounded-md bg-muted/30 text-xs max-h-40 overflow-y-auto">{selectedInquiry.details}</div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                 {inquiryStatuses.map(status => (
                    <form key={status} action={async () => {
                        "use server";
                        if (selectedInquiry && typeof selectedInquiry.id === 'string') {
                           await updateInquiryStatusAction(selectedInquiry.id, status);
                        } else {
                            console.error("Selected inquiry or ID is invalid for status update.");
                        }
                    }}>
                        <Button 
                            type="submit" 
                            variant="outline" 
                            size="sm"
                            disabled={selectedInquiry.status === status}
                            className="text-xs"
                        >
                           Mark as {status}
                        </Button>
                    </form>
                 ))}
              </CardFooter>
            </Card>
          ) : (
             <Card className="shadow-lg sticky top-6">
                <CardContent className="p-6 text-center text-muted-foreground">
                    Select an inquiry from the list to view details, generate a quote, or update status.
                </CardContent>
            </Card>
          )}
          
          {selectedInquiry && (
             <AIQuoteGeneratorClient 
                key={selectedInquiry.id} // Use selectedInquiry.id as key
                inquiryId={selectedInquiry.id}
                initialRequestDetails={selectedInquiry.details}
            />
          )}

          {selectedInquiry?.generatedQuote && (
            <Card className="shadow-md bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Previously Generated Quote (Bilingual)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <h4 className="font-semibold text-green-600">Project Scope (English):</h4>
                  <div className="whitespace-pre-wrap text-green-800/80 p-1 border border-green-200 rounded-md bg-white max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.projectScope.en}</div>
                  <h4 className="font-semibold text-green-600 mt-1.5">Alcance del Proyecto (Español):</h4>
                  <div className="whitespace-pre-wrap text-green-800/80 p-1 border border-green-200 rounded-md bg-white max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.projectScope.es}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Cost Estimate (English):</h4>
                  <div className="whitespace-pre-wrap text-green-800/80 p-1 border border-green-200 rounded-md bg-white max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.costEstimate.en}</div>
                  <h4 className="font-semibold text-green-600 mt-1.5">Estimación de Costo (Español):</h4>
                  <div className="whitespace-pre-wrap text-green-800/80 p-1 border border-green-200 rounded-md bg-white max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.costEstimate.es}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Additional Notes (English):</h4>
                  <div className="whitespace-pre-wrap text-green-800/80 p-1 border border-green-200 rounded-md bg-white max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.additionalNotes.en}</div>
                  <h4 className="font-semibold text-green-600 mt-1.5">Notas Adicionales (Español):</h4>
                  <div className="whitespace-pre-wrap text-green-800/80 p-1 border border-green-200 rounded-md bg-white max-h-32 overflow-y-auto">{selectedInquiry.generatedQuote.additionalNotes.es}</div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
