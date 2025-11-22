import React, { useState, useEffect } from "react";
import axios from "axios";
import ResellTicket from "./ResellTicket";
import TicketLogElement from "./TicketLogElement";
import { useAuth } from "../context/AuthContext";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("jwt_token");
        const response = await axios({
          method: "GET",
          url: `${process.env.REACT_APP_API_BASE_URL}/tickets/user/${userData._id || userData.id}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.tickets) {
          const allTickets = response.data.tickets;

          // Separate recent (active/upcoming) tickets from history
          const now = new Date();
          const recent = allTickets.filter(ticket => {
            const ticketDate = new Date(ticket.showDate);
            return ticketDate >= now && ticket.status !== 'Expired' && ticket.status !== 'Sold';
          });

          const history = allTickets.filter(ticket => {
            const ticketDate = new Date(ticket.showDate);
            return ticketDate < now || ticket.status === 'Expired' || ticket.status === 'Sold';
          });

          setRecentTickets(recent);
          setTickets(history);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to fetch tickets. Using sample data.");

        // Fallback to sample data if API fails
        setSampleData();
      } finally {
        setLoading(false);
      }
    };

    fetchUserTickets();
  }, [isAuthenticated, userData]);

  const setSampleData = () => {
    // Sample data for development/fallback
    setRecentTickets([]);
    setTickets([
      {
        _id: "1",
        image: "https://m.media-amazon.com/images/M/MV5BZTNiNDA4NmMtNTExNi00YmViLWJkMDAtMDAxNmRjY2I2NDVjXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
        name: "Transformer",
        status: "Expired",
        seat: "H-10",
      },
      {
        _id: "2",
        image: "https://m.media-amazon.com/images/M/MV5BZTNiNDA4NmMtNTExNi00YmViLWJkMDAtMDAxNmRjY2I2NDVjXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
        name: "Transformer",
        status: "Sold",
        seat: "H-11",
      },
      {
        _id: "3",
        image: "https://m.media-amazon.com/images/M/MV5BZTNiNDA4NmMtNTExNi00YmViLWJkMDAtMDAxNmRjY2I2NDVjXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
        name: "Transformer",
        status: "Expired",
        seat: "H-12",
      },
      {
        _id: "4",
        image: "https://assets-prd.ignimgs.com/2023/02/08/jw4-2025x3000-online-character-1sht-keanu-v187-1675886090936.jpg",
        name: "John Wick",
        status: "Expired",
        seat: "I-2",
      },
      {
        _id: "5",
        image: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
        name: "Cyberpunk",
        status: "Sold",
        seat: "C-9",
      },
    ]);
  };

  if (loading) {
    return (
      <div className="my-10 mx-16">
        <div className="text-poppins text-4xl font-medium text-white">
          Loading tickets...
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 mx-16">
      <div className="flex flex-col justify-start">
        <div className="text-poppins mb-8 text-21xl font-bold text-white">
          My Tickets :
        </div>

        {error && (
          <div className="text-yellow-500 text-xl mb-4">
            {error}
          </div>
        )}

        <div className="text-poppins text-4xl font-medium text-white">
          Recent :
        </div>
        <div className="flex mx-2 my-4 justify-between">
          {recentTickets.length > 0 ? (
            recentTickets.map((ticket) => (
              <ResellTicket key={ticket._id} ticket={ticket} />
            ))
          ) : (
            <ResellTicket />
          )}
        </div>

        <div className="text-poppins text-4xl font-medium text-white">
          History :
        </div>
        <div className="parent h-[500px] overflow-hidden m-2 mt-4">
          <div className="child h-auto max-h-[300px] overflow-y-scroll">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <TicketLogElement
                  key={ticket._id}
                  image={ticket.image || ticket.movie?.image}
                  name={ticket.name || ticket.movie?.name}
                  status={ticket.status}
                  seat={ticket.seat || ticket.seatNumber}
                />
              ))
            ) : (
              <div className="text-white text-2xl">No ticket history available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
