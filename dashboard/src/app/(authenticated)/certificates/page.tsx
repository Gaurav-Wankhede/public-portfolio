"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Plus } from "lucide-react";
import { fetchData, getAuthHeaders } from "@/lib/api-utils";
import { CertificateCard } from "./_components/CertificateCard";
import { CertificateForm } from "./_components/CertificateForm";
import { SearchBar } from "./_components/SearchBar";
import { LoadingSkeleton } from "./_components/LoadingSkeleton";
import { EmptyState } from "./_components/EmptyState";

interface Certificate {
  slug: string;
  name: string;
  issuer: string;
  link: string;
  issue_date: string;
  image_url?: string;
}

interface CertificateFormData {
  name: string;
  issuer: string;
  link: string;
  issue_date: string;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

function CertificatesPage() {
  const [mounted, setMounted] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificateFormData>({
    name: "",
    issuer: "",
    link: "",
    issue_date: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData("/certificates");
        const sortedData = data.sort(
          (a: Certificate, b: Certificate) =>
            new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
        );
        setCertificates(sortedData);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setNotification({
          type: "error",
          message: "Failed to load certificates.",
        });
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return null;
  }

  const filteredCertificates = certificates.filter((certificate) => {
    const query = searchQuery.toLowerCase();
    return (
      certificate.name.toLowerCase().includes(query) ||
      certificate.issuer.toLowerCase().includes(query)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("issuer", formData.issuer);
      formDataToSend.append("link", formData.link);
      formDataToSend.append("issue_date", formData.issue_date);
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const endpoint =
        isEditingCertificate && editingSlug
          ? `/api/certificates/${editingSlug}`
          : `/api/certificates`;

      const response = await fetch(endpoint, {
        method: isEditingCertificate ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditingCertificate ? "update" : "create"} certificate`,
        );
      }

      setNotification({
        type: "success",
        message: `Certificate ${isEditingCertificate ? "updated" : "created"} successfully!`,
      });

      // Refresh certificates
      const data = await fetchData("/certificates");
      const sortedData = data.sort(
        (a: Certificate, b: Certificate) =>
          new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
      );
      setCertificates(sortedData);

      // Reset form
      setFormData({ name: "", issuer: "", link: "", issue_date: "" });
      setImageFile(null);
      setIsAddingCertificate(false);
      setIsEditingCertificate(false);
      setEditingSlug(null);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error(
        `Error ${isEditingCertificate ? "updating" : "creating"} certificate:`,
        error,
      );
      setNotification({
        type: "error",
        message: `Failed to ${isEditingCertificate ? "update" : "create"} certificate.`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setFormData({
      name: certificate.name,
      issuer: certificate.issuer,
      link: certificate.link,
      issue_date: certificate.issue_date,
    });
    setEditingSlug(certificate.slug);
    setIsAddingCertificate(true);
    setIsEditingCertificate(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }

    try {
      const response = await fetch(`/api/certificates/${slug}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete certificate");
      }

      setNotification({
        type: "success",
        message: "Certificate deleted successfully!",
      });

      // Refresh certificates
      const data = await fetchData("/certificates");
      const sortedData = data.sort(
        (a: Certificate, b: Certificate) =>
          new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
      );
      setCertificates(sortedData);

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setNotification({
        type: "error",
        message: "Failed to delete certificate.",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", issuer: "", link: "", issue_date: "" });
    setImageFile(null);
    setIsAddingCertificate(false);
    setIsEditingCertificate(false);
    setEditingSlug(null);
  };

  return (
    <div
      className="container mx-auto py-10 px-4 sm:px-6 lg:px-8"
      suppressHydrationWarning
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" suppressHydrationWarning>
          Certificates
        </h1>
        <p className="text-muted-foreground" suppressHydrationWarning>
          Manage your professional certifications and credentials
        </p>
      </div>

      {notification && (
        <Alert
          variant={notification.type === "success" ? "default" : "destructive"}
          className="mb-6"
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {notification.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {!isAddingCertificate && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search certificates by name or issuer..."
            className="flex-1"
          />
          <Button
            onClick={() => setIsAddingCertificate(true)}
            className="sm:w-auto w-full"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add New Certificate
          </Button>
        </div>
      )}

      {isAddingCertificate && (
        <CertificateForm
          data={formData}
          isEditing={isEditingCertificate}
          imageFile={imageFile}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onImageChange={handleImageChange}
          onCancel={handleCancel}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} />
        </div>
      ) : filteredCertificates.length === 0 ? (
        <EmptyState
          isSearching={searchQuery.length > 0}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.slug}
              certificate={certificate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CertificatesPage;
