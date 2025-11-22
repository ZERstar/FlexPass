import React, { useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { useBlockchain } from "../blockchain";
import { useLocation } from 'react-router-dom';

export default function ResellSummary() {
    const location = useLocation();
    const { purchaseTicket, isInitialized, isConnecting } = useBlockchain();
    const [isProcessing, setIsProcessing] = useState(false);

    // Get ticket data from location state or use defaults
    const ticket = location.state?.ticket || {
        image: "https://assets-prd.ignimgs.com/2023/02/08/jw4-2025x3000-online-character-1sht-keanu-v187-1675886090936.jpg",
        name: "John Wick",
        theatre: { name: "Theatre1" },
        seats: ["C-14"],
        price: 250,
        listedPrice: 350,
    };

    const calculateFees = () => {
        const listedPrice = ticket.listedPrice || ticket.price || 350;
        const theaterRoyalty = Math.floor(listedPrice * 0.15); // 15% theater royalty
        const platformFee = Math.floor(listedPrice * 0.05); // 5% platform fee
        const profit = listedPrice - ticket.price - theaterRoyalty - platformFee;

        return {
            listedPrice,
            theaterRoyalty,
            platformFee,
            profit,
            profitPercentage: ((profit / ticket.price) * 100).toFixed(1),
        };
    };

    const fees = calculateFees();

    const handleResell = async () => {
        if (!isInitialized) {
            alert("Blockchain provider not initialized. Please try again.");
            return;
        }

        setIsProcessing(true);

        try {
            // Calculate amount in Tezos (convert from fiat)
            const tezAmount = (fees.listedPrice / 100).toFixed(2);

            const result = await purchaseTicket({
                amount: tezAmount,
                receiverAddress: ticket.buyerAddress || "tz1WsmHMwt1JTsEc1DEqNbhWB517hTJGszNn",
                ticketData: {
                    ticketId: ticket._id,
                    movieName: ticket.name,
                    seats: ticket.seats,
                    theatre: ticket.theatre?.name,
                }
            });

            alert(result.message || "Ticket resold successfully!");
        } catch (error) {
            console.error("Error reselling ticket:", error);
            alert("Failed to resell ticket. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='w-full my-10 mx-16'>
            <div className='flex flex-col justify-start'>
                <div className='text-poppins mb-8 text-21xl font-bold text-white'>Resell Summary :</div>
                <div className='flex justify-between items-center'>
                    <div className="relative w-72 h-[27rem] flex flex-col items-start justify-start text-left text-[0.75rem] text-gray-100 font-caption-1-regular">
                        <div className="self-stretch flex-1 rounded-2xl bg-gray-200 [backdrop-filter:blur(64px)] flex flex-col p-[1rem] items-center justify-start gap-[1.5rem] border-[1px] border-solid border-gray-100">
                            <img className="self-stretch relative rounded-xl max-w-full overflow-hidden h-[15rem] shrink-0" alt="" src={ticket.image || ticket.movie?.image} />
                            <div className="self-stretch flex flex-col items-start justify-start gap-[0.75rem]">
                                <div className="self-stretch flex flex-col items-start justify-start">
                                    <div className="relative leading-[1rem]">Movie</div>
                                    <div className="self-stretch relative text-[1rem] leading-[1.5rem] font-semibold text-white flex items-center overflow-hidden text-ellipsis whitespace-nowrap h-[1.5rem] shrink-0">{ticket.name || ticket.movie?.name}</div>
                                </div>
                                <div className="self-stretch rounded-xl bg-lightsteelblue flex flex-row py-[0.5rem] px-[0.75rem] items-start justify-between">
                                    <div className="flex flex-col items-start justify-start gap-[0.13rem]">
                                        <div className="relative leading-[1rem]">Price</div>
                                        <div className="relative text-[1rem] leading-[1.5rem] font-semibold text-white">{ticket.price}/-</div>
                                        <div className="flex flex-row items-center justify-start">
                                            <div className="relative leading-[1rem]">original</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-start gap-[0.13rem]">
                                        <div className="relative leading-[1rem]">Listed Price</div>
                                        <div className="relative text-[1rem] leading-[1.5rem] font-semibold text-white">{fees.listedPrice}/-</div>
                                        <div className="flex flex-row items-center justify-start gap-[0.25rem]">
                                            <div className="relative leading-[1rem]">resale</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-3/4 ml-10 my-2'>
                        <div className='flex flex-col items-start'>
                            <div className='flex font-roboto font-medium mb-6'>
                                <div className='text-[#9DA8BE] font-21xl'><FaLocationDot /></div>
                                <div className='text-[#9DA8BE] ml-2 font-5xl'>{ticket.theatre?.name || "Theatre1"}</div>
                                <div className='text-[#000000] ml-2 font-5xl'>2D</div>
                            </div>
                            <div className='w-3/4 mx-7'>
                                <div className='flex justify-between items-center font-poppins font-medium text-3xl text-white'>
                                    <div className='flex flex-col justify-between items-start'>
                                        <div className='mb-2'>Seat No.:</div>
                                        <div className='mb-2'>Listed Price :</div>
                                        <div className='mb-2'>Theater Royalty :</div>
                                        <div className='mb-2'>Platform Fee :</div>
                                    </div>
                                    <div className='flex flex-col justify-between items-end'>
                                        <div className='mb-2'>{ticket.seats?.[0] || "N/A"}</div>
                                        <div className='mb-2'>{fees.listedPrice}</div>
                                        <div className='mb-2'>{fees.theaterRoyalty}</div>
                                        <div className='mb-2'>{fees.platformFee}</div>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <hr className="border-1.5 bg-gray-300 h-px my-2" />
                                    <div className='flex justify-between items-center font-poppins font-medium text-4xl text-white'>
                                        <div>Profit</div>
                                        <div className='flex justify-between items-center'>
                                            <div className='font-poppins font-base text-3xl text-[#1ea83c]'>({fees.profitPercentage}%)</div>
                                            <div className='ml-2'>{fees.profit}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex px-50 py-5 items-center justify-center w-3/4">
                              <div className="rounded-xl [background:linear-gradient(90.57deg,#628eff,#8740cd_53.13%,#580475)] w-full py-2 mb-2">
                                  <div className="py-1 text-white text-center text-5xl font-semibold cursor-pointer">
                                       <button
                                          onClick={handleResell}
                                          disabled={isProcessing || isConnecting || !isInitialized}
                                       >
                                          {isProcessing ? 'Processing...' : 'Resell'}
                                       </button>
                                  </div>
                                </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
