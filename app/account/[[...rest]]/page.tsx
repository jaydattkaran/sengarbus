import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";


export default function AccountPage() {
  return (
    <div className="">
      {/* Sidebar */}
      <div className="flex items-center py-4 gap-4 mt-4">
        <h2 className="md:text-lg font-semibold">Account:</h2>
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/account" className="md:text-normal text-sm hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/bookings" className="md:text-normal text-sm hover:underline">
              My Bookings
            </Link>
          </li>
          <li>
            <Link href="/help" className="md:text-normal text-sm hover:underline">
              Help Center
            </Link>
          </li>
        </ul>
      </div>

      {/* Clerk UserProfile */}
      <div className="flex-1 flex justify-center items-center  mt-4">
        <UserProfile
          path="/account"
          routing="path"
        />
      </div>
    </div>
  );
}
