import { LocalLink as Link, T } from "@/lib/lang";
import { ChevronRight } from "@/components/icons";

/** Home / हमारे आदर्श / name, for the profile pages. */
export default function Crumbs({ name }: { name: React.ReactNode }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <li className="flex items-center gap-1.5">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-ink">
            <T>होम</T>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li className="flex items-center gap-1.5">
          <Link href="/ideals" className="inline-flex min-h-11 items-center hover:text-ink">
            <T>हमारे आदर्श</T>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li aria-current="page" className="font-semibold text-ink">
          {name}
        </li>
      </ol>
    </nav>
  );
}
