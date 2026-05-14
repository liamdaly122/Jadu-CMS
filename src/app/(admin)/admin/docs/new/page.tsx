import { DocForm } from "../_form";
import { createDoc } from "../actions";

export default function NewDocPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">New document</h1>
      <DocForm action={createDoc} submitLabel="Create" />
    </div>
  );
}
