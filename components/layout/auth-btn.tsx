"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { Button } from "../ui/button";
import UserPopover from "./user-popover";
export default function AuthBtn() {
  return (
    <>
      <Authenticated>
        <UserPopover />
      </Authenticated>
      <Unauthenticated>
        <Button asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      </Unauthenticated>
    </>
  );
}
