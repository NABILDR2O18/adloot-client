import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { IJobApplication } from "./JobApplications";
import { ChevronLeft } from "lucide-react";

export default function JobApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState<IJobApplication>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/career/jobs/applications/${id}`).then((res) => {
      setApplication(res.data.data.application);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section>
      <Button
        variant="outline"
        className="flex items-center gap-1 mb-4"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Application for: {application?.job_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <b>Applicant:</b> {application.first_name} {application.last_name}
          </div>
          <div className="mb-2">
            <b>Email:</b> {application.email}
          </div>
          <div className="mb-2">
            <b>Phone:</b> {application.phone || "-"}
          </div>
          <div className="mb-2">
            <b>Applied At:</b>{" "}
            {new Date(application.created_at).toLocaleString()}
          </div>
          <div className="mb-4">
            <b>Cover Letter:</b>
            <div className="whitespace-pre-line border rounded p-2 mt-1 bg-gray-50">
              {application.cover_letter || "-"}
            </div>
          </div>
          <div className="mb-4">
            <b>Resume:</b>{" "}
            {application.resume_url ? (
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline"
              >
                Download Resume
              </a>
            ) : (
              "-"
            )}
          </div>
          <hr className="my-6" />
          <div className="mb-2">
            <b>Job Title:</b> {application.job_title}
          </div>
          <div className="mb-2">
            <b>Job Location:</b> {application.job_location || "-"}
          </div>
          <div className="mb-2">
            <b>Employment Type:</b> {application.job_employment_type || "-"}
          </div>
          <div className="mb-2">
            <b>Job Status:</b> {application.job_status}
          </div>
          <div className="mb-2">
            <b>Job Description:</b>
            <div className="whitespace-pre-line border rounded p-2 mt-1 bg-gray-50">
              {application.job_description}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
