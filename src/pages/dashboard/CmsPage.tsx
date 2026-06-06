import * as React from "react";
import {
  Edit3,
  FileText,
  Plus,
  Save,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type CmsTab = "faqs" | "interests" | "terms" | "privacy";
type LegalContentKey = "terms" | "privacy";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isPublished: boolean;
  updatedAt: string;
}

interface InterestItem {
  id: string;
  name: string;
  isActive: boolean;
  updatedAt: string;
}

interface LegalContentItem {
  key: LegalContentKey;
  title: string;
  body: string;
  isPublished: boolean;
  updatedAt: string;
}

type FaqFormState = Pick<FaqItem, "question" | "answer" | "isPublished">;
type InterestFormState = Pick<InterestItem, "name" | "isActive">;
type LegalContentFormState = Pick<LegalContentItem, "title" | "body" | "isPublished">;

const initialFaqs: FaqItem[] = [
  {
    id: "faq_1",
    question: "How does the AI face scan work?",
    answer:
      "Our AI reviews facial symmetry, proportions, skin tone and lighting to generate your private RATED score. Photos never leave your device unencrypted.",
    isPublished: true,
    updatedAt: "2026-06-05T09:30:00.000Z",
  },
  {
    id: "faq_2",
    question: "Can I retake my face scan?",
    answer:
      "Yes. Members can retake the scan when they upload a clearer photo or want to refresh their profile score.",
    isPublished: true,
    updatedAt: "2026-06-04T12:15:00.000Z",
  },
  {
    id: "faq_3",
    question: "Why can I only match in a score range?",
    answer:
      "RATED uses score ranges to keep matching balanced, intentional and more likely to produce mutual interest.",
    isPublished: true,
    updatedAt: "2026-06-03T17:45:00.000Z",
  },
  {
    id: "faq_4",
    question: "How do I cancel my subscription?",
    answer:
      "Open app settings, choose subscription, then follow the cancellation steps from your payment provider.",
    isPublished: false,
    updatedAt: "2026-06-01T11:00:00.000Z",
  },
];

const initialInterests: InterestItem[] = [
  "Wine",
  "Pilates",
  "Travel",
  "Surf",
  "Tennis",
  "Jazz",
  "Fashion",
  "Cinema",
  "Dance",
  "Run",
  "Books",
  "Coffee",
  "Yoga",
].map((name, index) => ({
  id: `interest_${index + 1}`,
  name,
  isActive: true,
  updatedAt: "2026-06-05T10:00:00.000Z",
}));

const initialLegalContent: Record<LegalContentKey, LegalContentItem> = {
  terms: {
    key: "terms",
    title: "Terms & Conditions",
    body:
      "By using RATED, members agree to behave respectfully, provide accurate profile information, and follow the community safety rules. Harassment, impersonation, spam, fraudulent payment activity, or attempts to bypass matching rules may result in account suspension or removal.\n\nSubscriptions, AI scans, and app features may change over time. Users are responsible for managing their account, subscription settings, and any personal information shared through the app.",
    isPublished: true,
    updatedAt: "2026-06-05T08:45:00.000Z",
  },
  privacy: {
    key: "privacy",
    title: "Privacy Policy",
    body:
      "RATED collects account details, profile content, photos, app activity, subscription status, and AI scan inputs to provide matchmaking and rating features. Data is used to operate the service, improve safety, prevent abuse, and personalize the app experience.\n\nUsers can request account deletion and data removal from app settings or support. Sensitive data should be handled securely and only shared with trusted service providers required to operate the platform.",
    isPublished: true,
    updatedAt: "2026-06-05T08:45:00.000Z",
  },
};

const emptyFaqForm: FaqFormState = {
  question: "",
  answer: "",
  isPublished: true,
};

const emptyInterestForm: InterestFormState = {
  name: "",
  isActive: true,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}`;
}

export function CmsPage() {
  const [activeTab, setActiveTab] = React.useState<CmsTab>("faqs");
  const [faqs, setFaqs] = React.useState<FaqItem[]>(initialFaqs);
  const [interests, setInterests] = React.useState<InterestItem[]>(initialInterests);
  const [legalContent, setLegalContent] =
    React.useState<Record<LegalContentKey, LegalContentItem>>(initialLegalContent);
  const [faqSearch, setFaqSearch] = React.useState("");
  const [interestSearch, setInterestSearch] = React.useState("");
  const [faqEditorOpen, setFaqEditorOpen] = React.useState(false);
  const [interestEditorOpen, setInterestEditorOpen] = React.useState(false);
  const [editingFaq, setEditingFaq] = React.useState<FaqItem | null>(null);
  const [editingInterest, setEditingInterest] = React.useState<InterestItem | null>(null);
  const [faqForm, setFaqForm] = React.useState<FaqFormState>(emptyFaqForm);
  const [interestForm, setInterestForm] = React.useState<InterestFormState>(emptyInterestForm);
  const [faqDeleteTarget, setFaqDeleteTarget] = React.useState<FaqItem | null>(null);
  const [interestDeleteTarget, setInterestDeleteTarget] = React.useState<InterestItem | null>(null);

  const filteredFaqs = React.useMemo(() => {
    const q = faqSearch.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((faq) =>
      `${faq.question} ${faq.answer}`.toLowerCase().includes(q),
    );
  }, [faqSearch, faqs]);

  const filteredInterests = React.useMemo(() => {
    const q = interestSearch.trim().toLowerCase();
    if (!q) return interests;
    return interests.filter((interest) => interest.name.toLowerCase().includes(q));
  }, [interestSearch, interests]);

  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqForm(emptyFaqForm);
    setFaqEditorOpen(true);
  };

  const openEditFaq = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      isPublished: faq.isPublished,
    });
    setFaqEditorOpen(true);
  };

  const openCreateInterest = () => {
    setEditingInterest(null);
    setInterestForm(emptyInterestForm);
    setInterestEditorOpen(true);
  };

  const openEditInterest = (interest: InterestItem) => {
    setEditingInterest(interest);
    setInterestForm({
      name: interest.name,
      isActive: interest.isActive,
    });
    setInterestEditorOpen(true);
  };

  const saveFaq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const payload: FaqFormState = {
      question: faqForm.question.trim(),
      answer: faqForm.answer.trim(),
      isPublished: faqForm.isPublished,
    };

    if (!payload.question || !payload.answer) return;

    setFaqs((current) => {
      if (!editingFaq) {
        return [{ id: makeId("faq"), ...payload, updatedAt: now }, ...current];
      }

      return current.map((faq) =>
        faq.id === editingFaq.id ? { ...faq, ...payload, updatedAt: now } : faq,
      );
    });

    setFaqEditorOpen(false);
  };

  const saveInterest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = interestForm.name.trim();
    if (!name) return;

    const now = new Date().toISOString();
    setInterests((current) => {
      if (!editingInterest) {
        return [{ id: makeId("interest"), name, isActive: interestForm.isActive, updatedAt: now }, ...current];
      }

      return current.map((interest) =>
        interest.id === editingInterest.id
          ? { ...interest, name, isActive: interestForm.isActive, updatedAt: now }
          : interest,
      );
    });

    setInterestEditorOpen(false);
  };

  const deleteFaq = () => {
    if (!faqDeleteTarget) return;
    setFaqs((current) => current.filter((faq) => faq.id !== faqDeleteTarget.id));
    setFaqDeleteTarget(null);
  };

  const deleteInterest = () => {
    if (!interestDeleteTarget) return;
    setInterests((current) =>
      current.filter((interest) => interest.id !== interestDeleteTarget.id),
    );
    setInterestDeleteTarget(null);
  };

  const saveLegalContent = (
    key: LegalContentKey,
    payload: LegalContentFormState,
  ) => {
    const title = payload.title.trim();
    const body = payload.body.trim();
    if (!title || !body) return;

    setLegalContent((current) => ({
      ...current,
      [key]: {
        ...current[key],
        title,
        body,
        isPublished: payload.isPublished,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const faqColumns: Column<FaqItem>[] = [
    {
      key: "question",
      header: "Question",
      cell: (faq) => (
        <div className="max-w-xl">
          <p className="font-semibold text-foreground">{faq.question}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {faq.answer}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (faq) => (
        <Badge variant={faq.isPublished ? "success" : "secondary"}>
          {faq.isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      cell: (faq) => (
        <span className="text-sm text-muted-foreground">{formatDate(faq.updatedAt)}</span>
      ),
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
      header: "App Visibility",
      cell: (interest) => (
        <Badge variant={interest.isActive ? "success" : "secondary"}>
          {interest.isActive ? "Active" : "Hidden"}
        </Badge>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      cell: (interest) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(interest.updatedAt)}
        </span>
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
        description="Manage Help Center FAQs, app interests, Terms & Conditions, and Privacy Policy content."
        actions={
          activeTab === "faqs" || activeTab === "interests" ? (
            <Button
              type="button"
              onClick={activeTab === "faqs" ? openCreateFaq : openCreateInterest}
              className="gap-2"
            >
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
            description="Create, edit, publish, or remove the FAQ items shown in the mobile Help Center."
            searchValue={faqSearch}
            searchPlaceholder="Search FAQs"
            onSearchChange={setFaqSearch}
            actionLabel="Add FAQ"
            onAction={openCreateFaq}
          />
          <DataTable
            columns={faqColumns}
            data={filteredFaqs}
            rowKey={(faq) => faq.id}
            emptyTitle="No FAQs found"
            emptyDescription="Add a Help Center question or adjust your search."
          />
        </TabsContent>

        <TabsContent value="interests" className="space-y-4">
          <SectionToolbar
            title="App Interests"
            description="Manage the chips users can choose from during onboarding and profile editing."
            searchValue={interestSearch}
            searchPlaceholder="Search interests"
            onSearchChange={setInterestSearch}
            actionLabel="Add Interest"
            onAction={openCreateInterest}
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mobile Preview</CardTitle>
              <CardDescription>
                Active interests appear as selectable chips in the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    disabled={!interest.isActive}
                    className={`min-w-20 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      interest.isActive
                        ? "border-primary/30 bg-primary/90 text-primary-foreground shadow-sm"
                        : "border-border bg-muted text-muted-foreground opacity-60"
                    }`}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <DataTable
            columns={interestColumns}
            data={filteredInterests}
            rowKey={(interest) => interest.id}
            emptyTitle="No interests found"
            emptyDescription="Add an interest or adjust your search."
          />
        </TabsContent>

        <TabsContent value="terms">
          <LegalContentEditor
            content={legalContent.terms}
            description="Edit the Terms & Conditions page shown inside the mobile app."
            onSave={(payload) => saveLegalContent("terms", payload)}
          />
        </TabsContent>

        <TabsContent value="privacy">
          <LegalContentEditor
            content={legalContent.privacy}
            description="Edit the Privacy Policy page shown inside the mobile app."
            onSave={(payload) => saveLegalContent("privacy", payload)}
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
        description={`Delete "${faqDeleteTarget?.question}" from the Help Center CMS?`}
        confirmLabel="Delete FAQ"
        destructive
        onConfirm={deleteFaq}
      />

      <ConfirmDialog
        open={Boolean(interestDeleteTarget)}
        onOpenChange={(open) => !open && setInterestDeleteTarget(null)}
        title="Delete Interest"
        description={`Delete "${interestDeleteTarget?.name}" from the app interest list?`}
        confirmLabel="Delete Interest"
        destructive
        onConfirm={deleteInterest}
      />
    </div>
  );
}

interface LegalContentEditorProps {
  content: LegalContentItem;
  description: string;
  onSave: (payload: LegalContentFormState) => void;
}

function LegalContentEditor({
  content,
  description,
  onSave,
}: LegalContentEditorProps) {
  const [form, setForm] = React.useState<LegalContentFormState>({
    title: content.title,
    body: content.body,
    isPublished: content.isPublished,
  });

  React.useEffect(() => {
    setForm({
      title: content.title,
      body: content.body,
      isPublished: content.isPublished,
    });
  }, [content]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                {content.title}
              </CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
            <Badge variant={content.isPublished ? "success" : "secondary"}>
              {content.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${content.key}-title`}>Page Title</Label>
                <Input
                  id={`${content.key}-title`}
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${content.key}-body`}>Page Content</Label>
                <Textarea
                  id={`${content.key}-body`}
                  value={form.body}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, body: event.target.value }))
                  }
                  className="min-h-[360px] resize-y leading-6"
                  required
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                <div>
                  <Label htmlFor={`${content.key}-published`}>Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Turn off to keep this page hidden until legal copy is ready.
                  </p>
                </div>
                <Switch
                  id={`${content.key}-published`}
                  checked={form.isPublished}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, isPublished: checked }))
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">App Preview</p>
                <span className="text-xs text-muted-foreground">
                  Updated {formatDate(content.updatedAt)}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-display text-lg font-semibold">{form.title || "Page Title"}</h3>
                <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
                  {(form.body || "Page content preview").split("\n\n").map((paragraph, index) => (
                    <p key={`${content.key}-preview-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!form.title.trim() || !form.body.trim()}>
              <Save className="h-4 w-4" />
              Save Changes
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

function FaqEditorDialog({
  open,
  editing,
  form,
  onOpenChange,
  onFormChange,
  onSubmit,
}: FaqEditorDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-2xl">
        <form onSubmit={onSubmit}>
          <ModalHeader>
            <ModalTitle>{editing ? "Edit FAQ" : "Add FAQ"}</ModalTitle>
            <ModalDescription>
              This content appears in the app Help Center accordion.
            </ModalDescription>
          </ModalHeader>

          <div className="my-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                value={form.question}
                onChange={(event) =>
                  onFormChange((current) => ({ ...current, question: event.target.value }))
                }
                placeholder="How does the AI face scan work?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Textarea
                id="faq-answer"
                value={form.answer}
                onChange={(event) =>
                  onFormChange((current) => ({ ...current, answer: event.target.value }))
                }
                placeholder="Write a clear customer-facing answer."
                className="min-h-36"
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
              <div>
                <Label htmlFor="faq-published">Published</Label>
                <p className="text-xs text-muted-foreground">
                  Turn off to keep this FAQ as a draft.
                </p>
              </div>
              <Switch
                id="faq-published"
                checked={form.isPublished}
                onCheckedChange={(checked) =>
                  onFormChange((current) => ({ ...current, isPublished: checked }))
                }
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
            <ModalDescription>
              Manage the selectable interest chips users see inside the app.
            </ModalDescription>
          </ModalHeader>

          <div className="my-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interest-name">Interest Name</Label>
              <Input
                id="interest-name"
                value={form.name}
                onChange={(event) =>
                  onFormChange((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Pilates"
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
              <div>
                <Label htmlFor="interest-active">Active in app</Label>
                <p className="text-xs text-muted-foreground">
                  Hidden interests stay in CMS but do not appear in the app.
                </p>
              </div>
              <Switch
                id="interest-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  onFormChange((current) => ({ ...current, isActive: checked }))
                }
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
