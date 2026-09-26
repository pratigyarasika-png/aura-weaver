import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Archive,
  ArrowRight,
  BarChart3,
  Binary,
  BookMarked,
  Bot,
  Boxes,
  Braces,
  Camera,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Cloud,
  Code2,
  FileCode2,
  FileDown,
  FilePenLine,
  FileText,
  FolderKanban,
  Gauge,
  GraduationCap,
  Image,
  LayoutDashboard,
  Library,
  Menu,
  MessageCircleMore,
  Mic,
  Network,
  NotebookPen,
  Paperclip,
  PenLine,
  Plus,
  Presentation,
  Quote,
  ScanSearch,
  Search,
  Settings,
  ShieldCheck,
  Sigma,
  Sparkles,
  Square,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { streamAssist } from "@/lib/assist-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Infinity Research Canvas" },
      { name: "description", content: "Ruang kerja Infinity untuk menelusuri bukti ilmiah, menulis, dan menganalisis data." },
      { property: "og:title", content: "Infinity Research Canvas" },
      { property: "og:description", content: "Ruang kerja AI untuk penelitian akademik." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchCanvas,
});

type AskMode = "general" | "academic";
type Engine = "flash" | "pro" | "expert";

type IconType = typeof Search;

const sidebarItems: Array<{ label: string; icon: IconType; to?: "/" | "/search" | "/write" | "/analyze" | "/analysis" | "/converter" }> = [
  { label: "Home / Infinity Canvas", icon: LayoutDashboard, to: "/" },
  { label: "Saved papers", icon: BookMarked },
  { label: "Projects", icon: FolderKanban },
  { label: "Search & discovery", icon: Search, to: "/search" },
  { label: "Writing workspace", icon: PenLine, to: "/write" },
  { label: "Source library", icon: Library, to: "/write" },
  { label: "Data analysis", icon: BarChart3, to: "/analyze" },
  { label: "Data & Coding", icon: Code2, to: "/analysis" },
  { label: "Export & Cloud Sync", icon: Cloud, to: "/converter" },
];

const sessions = [
  ["Neural plasticity after stroke", "12 min"],
  ["Climate adaptation policy", "Yesterday"],
  ["Quantum sensing review", "Mon"],
] as const;

const engines = [
  { id: "flash", label: "Gemini Flash", icon: Gauge },
  { id: "pro", label: "Gemini Pro", icon: Sparkles },
  { id: "expert", label: "Gemini Expert", icon: Bot },
] as const;

const orbitItems = [
  { label: "Cari Makalah", helper: "Pencarian Jurnal & Naskah", icon: Search, position: "canvas-node-top" },
  { label: "Peta Konsep", helper: "Visualisasi Keterkaitan Studi", icon: Network, position: "canvas-node-right" },
  { label: "Manajemen Sitasi", helper: "Kutip & Format Referensi", icon: Quote, position: "canvas-node-bottom" },
  { label: "Analisis PDF", helper: "Ringkasan & Tanya Jawab Dokumen", icon: FileText, position: "canvas-node-left" },
] as const;

const quickActions = [
  { label: "Bandingkan Metode", helper: "Analisis Komparatif Antar-Studi", icon: Sigma },
  { label: "Tinjauan Literatur", helper: "Sintesis & Rangkuman Otomatis", icon: FileText },
  { label: "Diskusi AI", helper: "Bedah Naskah & Tanya Jawab", icon: MessageCircleMore },
] as const;

const toolGroups: Array<{ title: string; icon: IconType; items: Array<[string, IconType]> }> = [
  {
    title: "RISET",
    icon: ScanSearch,
    items: [
      ["Pencarian Literatur", Search],
      ["Pemetaan Konsep", Network],
      ["Tanya Jawab Dokumen", FileText],
      ["Google Scholar", GraduationCap],
      ["Pencarian Akademis Lanjutan", Search],
    ],
  },
  {
    title: "MENULIS",
    icon: PenLine,
    items: [
      ["Editor Naskah Akademik", FilePenLine],
      ["Pembuat Sitasi (APA/MLA)", Quote],
      ["Tulis Draf Riset", FileText],
      ["Tulis Laporan", NotebookPen],
      ["Proposal Riset", MessageCircleMore],
      ["Catatan Diskusi", MessageCircleMore],
      ["Manuskrip Poster", Presentation],
      ["Manuskrip LaTeX", Sparkles],
    ],
  },
  {
    title: "DATA",
    icon: ChartNoAxesColumnIncreasing,
    items: [
      ["Olah Data & Koding (Python/R)", Code2],
      ["Rangkaian Uji Statistik", Binary],
      ["Statistik Deskriptif", BarChart3],
      ["Kumpulan Data Online", Archive],
      ["Ekstraksi Data (Web Scraping)", Boxes],
      ["Visualisasi Grafik", ChartNoAxesColumnIncreasing],
      ["Generator Diagram", Network],
      ["Pembersihan Data", WandSparkles],
      ["Solusi Persamaan Matematika", ShieldCheck],
    ],
  },
  {
    title: "ALAT AI",
    icon: ShieldCheck,
    items: [
      ["Pemindai Persamaan (OCR Rumus)", ScanSearch],
      ["Generator Gambar & Visual Ilmiah", Image],
      ["Buat word doc", FileText],
      ["Buat ppt", Presentation],
      ["Ekspor Presentasi (pptx)", FileDown],
      ["Situs Web Interaktif", Braces],
      ["Generator Infografis", WandSparkles],
      ["Aplikasi Interaktif", FileCode2],
    ],
  },
];

const liveTasks = [
  { label: "Ekstraksi naskah", progress: 72, log: ["> membaca struktur dokumen", "> mengekstrak metadata", "> menyusun ringkasan…"] },
  { label: "Menelusuri jurnal", progress: 48, log: ["> mencari basis data ilmiah", "> menilai relevansi", "> memeriksa DOI…"] },
  { label: "Menyusun sitasi", progress: 31, log: ["> memilih gaya APA 7", "> memvalidasi penulis", "> menyusun bibliografi…"] },
] as const;

function ResearchCanvas() {
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("Home / Infinity Canvas");
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [engine, setEngine] = useState<Engine>("flash");
  const [engineOpen, setEngineOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(0);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [mode, setMode] = useState<AskMode>("general");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [answering, setAnswering] = useState(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const attachmentRef = useRef<HTMLDivElement | null>(null);
  const activityRef = useRef<HTMLDivElement | null>(null);
  const queryRef = useRef<HTMLInputElement | null>(null);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeEngine = engines.find((item) => item.id === engine) ?? engines[0];
  const EngineIcon = activeEngine.icon;

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!attachmentRef.current?.contains(event.target)) setAttachmentOpen(false);
      if (!activityRef.current?.contains(event.target)) setActivityOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const addTag = (label: string) => {
    const tag = `[${label}]`;
    setActiveModule(label);
    setQuery((current) => current.includes(tag) ? current : `${current.trim()}${current.trim() ? " " : ""}${tag} `);
    requestAnimationFrame(() => queryRef.current?.focus());
  };

  const sendQuestion = async () => {
    const prompt = query.trim();
    if (!prompt) return;
    if (mode === "academic") {
      void navigate({ to: "/search", search: { q: prompt } });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnswer("");
    setAnswerError(null);
    setAnswering(true);
    try {
      await streamAssist(
        { mode: engine, instruction: "Jawab sebagai asisten riset Infinity secara ringkas dan jelas.", question: prompt },
        (delta) => setAnswer((current) => current + delta),
        controller.signal,
      );
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") setAnswerError(error instanceof Error ? error.message : "Jawaban belum dapat dibuat.");
    } finally {
      setAnswering(false);
    }
  };

  const pickFile = (ref: React.RefObject<HTMLInputElement | null>) => {
    setAttachmentOpen(false);
    ref.current?.click();
  };

  return (
    <div className="reference-shell min-h-screen bg-background text-foreground">
      {mobileNav && <button type="button" aria-label="Tutup navigasi" className="fixed inset-0 z-40 bg-foreground/25 lg:hidden" onClick={() => setMobileNav(false)} />}

      <aside className={cn("reference-sidebar fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0", mobileNav ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-[76px] items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">∞</span>
            <span className="min-w-0">
              <span className="block text-xl font-bold leading-6">Infinity</span>
              <span className="block text-[10px] text-muted-foreground">Research Intelligence</span>
            </span>
          </div>
          <Button variant="ghost" size="icon" className="size-8 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Tutup navigasi"><X /></Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-5 pt-4">
          <Button className="h-11 w-full justify-start rounded-full px-4 text-sm shadow-none" onClick={() => { setQuery(""); setActiveModule(null); queryRef.current?.focus(); }}>
            <Plus className="size-5" /> New research
          </Button>

          <p className="mb-2 mt-6 text-[10px] font-bold uppercase text-sidebar-foreground/70">Workspace</p>
          <nav className="space-y-0.5" aria-label="Workspace">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const selected = activeSidebar === item.label;
              const content = <><Icon className="size-[18px] shrink-0" /><span className="truncate">{item.label}</span></>;
              const cls = cn("flex h-9 w-full items-center gap-3 rounded-md px-1.5 text-left text-[13px] transition-colors", selected ? "font-semibold text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent");
              if (item.to) return <Link key={item.label} to={item.to} className={cls} onClick={() => { setActiveSidebar(item.label); setMobileNav(false); }}>{content}</Link>;
              return <Button key={item.label} variant="ghost" className={cn(cls, "justify-start shadow-none")} onClick={() => { setActiveSidebar(item.label); addTag(item.label); setMobileNav(false); }}>{content}</Button>;
            })}
          </nav>

          <p className="mb-1 mt-6 text-[10px] font-bold uppercase text-sidebar-foreground/70">Recent sessions</p>
          <div className="space-y-0.5">
            {sessions.map(([title, time], index) => (
              <Button key={title} variant="ghost" className={cn("h-auto w-full justify-start gap-3 rounded-md px-1.5 py-2 text-left shadow-none", activeSession === title && "bg-sidebar-accent")} onClick={() => { setActiveSession(title); setQuery(title); }}>
                <span className={cn("size-2 shrink-0 rounded-full", index === 0 ? "bg-primary" : "bg-signal")} />
                <span className="min-w-0"><span className="block truncate text-xs font-medium">{title}</span><span className="block text-[10px] text-muted-foreground">{time}</span></span>
              </Button>
            ))}
          </div>
        </div>

        <div className="border-t border-sidebar-border p-4">
          <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-0 py-2 hover:bg-sidebar-accent" onClick={() => setProfileOpen((open) => !open)}>
            <span className="google-g grid size-9 shrink-0 place-items-center rounded-full bg-card text-lg font-bold shadow-sm">G</span>
            <span className="min-w-0 text-left"><span className="block text-xs font-semibold">Sign in with Google</span><span className="block text-[10px] text-muted-foreground">Sync your workspace</span></span>
          </Button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[258px]">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md">
          <div className="grid h-[76px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Buka navigasi"><Menu /></Button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold">Research Canvas</h1>
              <p className="hidden truncate text-[10px] text-muted-foreground sm:block">Satu ruang kerja untuk menelusuri literatur, memahami dokumen,<br />menulis, dan menganalisis data.</p>
            </div>
            <div className="relative flex shrink-0 items-center gap-2">
              <div className="relative">
                <Button variant="outline" className="h-10 rounded-full border-border bg-card px-3 text-xs shadow-sm" onClick={() => { setEngineOpen((open) => !open); setSettingsOpen(false); setProfileOpen(false); }} aria-expanded={engineOpen}>
                  <span className="size-4 rounded-full bg-signal" /><span className="hidden sm:inline">{activeEngine.label}</span><ChevronDown className="size-3.5" />
                </Button>
                {engineOpen && <div className="absolute right-0 top-12 w-56 rounded-md border border-border bg-popover p-1.5 shadow-xl">{engines.map((item) => { const Icon = item.icon; return <Button key={item.id} variant="ghost" className={cn("w-full justify-start", engine === item.id && "bg-accent")} onClick={() => { setEngine(item.id); setEngineOpen(false); }}><Icon />{item.label}{engine === item.id && <Check className="ml-auto" />}</Button>; })}</div>}
              </div>
              <div className="relative">
                <Button variant="outline" size="icon" className="size-10 rounded-full bg-card" onClick={() => { setSettingsOpen((open) => !open); setEngineOpen(false); setProfileOpen(false); }} aria-label="Pengaturan"><Settings /></Button>
                {settingsOpen && <div className="absolute right-0 top-12 w-52 rounded-md border border-border bg-popover p-3 shadow-xl"><p className="text-sm font-semibold">Pengaturan</p><p className="mt-1 text-xs text-muted-foreground">Tampilan mengikuti tema Infinity.</p></div>}
              </div>
              <div className="relative">
                <Button size="icon" className="size-10 rounded-full text-xs font-bold" onClick={() => { setProfileOpen((open) => !open); setEngineOpen(false); setSettingsOpen(false); }} aria-label="Profil DP">DP</Button>
                {profileOpen && <div className="absolute right-0 top-12 w-48 rounded-md border border-border bg-popover p-3 shadow-xl"><p className="text-sm font-semibold">Profil Infinity</p><p className="text-xs text-muted-foreground">Research workspace</p></div>}
              </div>
            </div>
          </div>

          <div ref={activityRef} className="relative flex h-[40px] items-center justify-between border-b border-border px-4 sm:px-6">
            <Button variant="ghost" className="h-8 min-w-0 justify-start gap-2 px-0 text-[11px] hover:bg-transparent" onClick={() => setActivityOpen((open) => !open)} aria-expanded={activityOpen}>
              <span className="size-2.5 shrink-0 rounded-full bg-live" /><strong className="shrink-0 uppercase">Aktivitas langsung:</strong><span className="truncate">Ekstraksi naskah…</span>
            </Button>
            <Button variant="ghost" size="icon" className="size-8 text-primary" onClick={() => setActivityOpen((open) => !open)} aria-label="Lihat aktivitas"><ArrowRight className="size-7" /></Button>
            {activityOpen && (
              <div className="absolute left-4 right-4 top-10 z-40 overflow-hidden rounded-md border border-border bg-popover shadow-xl sm:left-auto sm:right-6 sm:w-[520px]">
                <div className="flex items-center justify-between border-b border-border p-3"><div><p className="text-sm font-semibold">Pekerjaan langsung</p><p className="text-xs text-muted-foreground">Infinity sedang mengerjakan tugas Anda</p></div><Button variant="ghost" size="icon" className="size-8" onClick={() => setActivityOpen(false)}><X /></Button></div>
                <div className="grid sm:grid-cols-[190px_1fr]">
                  <div className="border-b border-border p-2 sm:border-b-0 sm:border-r">{liveTasks.map((task, index) => <Button key={task.label} variant="ghost" className={cn("h-auto w-full justify-start px-2 py-2 text-left", activeTask === index && "bg-accent")} onClick={() => setActiveTask(index)}><span className="w-full"><span className="flex justify-between text-xs"><strong>{task.label}</strong><span>{task.progress}%</span></span><span className="mt-1 block h-1 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }} /></span></span></Button>)}</div>
                  <div className="p-3"><p className="text-xs font-semibold">{liveTasks[activeTask].label}</p><div className="mt-2 rounded-md bg-code p-3 font-mono text-[10px] leading-5 text-code-foreground">{liveTasks[activeTask].log.map((line) => <p key={line}>{line}</p>)}</div></div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="reference-main min-h-[calc(100vh-116px)] px-4 pb-16 pt-7 sm:px-6">
          <section className="mx-auto max-w-[980px]">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase">Research Canvas</p>
              <h2 className="mt-1 text-[30px] font-bold leading-tight sm:text-[42px]">Apa yang sedang Anda teliti?</h2>
              <p className="mx-auto mt-3 max-w-[620px] text-sm leading-6 text-muted-foreground sm:text-base">Mulai dengan pertanyaan, naskah, atau Konsep; Infinity akan melacak bukti ilmiah<br className="hidden sm:block" /> di sekitarnya.</p>
            </div>

            <div className="canvas-orbit relative mx-auto mt-2 h-[560px] w-full max-w-[920px]">
              <div className="canvas-ring canvas-ring-outer" />
              <div className="canvas-ring canvas-ring-inner" />
              {orbitItems.map((item) => { const Icon = item.icon; return (
                <Button key={item.label} variant="ghost" className={cn("canvas-node absolute z-10 h-auto justify-start gap-3 rounded-full border border-border bg-card px-3 py-2 text-left shadow-lg hover:bg-card", item.position, activeModule === item.label && "border-primary ring-2 ring-primary/20")} onClick={() => addTag(item.label)}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mint text-primary"><Icon className="size-6" /></span>
                  <span className="min-w-0"><strong className="block text-xs">{item.label}</strong><span className="block max-w-[170px] text-[9px] leading-4 text-muted-foreground">{item.helper}</span></span>
                </Button>
              ); })}

              <form className="canvas-core absolute left-1/2 top-1/2 z-20 flex h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border bg-card p-6 text-center shadow-2xl" onSubmit={(event) => { event.preventDefault(); void sendQuestion(); }}>
                <span className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"><PenLine className="size-6" /></span>
                <label htmlFor="research-query" className="mt-4 text-[27px] font-bold">Ask Infinity</label>
                <div className="mt-4 grid h-12 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-lg border-2 border-primary bg-background px-1">
                  <div ref={attachmentRef} className="relative">
                    <Button type="button" variant="ghost" size="icon" className={cn("size-9 text-primary", attachmentOpen && "bg-accent")} onClick={() => setAttachmentOpen((open) => !open)} aria-label="Tambahkan lampiran"><Plus className="size-6" /></Button>
                    {attachmentOpen && <div className="absolute bottom-11 left-0 z-50 w-44 rounded-md border border-border bg-popover p-1 shadow-xl">{[
                      ["Kamera", Camera, cameraRef], ["File", Paperclip, fileRef], ["Gambar", Image, imageRef], ["Video", Video, videoRef],
                    ].map(([label, Icon, ref]) => { const ItemIcon = Icon as IconType; return <Button key={label as string} type="button" variant="ghost" className="w-full justify-start" onClick={() => pickFile(ref as React.RefObject<HTMLInputElement | null>)}><ItemIcon />{label as string}</Button>; })}</div>}
                    <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={() => addTag("Kamera/OCR")} />
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={() => addTag("Dokumen")} />
                    <input ref={imageRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={() => addTag("Gambar")} />
                    <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={() => addTag("Video")} />
                  </div>
                  <input id="research-query" ref={queryRef} value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 bg-transparent px-1 text-sm outline-none" aria-label="Pertanyaan penelitian" />
                  <Camera className="mr-2 size-4 text-muted-foreground" />
                </div>
                <div className="mt-4 flex rounded-full bg-muted p-1" role="radiogroup" aria-label="Mode AI">
                  <Button type="button" size="sm" variant={mode === "general" ? "default" : "ghost"} className="h-7 rounded-full px-3 text-[10px]" onClick={() => setMode("general")}><Sparkles className="size-3" />General AI</Button>
                  <Button type="button" size="sm" variant={mode === "academic" ? "default" : "ghost"} className="h-7 rounded-full px-3 text-[10px]" onClick={() => setMode("academic")}><GraduationCap className="size-3" />Academic Research</Button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button type="button" variant="secondary" size="icon" className="size-10 rounded-full" onClick={() => addTag("Pencarian")} aria-label="Pencarian"><Search /></Button>
                  <Button type="button" variant="secondary" size="icon" className="size-10 rounded-full" onClick={() => addTag("Dikte Suara")} aria-label="Dikte suara"><Mic /></Button>
                  {answering ? <Button type="button" variant="outline" className="h-10 rounded-full px-4" onClick={() => abortRef.current?.abort()}><Square /> Stop</Button> : <Button type="submit" className="h-10 rounded-full px-5">Ask <ArrowRight /></Button>}
                </div>
              </form>
            </div>

            <div className="-mt-2 grid gap-3 sm:grid-cols-3">
              {quickActions.map((item) => { const Icon = item.icon; return <Button key={item.label} variant="outline" className={cn("h-[78px] min-w-0 justify-start rounded-md border-border bg-card px-3 text-left shadow-sm", activeModule === item.label && "border-primary ring-2 ring-primary/20")} onClick={() => addTag(item.label)}><span className="grid size-11 shrink-0 place-items-center rounded-full bg-mint text-primary"><Icon className="size-6" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs">{item.label}</strong><span className="block truncate text-[9px] text-muted-foreground">{item.helper}</span></span><ChevronRight className="size-4 shrink-0 text-muted-foreground" /></Button>; })}
            </div>

            {(answer || answerError) && <div className="mt-5 rounded-md border border-border bg-card p-4 text-sm shadow-sm">{answerError ? <p className="text-destructive">{answerError}</p> : <p className="whitespace-pre-wrap leading-6">{answer}</p>}</div>}

            <section className="pt-8">
              <h2 className="text-center text-[28px] font-bold leading-tight sm:text-[34px]">Alat-alat lain yang mungkin anda butuhkan</h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {toolGroups.map((group) => { const GroupIcon = group.icon; return (
                  <div key={group.title} className="min-h-[405px] rounded-md border border-border bg-card p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-mint text-primary"><GroupIcon className="size-5" /></span><strong className="text-xs">{group.title}</strong></div>
                    <div className="space-y-0.5">{group.items.map(([label, Icon]) => <Button key={label} type="button" variant="ghost" className={cn("h-auto min-h-9 w-full justify-start gap-3 rounded-md px-0.5 py-1 text-left text-[11px] font-normal leading-4", activeModule === label && "bg-accent font-semibold")} onClick={() => addTag(label)}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint text-primary"><Icon className="size-4" /></span><span className="whitespace-normal">{label}</span></Button>)}</div>
                  </div>
                ); })}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
