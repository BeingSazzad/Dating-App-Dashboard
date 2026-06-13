import * as React from "react";
import { Edit3, FileText, Plus, Save, Search, Tag, Trash2 } from "lucide-react";
import { ConfirmDialog, DataTable, PageHeader, type Column } from "@/components/shared";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateDisclaimerMutation,
  useCreateFAQMutation,
  useCreateInterestsMutation,
  useDeleteFAQMutation,
  useDeleteInterestsMutation,
  useGetDisclaimerQuery,
  useGetFAQQuery,
  useGetInterestsQuery,
  useUpdateFAQMutation,
  useUpdateInterestsMutation,
  type DisclaimerItem,
  type FaqItem,
  type InterestItem,
} from "@/redux/apiSlices/admin/cmsApi";
import { toast } from "sonner";

type CmsTab = "faqs" | "interests" | "terms" | "privacy";
type DisclaimerTab = "terms" | "privacy";

interface FaqFormState {
  question: string;
  answer: string;
}

interface InterestFormState {
  name: string;
}

const emptyFaqForm: FaqFormState = {
  question: "",
  answer: "",
};

const emptyInterestForm: InterestFormState = {
  name: "",
};

function formatDate(value?: string) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function normalizeDisclaimer(data: DisclaimerItem[] | DisclaimerItem | null | undefined) {
  if (!data) return null;
  return Array.isArray(data) ? data[0] ?? null : data;
}

export function CmsPage() {
  const [activeTab, setActiveTab] = React.useState<CmsTab>("faqs");
  const [faqSearch, setFaqSearch] = React.useState("");
  const [interestSearch, setInterestSearch] = React.useState("");

  const [faqEditorOpen, setFaqEditorOpen] = React.useState(false);
  const [interestEditorOpen, setInterestEditorOpen] = React.useState(false);
  const [faqDeleteTarget, setFaqDeleteTarget] = React.useState<FaqItem | null>(null);
  const [interestDeleteTarget, setInterestDeleteTarget] = React.useState<InterestItem | null>(null);
  const [editingFaq, setEditingFaq] = React.useState<FaqItem | null>(null);
  const [editingInterest, setEditingInterest] = React.useState<InterestItem | null>(null);
  const [faqForm, setFaqForm] = React.useState<FaqFormState>(emptyFaqForm);
  const [interestForm, setInterestForm] = React.useState<InterestFormState>(emptyInterestForm);

  const { data: faqResponse, isLoading: faqLoading } = useGetFAQQuery();
  const { data: interestResponse, isLoading: interestLoading, refetch: interestRefetch } = useGetInterestsQuery();
  const { data: termsResponse, isLoading: termsLoading } = useGetDisclaimerQuery({ type: "terms" });
  const { data: privacyResponse, isLoading: privacyLoading } = useGetDisclaimerQuery({ type: "privacy" });

  const [createFaq] = useCreateFAQMutation();
  const [updateFaq] = useUpdateFAQMutation();
  const [deleteFaq] = useDeleteFAQMutation();
  const [createInterest] = useCreateInterestsMutation();
  const [updateInterest] = useUpdateInterestsMutation();
  const [deleteInterest] = useDeleteInterestsMutation();
  const [createDisclaimer] = useCreateDisclaimerMutation();

  const faqs = faqResponse?.data ?? [];
  const interests = interestResponse?.data ?? [];
  const terms = normalizeDisclaimer(termsResponse?.data);
  const privacy = normalizeDisclaimer(privacyResponse?.data);

  const filteredFaqs = React.useMemo(() => {
    const query = faqSearch.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(query));
  }, [faqs, faqSearch]);

  const filteredInterests = React.useMemo(() => {
    const query = interestSearch.trim().toLowerCase();
    if (!query) return interests;
    return interests.filter((interest) => interest.name.toLowerCase().includes(query));
  }, [interests, interestSearch]);

  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqForm(emptyFaqForm);
    setFaqEditorOpen(true);
  };

  const openEditFaq = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFaqForm({ question: faq.question, answer: faq.answer });
    setFaqEditorOpen(true);
  };

  const openCreateInterest = () => {
    setEditingInterest(null);
    setInterestForm(emptyInterestForm);
    setInterestEditorOpen(true);
  };

  const openEditInterest = (interest: InterestItem) => {
    setEditingInterest(interest);
    setInterestForm({ name: interest.name });
    setInterestEditorOpen(true);
  };

  const saveFaq = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      question: faqForm.question.trim(),
      answer: faqForm.answer.trim(),
    };
    if (!payload.question || !payload.answer) return;

    if (editingFaq) {
      toast.promise(updateFaq({ id: editingFaq._id, ...payload }).unwrap(), {
        loading: "Updating FAQ...",
        success: () => {
          setFaqEditorOpen(false);
          return "FAQ Updated successfully!"
        },
        error: "Failed to update!",
      });
    } else {
      toast.promise(createFaq(payload).unwrap(), {
        loading: "Creating FAQ...",
        success: () => {
          setFaqEditorOpen(false);
          return "FAQ created successfully!"
        },
        error: "Failed to create FAQ!",
      });
    }

  };

  const saveInterest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = interestForm.name.trim();
    if (!name) return;

    if (editingInterest) {
      toast.promise(updateInterest({ id: editingInterest._id, name }).unwrap(), {
        loading: "Updating Interest...",
        success: () => {
          interestRefetch();
          setInterestEditorOpen(false);
          return "Interest updated successfully!"
        },
        error: "Failed to update!",
      });
    } else {
      toast.promise(createInterest({ name }).unwrap(), {
        loading: "Creating Interest...",
        success: () => {
          interestRefetch();
          setInterestEditorOpen(false);
          return "Interest created successfully!"
        },
        error: "Failed to create Interest!",
      });
    }
  };

  const saveDisclaimer = async (type: DisclaimerTab, content: string) => {
    await createDisclaimer({ type, content }).unwrap().catch(() => undefined);
  };

  const deleteFaqItem = async () => {
    if (!faqDeleteTarget) return;
    await deleteFaq(faqDeleteTarget._id).unwrap().catch(() => undefined);
    setFaqDeleteTarget(null);
  };

  const deleteInterestItem = async () => {
    if (!interestDeleteTarget) return;
    await deleteInterest(interestDeleteTarget._id).unwrap().catch(() => undefined);
    setInterestDeleteTarget(null);
  };

  const faqColumns: Column<FaqItem>[] = [
    {
      key: "question",
      header: "Question",
      cell: (faq) => (
        <div className="max-w-xl">
          <p className="font-semibold text-foreground">{faq.question}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{faq.answer}</p>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      cell: (faq) => <span className="text-sm text-muted-foreground">{formatDate(faq.updatedAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (faq) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => openEditFaq(faq)}
            aria-label={`Edit ${faq.question}`}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setFaqDeleteTarget(faq)}
            className="text-destructive hover:bg-destructive/10"
            aria-label={`Delete ${faq.question}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const interestColumns: Column<InterestItem>[] = [
    {
      key: "name",
      header: "Interest",
      cell: (interest) => (
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Tag className="h-4 w-4" />
          </span>
          <span className="font-semibold">{interest.name}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (interest) => <Badge variant={interest.status === "active" ? "success" : "secondary"}>{interest.status}</Badge>,
    },
    {
      key: "updatedAt",
      header: "Updated",
      cell: (interest) => (
        <span className="text-sm text-muted-foreground">{formatDate(interest.updatedAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (interest) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => openEditInterest(interest)}
            aria-label={`Edit ${interest.name}`}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setInterestDeleteTarget(interest)}
            className="text-destructive hover:bg-destructive/10"
            aria-label={`Delete ${interest.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS"
        description="Manage FAQs, interests, Terms & Conditions, and Privacy Policy content."
        actions={
          activeTab === "faqs" || activeTab === "interests" ? (
            <Button type="button" onClick={activeTab === "faqs" ? openCreateFaq : openCreateInterest} className="gap-2">
              <Plus className="h-4 w-4" />
              {activeTab === "faqs" ? "Add FAQ" : "Add Interest"}
            </Button>
          ) : undefined
        }
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CmsTab)}>
        <TabsList>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="space-y-4">
          <SectionToolbar
            title="Help Center FAQs"
            description="Create, edit, or remove FAQs from the app Help Center."
            searchValue={faqSearch}
            searchPlaceholder="Search FAQs"
            onSearchChange={setFaqSearch}
            actionLabel="Add FAQ"
            onAction={openCreateFaq}
          />
          <DataTable
            columns={faqColumns}
            data={filteredFaqs}
            rowKey={(faq) => faq._id}
            emptyTitle={faqLoading ? "Loading FAQs" : "No FAQs found"}
            emptyDescription="Add a question to populate the Help Center."
            isLoading={faqLoading}
          />
        </TabsContent>

        <TabsContent value="interests" className="space-y-4">
          <SectionToolbar
            title="Interests"
            description="Manage the interest tags users can choose in the app."
            searchValue={interestSearch}
            searchPlaceholder="Search interests"
            onSearchChange={setInterestSearch}
            actionLabel="Add Interest"
            onAction={openCreateInterest}
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mobile Preview</CardTitle>
              <CardDescription>Active interests appear as selectable chips in the app.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest._id}
                    className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <DataTable
            columns={interestColumns}
            data={filteredInterests}
            rowKey={(interest) => interest._id}
            emptyTitle={interestLoading ? "Loading interests" : "No interests found"}
            emptyDescription="Add a new interest to populate the list."
            isLoading={interestLoading}
          />
        </TabsContent>

        <TabsContent value="terms">
          <DisclaimerEditor
            title="Terms & Conditions"
            description="Edit the terms text shown inside the app."
            loading={termsLoading}
            initialValue={terms ?? ""}
            onSave={(content) => saveDisclaimer("terms", content)}
          />
        </TabsContent>

        <TabsContent value="privacy">
          <DisclaimerEditor
            title="Privacy Policy"
            description="Edit the privacy policy text shown inside the app."
            loading={privacyLoading}
            initialValue={privacy ?? ""}
            onSave={(content) => saveDisclaimer("privacy", content)}
          />
        </TabsContent>
      </Tabs>

      <FaqEditorDialog
        open={faqEditorOpen}
        onOpenChange={setFaqEditorOpen}
        form={faqForm}
        editing={Boolean(editingFaq)}
        onFormChange={setFaqForm}
        onSubmit={saveFaq}
      />

      <InterestEditorDialog
        open={interestEditorOpen}
        onOpenChange={setInterestEditorOpen}
        form={interestForm}
        editing={Boolean(editingInterest)}
        onFormChange={setInterestForm}
        onSubmit={saveInterest}
      />

      <ConfirmDialog
        open={Boolean(faqDeleteTarget)}
        onOpenChange={(open) => !open && setFaqDeleteTarget(null)}
        title="Delete FAQ"
        description={`Delete "${faqDeleteTarget?.question}" from the FAQ list?`}
        confirmLabel="Delete FAQ"
        destructive
        onConfirm={deleteFaqItem}
      />

      <ConfirmDialog
        open={Boolean(interestDeleteTarget)}
        onOpenChange={(open) => !open && setInterestDeleteTarget(null)}
        title="Delete Interest"
        description={`Delete "${interestDeleteTarget?.name}" from the interest list?`}
        confirmLabel="Delete Interest"
        destructive
        onConfirm={deleteInterestItem}
      />
    </div>
  );
}

interface DisclaimerEditorProps {
  title: string;
  description: string;
  initialValue: string | any;
  loading?: boolean;
  onSave: (content: string) => Promise<void> | void;
}

function DisclaimerEditor({ title, description, initialValue, loading, onSave }: DisclaimerEditorProps) {
  const [content, setContent] = React.useState(initialValue);
  // const [published, setPublished] = React.useState(true);

  React.useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);
  // console.log(initialValue, typeof initialValue)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(content);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
            {/* <Badge variant={published ? "success" : "secondary"}>
              {published ? "Published" : "Draft"}
            </Badge> */}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`${title}-content`}>Content</Label>
            <Textarea
              id={`${title}-content`}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[360px] resize-y leading-6"
              placeholder="Write disclaimer content..."
              required
            />
          </div>

          {/* <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
            <div>
              <Label htmlFor={`${title}-published`}>Published</Label>
              <p className="text-xs text-muted-foreground">Visual status for the editor preview.</p>
            </div>
            <Switch
              id={`${title}-published`}
              checked={published}
              onCheckedChange={setPublished}
            />
          </div> */}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !content.trim()}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

interface SectionToolbarProps {
  title: string;
  description: string;
  searchValue: string;
  searchPlaceholder: string;
  actionLabel: string;
  onSearchChange: (value: string) => void;
  onAction: () => void;
}

function SectionToolbar({
  title,
  description,
  searchValue,
  searchPlaceholder,
  actionLabel,
  onSearchChange,
  onAction,
}: SectionToolbarProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 sm:w-64"
            />
          </div>
          <Button type="button" onClick={onAction}>
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface FaqEditorDialogProps {
  open: boolean;
  editing: boolean;
  form: FaqFormState;
  onOpenChange: (open: boolean) => void;
  onFormChange: React.Dispatch<React.SetStateAction<FaqFormState>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function FaqEditorDialog({ open, editing, form, onOpenChange, onFormChange, onSubmit }: FaqEditorDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-2xl">
        <form onSubmit={onSubmit}>
          <ModalHeader>
            <ModalTitle>{editing ? "Edit FAQ" : "Add FAQ"}</ModalTitle>
            <ModalDescription>This FAQ will be returned by the CMS API.</ModalDescription>
          </ModalHeader>

          <div className="my-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                value={form.question}
                onChange={(event) => onFormChange((current) => ({ ...current, question: event.target.value }))}
                placeholder="What is the eSIM & what are its benefits?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                value={form.answer}
                onChange={(event) => onFormChange((current) => ({ ...current, answer: event.target.value }))}
                placeholder="Write the answer exactly as it should appear."
                className="min-h-36"
                required
              />
            </div>
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.question.trim() || !form.answer.trim()}>
              {editing ? "Save Changes" : "Create FAQ"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

interface InterestEditorDialogProps {
  open: boolean;
  editing: boolean;
  form: InterestFormState;
  onOpenChange: (open: boolean) => void;
  onFormChange: React.Dispatch<React.SetStateAction<InterestFormState>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function InterestEditorDialog({
  open,
  editing,
  form,
  onOpenChange,
  onFormChange,
  onSubmit,
}: InterestEditorDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md">
        <form onSubmit={onSubmit}>
          <ModalHeader>
            <ModalTitle>{editing ? "Edit Interest" : "Add Interest"}</ModalTitle>
            <ModalDescription>Interests are stored as simple name-only records.</ModalDescription>
          </ModalHeader>

          <div className="my-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interest-name">Interest Name</Label>
              <Input
                id="interest-name"
                value={form.name}
                onChange={(event) => onFormChange((current) => ({ ...current, name: event.target.value }))}
                placeholder="Music"
                required
              />
            </div>
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!form.name.trim()}>
              {editing ? "Save Changes" : "Create Interest"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
