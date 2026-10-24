"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/sheard/PageHeader";
import {
  errorMessage,
  fieldClass,
  localDay,
  primaryClass,
  workspaceApi,
} from "./api";
import { Field } from "./QuickActionDialog";

export default function TeacherBehaviorPage() {
  const { data: session } = useSession();
  return (
    <div className="space-y-5 pt-5">
      <PageHeader title="Teacher Behavior" />
      {session?.user.role === "admin" ? (
        <TeacherReports />
      ) : session?.user.role === "administrator" ? (
        <TeacherReportForm />
      ) : (
        <p>Loading account…</p>
      )}
    </div>
  );
}
function TeacherReportForm() {
  const [search, setSearch] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(localDay);
  const [severity, setSeverity] = useState("normal");
  const [page, setPage] = useState(1);
  const teachers = useQuery({
    queryKey: ["report-teachers", search, page],
    queryFn: () => workspaceApi.directory(search, page),
  });
  const save = useMutation({
    mutationFn: () =>
      workspaceApi.save("teacher-behavior", {
        teacherId,
        subject: subject.trim(),
        message: message.trim(),
        occurredOn: date,
        severity,
      }),
    onSuccess: () => {
      setSubject("");
      setMessage("");
      setTeacherId("");
    },
  });
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Submit a teacher behavior report
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Choose a teacher from your school. Only Admin can view the submitted
        report.
      </p>
      {save.isSuccess && (
        <p
          role="status"
          className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700"
        >
          Report submitted to Admin.
        </p>
      )}
      <form
        className="mt-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        <fieldset disabled={save.isPending} className="space-y-5">
          <Field label="Find teacher">
            <input
              className={fieldClass}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
                setTeacherId("");
              }}
              placeholder="Search name, ID or email"
            />
          </Field>
          <Field label="Teacher">
            <select
              required
              className={fieldClass}
              value={teacherId}
              onChange={(event) => setTeacherId(event.target.value)}
            >
              <option value="">Choose a teacher</option>
              {teachers.data?.data.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.username} · {teacher.Id}
                </option>
              ))}
            </select>
          </Field>
          {teachers.isError && (
            <p role="alert">
              Unable to load teachers.{" "}
              <button
                type="button"
                onClick={() => teachers.refetch()}
                className="underline"
              >
                Retry
              </button>
            </p>
          )}
          {teachers.data && teachers.data.meta.totalPages > 1 && (
            <div className="flex justify-between text-sm">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => {
                  setPage(page - 1);
                  setTeacherId("");
                }}
              >
                Previous teachers
              </button>
              <span>Page {page}</span>
              <button
                type="button"
                disabled={page >= teachers.data.meta.totalPages}
                onClick={() => {
                  setPage(page + 1);
                  setTeacherId("");
                }}
              >
                Next teachers
              </button>
            </div>
          )}
          <Field label="Subject">
            <input
              required
              maxLength={200}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Incident date">
              <input
                required
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="Priority">
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                className={fieldClass}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </Field>
          </div>
          <Field label="Report details">
            <textarea
              required
              rows={6}
              maxLength={10000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={fieldClass}
            />
          </Field>
        </fieldset>
        {save.isError && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage(save.error)}
          </p>
        )}
        <button
          type="submit"
          disabled={save.isPending || !teacherId || teachers.isError}
          className={primaryClass}
        >
          {save.isPending ? "Submitting…" : "Submit to Admin"}
        </button>
      </form>
    </section>
  );
}
function TeacherReports() {
  const [page, setPage] = useState(1);
  const reports = useQuery({
    queryKey: ["teacher-behavior-reports", page],
    queryFn: () => workspaceApi.reports(page),
  });
  return (
    <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Confidential teacher behavior reports
      </h2>
      <p className="text-sm text-gray-500">
        Reports submitted by school Administrators. Visible only to Admin.
      </p>
      {reports.isPending && <p role="status">Loading reports…</p>}
      {reports.isError && (
        <p role="alert">
          {errorMessage(reports.error)}{" "}
          <button onClick={() => reports.refetch()} className="underline">
            Retry
          </button>
        </p>
      )}
      {reports.data?.data.length === 0 && (
        <p className="text-sm text-gray-500">No reports have been submitted.</p>
      )}
      {reports.data?.data.map((report) => (
        <article
          key={report._id}
          className="space-y-3 rounded-xl border border-gray-200 p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">{report.subject}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {report.teacherId?.username || "Teacher unavailable"} ·{" "}
                {report.teacherId?.Id}
              </p>
            </div>
            <span
              className={`rounded-lg px-3 py-1 text-xs capitalize ${report.severity === "urgent" ? "bg-red-50 text-red-700" : "bg-purple-50 text-[#871dad]"}`}
            >
              {report.severity}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {report.message}
          </p>
          <p className="text-xs leading-5 text-gray-500">
            Incident: {report.occurredOn.slice(0, 10)} · Submitted by{" "}
            {report.submittedBy?.username || "Administrator unavailable"} ·{" "}
            {report.schoolId?.name ||
              report.schoolId?.schoolName ||
              "School unavailable"}
            <br />
            Submitted: {new Date(report.createdAt).toLocaleString()}
          </p>
        </article>
      ))}
      {reports.data && reports.data.meta.totalPages > 1 && (
        <div className="flex justify-between text-sm">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={page >= reports.data.meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
