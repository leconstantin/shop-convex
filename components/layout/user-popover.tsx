import {
  BanknoteIcon,
  BellIcon,
  BookmarkIcon,
  CircleCheckIcon,
  CircleQuestionMarkIcon,
  HouseIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  User,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/custom/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";

const adminLinks = [
  {
    label: "Profile",
    icon: User,
  },
  {
    label: "My Purchases",
    icon: BanknoteIcon,
  },
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Saved",
    icon: BookmarkIcon,
  },
  {
    label: "Updates",
    icon: BellIcon,
  },
  {
    label: "Help Center",
    icon: CircleQuestionMarkIcon,
  },
  {
    label: "Settings",
    icon: SettingsIcon,
  },
];
const userLinks = [
  {
    label: "Profile",
    icon: User,
  },
  {
    label: "My Purchases",
    icon: BanknoteIcon,
  },
  {
    label: "Saved",
    icon: BookmarkIcon,
  },
  {
    label: "Updates",
    icon: BellIcon,
  },
  {
    label: "Help Center",
    icon: CircleQuestionMarkIcon,
  },
];
export default function UserPopover() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const isAdmin = useQuery(api.orders.checkIsAdmin);

  if (!isAuthenticated) {
    return null;
  }
  const links = isAdmin ? adminLinks : userLinks;
  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage
            alt="@shadcn"
            src="https://github.com/leconstantin.png"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="mr-6 w-64 rounded-xl border border-muted p-3 dark:bg-black">
        <div className="flex gap-2 pb-2">
          <Avatar>
            <AvatarImage
              alt="@shadcn"
              src="https://github.com/leconstantin.png"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <p>leconstantin</p>
            <p className="text-muted-foreground">Leo Constantin</p>
          </div>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex flex-col py-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <div
                className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted"
                key={link.label}
              >
                <Icon className="size-4 text-muted-foreground" />
                <span>{link.label}</span>
              </div>
            );
          })}
        </div>
        <Separator orientation="horizontal" />
        <div className="flex flex-col py-4">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted">
            <KbdGroup className="text-muted-foreground">
              <Kbd>Ctrl</Kbd>
              <span>+</span>
              <Kbd>K</Kbd>
            </KbdGroup>
            <span>Command Menu</span>
          </div>
          <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted">
            <ThemeSwitcher />
            <span>Theme</span>
          </div>
        </div>

        <Separator orientation="horizontal" />
        <div className="flex flex-col pt-4">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted">
            <HouseIcon className="size-4 text-muted-foreground" />
            <span>Home Page</span>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted"
          >
            <LogOutIcon className="size-4 text-muted-foreground" />
            <span>Logout</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
