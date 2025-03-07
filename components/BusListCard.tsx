import React from "react";
import { Button } from "./ui/button";

const BusListCard = () => {
  return (
    <div>
      <div className="w-full rounded glass-box border grid grid-cols-3 gap-1 p-1 py-4">
        <div className="px-2 flex flex-col gap-4">
          <div>
            <div className="text-xl font-semibold">Sengar Travels Gwalior</div>
            <div className="text-neutral-400">NON AC Seater/Sleeper 2+1</div>
          </div>
          <div>4.0/5 | 100+ Ratings</div>
        </div>
        <div className="flex gap-2 px-2 min-w-[18vw]">
          <div>
            <div className="text-sm">Mar 4</div>
            <div className="text-xl font-semibold">21:00</div>
            <div className="text-sm w-[7rem]">Chandrawani Naka Bus Stop</div>
          </div>
          <div>
            <div className="text-neutral-300">09h 30min</div>
            <div className="w-[5rem] h-1 bg-neutral-400"></div>
          </div>
          <div>
            <div className="text-sm">Mar 5</div>
            <div className="text-xl font-semibold">07:00</div>
            <div className="text-sm w-[7rem]">Nadra Bus Stand</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div>
            <div className="text-xl font-semibold">₹ 315</div>
            <div>₹ 350</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-neutral-400">Only 20 seats left</div>
            <Button className="uppercase text-lg w-[11rem] text-white font-semibold bg-[#FF6F00] hover:bg-[#FF6F00]">
              Select Seat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusListCard;
