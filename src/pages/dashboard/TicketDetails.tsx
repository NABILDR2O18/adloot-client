
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { tickets as mockTickets } from "@/lib/mockData";

// Fix the fetchTicket function to use mockTickets
const fetchTicket = async (ticketId: string) => {
  try {
    // Using mock data instead of Supabase
    const ticketData = mockTickets.find(ticket => ticket.id === ticketId) || null;
    return { data: ticketData, error: null };
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return { data: null, error: error };
  }
};

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTicket(id);
    }
  }, [id]);

  const loadTicket = async (ticketId: string) => {
    setIsLoading(true);
    const { data, error } = await fetchTicket(ticketId);
    
    if (error || !data) {
      toast.error("Failed to load ticket details");
      navigate("/dashboard/support");
    } else {
      setTicket(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ticket Details</h1>
      {isLoading ? (
        <p>Loading ticket details...</p>
      ) : ticket ? (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold">{ticket.subject}</h2>
          <p className="mt-2 text-gray-700">{ticket.description}</p>
          <p className="mt-4 text-sm text-gray-500">Status: {ticket.status}</p>
        </div>
      ) : (
        <p>Ticket not found</p>
      )}
    </div>
  );
}
