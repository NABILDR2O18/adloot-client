import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Ban, Edit, EyeIcon, Loader2 } from "lucide-react";

type EmploymentType = "Full time" | "Part time" | "Contract" | "Internship";
type JobStatus = "draft" | "published" | "closed";

export interface IJob {
  id: number;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  employment_type: EmploymentType;
  status: JobStatus;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export default function JobsManagement() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/career/jobs", {
        params: { page: currentPage, limit: 20 },
      });
      setJobs(res.data.data.jobs);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) navigate(`/admin/jobs?page=${page}`);
  };

  return (
    <section>
      <div className="flex justify-end">
        <Button
          className="bg-purple-600 mb-4 hover:bg-purple-500"
          onClick={() => navigate("/admin/jobs/create")}
        >
          Add Job
        </Button>
      </div>
      <Card>
        <CardContent className="pt-8">
          {loading ? (
            loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                  Loading...
                </TableCell>
              </TableRow>
            )
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs?.length > 0 &&
                  jobs?.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.status}</TableCell>
                      <TableCell>{job.location || "-"}</TableCell>
                      <TableCell>{job.employment_type || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(job.created_at), "Pp")}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/jobs/${job.id}`)}
                        >
                          <EyeIcon />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                        >
                          <Edit />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {jobs?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="flex flex-col items-center">
                        <Ban className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          No job found
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {totalPages > 1 && (
            <Pagination className="mt-4 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      size="sm"
                      isActive={currentPage === idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(idx + 1);
                      }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 3 && currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
