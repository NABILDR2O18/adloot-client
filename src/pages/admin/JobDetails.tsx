import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { ChevronLeft } from "lucide-react";
import { IJob } from "./JobsManagement";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<IJob>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api
      .get(`/admin/career/jobs/${id}`)
      .then((res) => setJob(res.data.data.job));
  }, [id]);

  if (!job) return <div className="p-8">Loading...</div>;

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
          <CardTitle>{job.title}</CardTitle>
          <Button onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div>
            <b>Status:</b> {job.status}
          </div>
          <div>
            <b>Location:</b> {job.location || "-"}
          </div>
          <div>
            <b>Type:</b> {job.employment_type || "-"}
          </div>
          <div>
            <b>Salary:</b> {job.salary_min || "-"} - {job.salary_max || "-"}
          </div>
          <div>
            <b>Description:</b>
          </div>
          <div>{job.description}</div>
          <div className="mt-4 text-sm text-gray-500">
            Created: {new Date(job.created_at).toLocaleString()}
            <br />
            Updated: {new Date(job.updated_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
