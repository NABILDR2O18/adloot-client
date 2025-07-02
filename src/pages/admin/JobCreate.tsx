import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { ChevronLeft, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type JobStatus = "open" | "closed" | "draft";

export interface Job {
  id?: number;
  title: string;
  description: string;
  location?: string;
  salary_min?: number | string;
  salary_max?: number | string;
  employment_type?: string;
  status: JobStatus;
  created_at?: string;
  updated_at?: string;
}

const defaultJob: Job = {
  title: "",
  description: "",
  location: "",
  salary_min: "",
  salary_max: "",
  employment_type: "",
  status: "open",
};

export default function JobCreate() {
  const { id } = useParams();
  const [job, setJob] = useState<Job>(defaultJob);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEdit = !!id;
  const [getLoading, setGetLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setGetLoading(true);
      api.get(`/admin/career/jobs/${id}`).then((res) => {
        setJob(res.data.data.job);
        setGetLoading(false);
      });
    }
  }, [id, isEdit]);

  if (isEdit && getLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/admin/career/jobs/${id}/update`, job);
      } else {
        await api.post("/admin/career/jobs", job); // You may need to add a createJob endpoint if not present
      }
      navigate("/admin/jobs");
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Something went wrong while saving the job.");
    } finally {
      setLoading(false);
    }
  };

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
          <CardTitle>{isEdit ? "Edit Job" : "Create Job"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              name="title"
              placeholder="Title"
              value={job.title}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={job.description}
              onChange={handleChange}
              required
            />
            <Input
              name="location"
              placeholder="Location"
              value={job.location}
              onChange={handleChange}
            />
            <Input
              name="salary_min"
              placeholder="Min Salary"
              type="number"
              value={job.salary_min}
              onChange={handleChange}
            />
            <Input
              name="salary_max"
              placeholder="Max Salary"
              type="number"
              value={job.salary_max}
              onChange={handleChange}
            />
            <Input
              name="employment_type"
              placeholder="Employment Type"
              value={job.employment_type}
              onChange={handleChange}
            />
            <Select
              name="status"
              value={job.status}
              onValueChange={(value) =>
                setJob({ ...job, status: value as JobStatus })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
