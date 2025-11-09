import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/router/routes";

const gradingCriteria = [
  {
    label: "Design",
    max: 2,
    description:
      "A combination of user-interface design, user-experience design, and interaction design.",
  },
  {
    label: "Project management",
    max: 2,
    description: "A combination of planning, documentation, and testing.",
  },
  {
    label: "Technical",
    max: 6,
    description:
      "A combination of fulfilling the brief correctly while following best practices.",
  },
];

const gradeScale = [
  { grade: "A", label: "Outstanding", color: "bg-emerald-600" },
  { grade: "B", label: "Excellent", color: "bg-green-500" },
  { grade: "C", label: "Good", color: "bg-lime-400" },
  { grade: "D", label: "Satisfactory", color: "bg-yellow-400" },
  { grade: "E", label: "Pass", color: "bg-orange-500" },
  { grade: "F", label: "Redo", color: "bg-red-600" },
];

export default function About() {
  const breadcrumbs = [{ label: "Home", to: routes.home }, { label: "About" }];

  return (
    <div className="space-y-10">
      <PageBreadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border bg-white p-8 md:p-12 shadow-xl space-y-6">
        <span className="inline-flex w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-700">
          final exam
        </span>
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Holidaze is a Noroff Front-end exam project crafted by Johnsulf.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            Goal: demonstrate two years of front-end studies by planning,
            designing, and shipping a complete accommodation platform. Holidaze
            is a fictional booking company that needed both a customer-facing
            venue marketplace and an admin-facing venue manager dashboard. The
            entire UI is built on the official Noroff Holidaze API, with all
            venue data mocked by me and fellow students.
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            Deliverables included user research, Figma prototypes, a style
            guide, kanban planning, and a hosted demo using approved resources:
            React + TypeScript + Vite, Tailwind with shadcn/ui, TanStack Query,
            and GitHub Pages. Everything here is front end only; the API handles
            authentication, bookings, and venue persistence.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl">
            Want to dive deeper?{" "}
            <a
              href="https://github.com/johnsulf/project-exam-2"
              className="text-primary underline font-medium"
              target="_blank"
              rel="noreferrer"
            >
              Check out the GitHub repo
            </a>{" "}
            and read the full documentation there.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Made for Noroff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built as part of my final exam in the Front-end studies program.
              It’s a proof of learning focused on thoughtful UI, data handling,
              and responsive layouts.
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Fictional inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All venues are mock entries created by me and classmates. They
              don’t exist in real life - they help demonstrate the booking flows
              the exam requires.
            </p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Tech stack</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• React + TypeScript + Vite</p>
            <p>• Tailwind & shadcn/ui for components</p>
            <p>• TanStack Query for data fetching</p>
            <p>• React Router for routing and Zod for validation</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Project Exam 2 Grading</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p>
              Each criterion is scored out of the maximum shown below. Scores
              are pending while the exam is under review.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {gradingCriteria.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border p-4 space-y-2 bg-gradient-to-br from-white to-muted/60 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </p>
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                      ? / {item.max}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border bg-card/80 p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Final grade
                  </p>
                  <p className="text-3xl font-semibold text-foreground">
                    Pending
                  </p>
                </div>
                <div className="pending-grade-indicator rounded-full px-4 py-2 text-xs font-semibold text-white shadow">
                  Awaiting evaluation
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {gradeScale.map((grade) => (
                  <div
                    key={grade.grade}
                    className="flex items-center gap-2 rounded-2xl border bg-white/70 p-3 shadow-sm"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${grade.color}`}
                    >
                      {grade.grade}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {grade.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
