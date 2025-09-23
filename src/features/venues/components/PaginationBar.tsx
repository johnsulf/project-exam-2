import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { TPageMeta } from "@/types/schemas";

function buildHref(current: URLSearchParams, page: number) {
  const next = new URLSearchParams(current);
  next.set("page", String(page));
  return `?${next.toString()}`;
}

export function PaginationBar({ meta }: { meta: TPageMeta }) {
  const [params] = useSearchParams();

  const pages = useMemo(() => {
    const arr: number[] = [];
    for (let i = 1; i <= meta.pageCount; i++) arr.push(i);
    return arr;
  }, [meta.pageCount]);

  const showAll = meta.pageCount <= 7;
  const curr = meta.currentPage;

  const windowPages = useMemo(() => {
    if (showAll) return pages;
    const start = Math.max(1, curr - 2);
    const end = Math.min(meta.pageCount, curr + 2);
    const base = new Set<number>([
      1,
      ...Array.from({ length: end - start + 1 }, (_, i) => i + start),
      meta.pageCount,
    ]);
    return Array.from(base).sort((a, b) => a - b);
  }, [curr, meta.pageCount, pages, showAll]);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={
              meta.previousPage
                ? buildHref(params, meta.previousPage)
                : undefined
            }
            aria-disabled={!meta.previousPage}
          />
        </PaginationItem>

        {windowPages.map((p, idx) => {
          const prev = windowPages[idx - 1];
          const gap = prev && p - prev > 1;
          return (
            <span key={p} className="flex">
              {gap && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  isActive={p === curr}
                  href={buildHref(params, p)}
                  aria-current={p === curr ? "page" : undefined}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            </span>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={meta.nextPage ? buildHref(params, meta.nextPage) : undefined}
            aria-disabled={!meta.nextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
