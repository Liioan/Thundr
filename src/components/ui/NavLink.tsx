import { useRouter } from "next/router";
import Link from "next/link";
import { type ReactNode } from "react";

interface NavLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  onClickEvent: () => void;
}

const NavLink = ({
  children,
  href,
  className = "",
  onClickEvent,
}: NavLinkProps) => {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={`${className} ${
        router.pathname === href
          ? "!text-primary-light dark:!text-primary-dark"
          : ""
      }
      }`}
      onClick={onClickEvent}
    >
      {children}
    </Link>
  );
};

export default NavLink;
