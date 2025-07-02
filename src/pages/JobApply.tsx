/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { ChevronLeft } from "lucide-react";

const JobApply = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResumeFile(file);
        setResumeError(null);
      } else {
        setResumeError("Only PDF or Word files are allowed.");
        setResumeFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    if (!resumeFile) {
      setResumeError("Please upload your resume (PDF or Word).");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("jobId", String(jobId));
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("coverLetter", form.coverLetter);
      formData.append("resume", resumeFile);

      const res = await api.post("/public/career/jobs/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setSuccess("Your application has been submitted!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          coverLetter: "",
        });
        setResumeFile(null);
        setTimeout(() => navigate("/careers"), 2000);
      } else {
        setError(res.data?.message || "Something went wrong.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Apply for this job
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="First Name"
                required
                value={form.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                required
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
            <Textarea
              name="coverLetter"
              placeholder="Cover Letter"
              value={form.coverLetter}
              onChange={handleChange}
              rows={5}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume (PDF or Word)
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded px-4 py-6 text-center cursor-pointer ${
                  isDragActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <input {...getInputProps()} />
                {resumeFile ? (
                  <span className="text-gray-800">{resumeFile.name}</span>
                ) : (
                  <span className="text-gray-500">
                    Drag & drop or click to upload
                  </span>
                )}
              </div>
              {resumeError && (
                <div className="text-red-600 text-xs mt-1">{resumeError}</div>
              )}
            </div>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </section>
  );
};

export default JobApply;
