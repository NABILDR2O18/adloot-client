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
import {
  AlertCircle,
  Ban,
  CheckCircle,
  Download,
  EyeIcon,
  Loader2,
  XCircle,
} from "lucide-react";

export type IJobApplication = {
  id: number;
  job_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume_url: string;
  created_at: string; // ISO date string, or use Date if parsing it
  job_title: string;
  job_description: string;
  job_location: string;
  job_employment_type: "Full time" | "Part time" | "Contract" | string; // enum if possible
  job_status: "open" | "closed" | string; // enum if possible
};

// eslint-disable-next-line react-refresh/only-export-components
export const getJobStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Open
        </span>
      );
    case "closed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Closed
        </span>
      );
    case "draft":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Draft
        </span>
      );
    default:
      return null;
  }
};

export default function JobApplications() {
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/career/jobs/applications/list", {
        params: { page: currentPage, limit: 20 },
      });
      setApplications(res.data.data.applications);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch {
      setApplications([]);
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
      <Card>
        <CardContent className="pt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CV/Resume</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading &&
                applications?.length > 0 &&
                applications?.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application?.job_title}</TableCell>
                    <TableCell>{`${application?.first_name} ${application?.last_name}`}</TableCell>
                    <TableCell>{application?.email}</TableCell>
                    <TableCell>
                      <Button size={"icon"} variant="outline">
                        <a
                          href={application.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download />
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/admin/jobs/applications/${application.id}`)
                        }
                      >
                        <EyeIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && applications?.length === 0 && (
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
