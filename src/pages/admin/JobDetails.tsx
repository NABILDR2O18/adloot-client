import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { ChevronLeft } from "lucide-react";
import { getJobStatusBadge, IJob } from "./JobsManagement";
import toast from "react-hot-toast";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<IJob>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/career/jobs/${id}`).then((res) => {
      setJob(res.data.data.job);
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

  const handleStatusChange = async (status: string, id: number) => {
    try {
      const response = await api.put(`/admin/career/jobs/${id}/status`, {
        status,
      });
      if (response.status === 200) {
        toast.success(`Job ${status} successfully`);
        navigate(-1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button
          variant={job.status === "open" ? "destructive" : "default"}
          onClick={() =>
            handleStatusChange(
              job.status === "open"
                ? "closed"
                : job.status === "draft"
                ? "open"
                : "open",
              job.id
            )
          }
          className="bg-purple-600 hover:bg-purple-500"
        >
          {job.status === "open" ? "Close" : "Open"}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <b>Status:</b> {getJobStatusBadge(job.status)}
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
