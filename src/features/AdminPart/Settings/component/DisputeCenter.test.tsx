import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisputeCenter from "./DisputeCenter";
import {
  createFeatureOrFAQ,
  fetchAppFeatures,
  fetchFAQs,
  updateFeatureOrFAQ,
} from "../api/featuresAndQuestions.api";
import type { FeatureQuestionDoc } from "../types/settings.types";
jest.mock("../api/featuresAndQuestions.api");

let records: FeatureQuestionDoc[];
function mount() {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <DisputeCenter />
    </QueryClientProvider>,
  );
}
beforeEach(() => {
  jest.resetAllMocks();
  records = [];
  jest
    .mocked(fetchAppFeatures)
    .mockImplementation(async () =>
      records.filter((r) => r.docType === "AppFeatures"),
    );
  jest
    .mocked(fetchFAQs)
    .mockImplementation(async () =>
      records.filter((r) => r.docType === "FAQquestions"),
    );
  jest.mocked(createFeatureOrFAQ).mockImplementation(async (payload) => {
    const doc = { ...payload, _id: "saved-id" };
    records.push(doc);
    return doc;
  });
  jest.mocked(updateFeatureOrFAQ).mockImplementation(async (id, payload) => {
    const index = records.findIndex((r) => r._id === id);
    records[index] = { ...records[index], ...payload };
    return records[index];
  });
});
test("FAQ creation persists across a new view and edits use the stored record ID", async () => {
  const view = mount();
  await screen.findByRole("button", { name: "Add FAQ" });
  fireEvent.click(screen.getByRole("button", { name: "Add FAQ" }));
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Question and answer are required",
  );
  fireEvent.change(screen.getByLabelText("Question"), {
    target: { value: "When are grades visible?" },
  });
  fireEvent.change(screen.getByLabelText("Answer"), {
    target: { value: "After release." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(createFeatureOrFAQ).toHaveBeenCalledWith({
    docType: "FAQquestions",
    question: "When are grades visible?",
    answer: "After release.",
  });
  view.unmount();
  mount();
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Edit When are grades visible?",
    }),
  );
  expect(screen.getByLabelText("Answer")).toHaveValue("After release.");
  fireEvent.change(screen.getByLabelText("Answer"), {
    target: { value: "After teacher review and release." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() =>
    expect(updateFeatureOrFAQ).toHaveBeenCalledWith("saved-id", {
      docType: "FAQquestions",
      question: "When are grades visible?",
      answer: "After teacher review and release.",
    }),
  );
});
test("failed saves retain the editor contents for retry", async () => {
  jest.mocked(createFeatureOrFAQ).mockRejectedValueOnce(new Error("offline"));
  mount();
  fireEvent.click(
    await screen.findByRole("button", { name: "Add app feature" }),
  );
  fireEvent.change(screen.getByLabelText("Question"), {
    target: { value: "Classroom work" },
  });
  fireEvent.change(screen.getByLabelText("Answer"), {
    target: { value: "Manage enrolled class assignments." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Your text has been kept",
  );
  expect(screen.getByLabelText("Question")).toHaveValue("Classroom work");
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  expect(records[0].docType).toBe("AppFeatures");
});
