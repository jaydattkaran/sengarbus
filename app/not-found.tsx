import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div>
      <div className="mt-10">Ooops! You&apos;ve taken a wrong turn....</div>
      <div className="mt-4">
        <Link href="/">
          <Button className="cursor-pointer" variant={"destructive"}>
            Go back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;
