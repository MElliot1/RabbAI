import React, { useState, useEffect, useRef } from "react";
import { CONCEPTS } from "./RabAI_Data.js";

// ─── ERA CONFIG ───────────────────────────────────────────────────────────────

const ERAS = [
  { id: "tanakh", label: "Tanakh", years: "c. 10th–4th century BCE", subs: [
    { id: "tanakh_torah",   label: "Torah (Chumash)" },
    { id: "tanakh_neviim",  label: "Neviim (Prophets)" },
    { id: "tanakh_ketuvim", label: "Ketuvim (Writings)" },
  ]},
  { id: "rabbinic", label: "Rabbinic", years: "c. 70–600 CE", subs: [
    { id: "rabbinic_halakhah", label: "Halakhah" },
    { id: "rabbinic_aggadah",  label: "Aggadah"  },
  ]},
  { id: "medieval", label: "Medieval", years: "c. 600–1500", subs: [
    { id: "medieval_philosophical", label: "Philosophical" },
    { id: "medieval_legal",         label: "Legal"         },
    { id: "medieval_mystical",      label: "Mystical"      },
  ]},
  { id: "earlymodern",  label: "Early Modern",  years: "c. 1500–1800", subs: null },
  { id: "latermodern",  label: "Later Modern",  years: "c. 1800–1945", subs: null },
  { id: "contemporary", label: "Contemporary",  years: "1945–present", subs: null },
];

// Scroll-tracked sections: concrete era subsections plus the synthesis at page end.
const SECTION_IDS = [
  ...ERAS.flatMap(e => e.subs ? e.subs.map(sub => sub.id) : [e.id]),
  "synthesis",
];

// ─── CONCEPT INDEX ────────────────────────────────────────────────────────────

const ALL_CONCEPTS = [
  { id: "shabbat",        label: "Shabbat",              desc: "Sacred time and weekly rest",                        genealogyDesc: "conceptions of Shabbat and sacred time" },
  { id: "passover",       label: "Passover",             desc: "Liberation and collective memory",                   genealogyDesc: "Passover, liberation, and collective memory" },
  { id: "yomkippur",      label: "Yom Kippur",           desc: "Atonement and the Day of Return",                   genealogyDesc: "Yom Kippur and the practice of atonement" },
  { id: "roshhashanah",   label: "Rosh Hashanah",        desc: "New Year and Divine Judgment",                      genealogyDesc: "Rosh Hashanah and the theology of divine judgment" },
  { id: "prayer",         label: "Tefillah",             desc: "The architecture of addressing God",                genealogyDesc: "tefillah and the practice of Jewish prayer" },
  { id: "torah",          label: "Torah",                desc: "The text and practice of Jewish learning",          genealogyDesc: "Torah — its nature, authority, and study" },
  { id: "god",            label: "God",                  desc: "Conceptions of the divine",                         genealogyDesc: "conceptions of the divine" },
  { id: "creation",       label: "Creation",             desc: "The origin and meaning of the world",               genealogyDesc: "creation and the origin of the world" },
  { id: "humanity",       label: "Humanity",             desc: "What it means to be human",                         genealogyDesc: "humanity and what it means to be human" },
  { id: "plantsanimals",  label: "Plants & Animals",     desc: "Stewardship and the natural world",                 genealogyDesc: "plants, animals, and the natural world" },
  { id: "angelsdemons",   label: "Angels & Demons",      desc: "Spiritual beings and the heavenly court",           genealogyDesc: "angels, demons, and the spiritual realm" },
  { id: "soul",           label: "Soul",                 desc: "Nefesh, ruach, neshamah — the inner life",          genealogyDesc: "the soul and the inner life" },
  { id: "freewill",       label: "Free Will",            desc: "Human freedom, responsibility, and divine knowledge", genealogyDesc: "free will and human moral responsibility" },
  { id: "birthanddeath",  label: "Birth & Death",        desc: "Welcoming life and confronting mortality",           genealogyDesc: "birth, death, and the rituals at life's boundaries" },
  { id: "wedding",        label: "Wedding",              desc: "Kiddushin, chuppah, and the covenant of marriage",  genealogyDesc: "the Jewish wedding and the covenant of marriage" },
  { id: "sacredgarments", label: "Sacred Garments",      desc: "Tallit, tefillin, tzitzit, kippah, and ritual dress", genealogyDesc: "sacred garments and Jewish ritual dress" },
  { id: "covenant",       label: "Covenant",             desc: "The binding relationship between God and Israel",   genealogyDesc: "covenant — the relationship between God and Israel" },
  { id: "israel",         label: "Israel",               desc: "The people, the land, and the covenant",            genealogyDesc: "Israel — the people, the land, and the covenant" },
  { id: "justice",        label: "Justice",              desc: "Tzedek — the prophetic demand",                     genealogyDesc: "justice and the prophetic demand for tzedek" },
  { id: "tzedakah",       label: "Tzedakah",             desc: "The obligation of righteous giving",                genealogyDesc: "tzedakah and the obligation of righteous giving" },
  { id: "chesed",         label: "Chesed",               desc: "Loving-kindness and acts of grace",                 genealogyDesc: "chesed and the practice of loving-kindness" },
  { id: "lovingneighbor", label: "Loving Your Neighbor", desc: "The great principle of the Torah",                  genealogyDesc: "the commandment to love one's neighbor" },
  { id: "teshuvah",       label: "Teshuvah",             desc: "Repentance, return, and moral repair",              genealogyDesc: "teshuvah — repentance, return, and moral repair" },
  { id: "shemitah",       label: "Shemitah",             desc: "The sabbatical year and land ethics",               genealogyDesc: "shemitah and the ethics of the sabbatical year" },
  { id: "kashrut",        label: "Kashrut",              desc: "Dietary laws and sacred eating",                    genealogyDesc: "kashrut and the laws of sacred eating" },
  { id: "tikkunolam",     label: "Tikkun Olam",          desc: "Repair of the world",                              genealogyDesc: "tikkun olam and the imperative to repair the world" },
  { id: "gratitude",      label: "Gratitude",            desc: "Hakarat hatov — recognition of the good",           genealogyDesc: "gratitude and the practice of hakarat hatov" },
  { id: "chaggim",        label: "Chaggim",              desc: "The Jewish festival cycle",                         genealogyDesc: "the chaggim and the Jewish festival cycle" },
  { id: "sukkot",         label: "Sukkot",               desc: "The festival of booths and joy",                    genealogyDesc: "Sukkot and the festival of booths" },
  { id: "shavuot",        label: "Shavuot",              desc: "Revelation and the giving of Torah",                genealogyDesc: "Shavuot and the giving of Torah" },
  { id: "prophecy",       label: "Prophecy",             desc: "The tradition of divine communication",             genealogyDesc: "prophecy and divine communication in Jewish tradition" },
  { id: "death",          label: "Death & Afterlife",    desc: "How Judaism confronts mortality and the world to come", genealogyDesc: "death, mourning, afterlife, and how Judaism confronts mortality" },
  { id: "barmitzvah",   label: "Bar & Bat Mitzvah", desc: "Coming of age as a member of the covenant community", genealogyDesc: "bar and bat mitzvah and the coming of age in Jewish tradition" },
  { id: "hitbodedut",   label: "Hitbodedut",        desc: "Personal prayer and solitary meditation",             genealogyDesc: "hitbodedut and the practice of personal Jewish prayer" },
  { id: "torahstudy",   label: "Torah Study",        desc: "Talmud Torah — the practice of Jewish learning",     genealogyDesc: "talmud Torah and the practice of Jewish learning" },
  { id: "tzimtzum",     label: "Tzimtzum",           desc: "Divine contraction and the space for creation",      genealogyDesc: "tzimtzum and the Kabbalistic doctrine of divine contraction" },
  { id: "kehillah", label: "Kehillah", desc: "The Jewish community as sacred institution", genealogyDesc: "kehillah and the Jewish community as sacred institution" },
  { id: "mussar", label: "Mussar", desc: "The tradition of ethical self-cultivation", genealogyDesc: "mussar and the practice of Jewish ethical self-cultivation" },
  { id: "galut", label: "Exile & Return", desc: "Galut — exile as theological condition", genealogyDesc: "exile, return, and galut as a Jewish theological condition" },
  { id: "berakhah", label: "Blessing", desc: "The theology and practice of the berakhah", genealogyDesc: "blessing and the theology of the berakhah" },
  { id: "redemption",     label: "Redemption",           desc: "Geulah — individual and collective liberation",     genealogyDesc: "redemption and the Jewish vision of geulah" },
];

// ─── HOMEPAGE CATEGORIES ──────────────────────────────────────────────────────

const HOME_CATEGORIES = [
  {
    id: "metaphysics", col: 0,
    label: "Metaphysics & Ontology",
    desc: "God · Creation · Humanity · Plants & Animals · Angels & Demons · Soul · Free Will · Death & Afterlife",
    conceptIds: ["god","creation","humanity","plantsanimals","angelsdemons","soul","freewill","death"],
  },
  {
    id: "mysticism", col: 1,
    label: "Mysticism & Inner Life",
    desc: "Prayer · Teshuvah · Gratitude · Hitbodedut · Tzimtzum · Death & Afterlife · Redemption",
    conceptIds: ["prayer","teshuvah","gratitude","hitbodedut","tzimtzum","berakhah","redemption"],
  },
  {
    id: "ritual", col: 0,
    label: "Ritual & Practice",
    desc: "Tefillah (Prayer) · Shabbat · Chaggim (Holidays) · Kashrut · Shemitah · Sacred Garments · Birth & Death · Wedding · Bar & Bat Mitzvah",
    conceptIds: ["prayer","shabbat","chaggim","kashrut","shemitah","sacredgarments","birthanddeath","wedding","barmitzvah"],
  },
  {
    id: "community", col: 1,
    label: "Community & Society",
    desc: "Israel · Covenant · Justice · Tzedakah · Loving Your Neighbor · Tikkun Olam",
    conceptIds: ["israel","covenant","justice","tzedakah","lovingneighbor","tikkunolam","kehillah"],
  },
  {
    id: "ethics", col: 0,
    label: "Ethics & Values",
    desc: "Chesed · Tzedakah · Loving Your Neighbor · Justice · Tikkun Olam · Gratitude · Shemitah",
    conceptIds: ["chesed","tzedakah","lovingneighbor","justice","tikkunolam","gratitude","mussar"],
  },
  {
    id: "history", col: 1,
    label: "History & Memory",
    desc: "Passover · Israel · Torah · Torah Study · Prophecy · Chaggim · Covenant · Redemption",
    conceptIds: ["passover","israel","torah","torahstudy","prophecy","galut","covenant","redemption"],
  },
];


// ─── SOURCE CARD ──────────────────────────────────────────────────────────────

function SourceCard({ source }) {
  const href = source.sourceUrl || source.sefaria;
  const linkLabel = source.linkLabel || (
    source.linkType === "sefaria-search" ? "Search Sefaria" :
    source.linkType === "sefaria-sheet" ? "Open Sefaria excerpt" :
    href?.includes("sefaria.org") ? "Open in Sefaria" : "Open source"
  );

  return (
    <div style={s.card}>
      <a href={href} target="_blank" rel="noopener noreferrer" style={s.cardTitleRow}>
        <div style={s.cardTitleLeft}>
          <span style={s.cardTitle}>{source.title}</span>
          {source.tag && <span style={s.cardTag}>{source.tag}</span>}
          {source.citation && source.citation !== source.title && (
            <span style={s.cardCitation}>{source.citation}</span>
          )}
        </div>
        <span style={s.cardLink}>{linkLabel} →</span>
      </a>
      {source.hebrew && (
        <div style={s.hebrewBlock}>
          <span style={s.textBlockLabel}>HEBREW</span>
          <p style={s.hebrewText}>{source.hebrew}</p>
        </div>
      )}
      <div style={s.englishBlock}>
        <span style={source.textType === "paraphrase" ? s.paraphraseLabel : s.textBlockLabel}>
          {source.textLabel || "TRANSLATION / EXCERPT"}
        </span>
        <p style={{ ...s.englishText, ...(source.textType === "paraphrase" ? s.paraphraseText : {}) }}>{source.english}</p>
        {source.citationNote && <p style={s.citationNote}>{source.citationNote}</p>}
      </div>
      <div style={s.summaryBlock}>
        <span style={s.summaryLabel}>SUMMARY</span>
        <p style={s.summaryText}>{source.summary}</p>
      </div>
    </div>
  );
}

// ─── ERA SECTION ──────────────────────────────────────────────────────────────

function EraSection({ eraId, label, sources, sectionRef }) {
  if (!sources || sources.length === 0) return null;
  return (
    <section ref={sectionRef} id={eraId} style={s.eraSection}>
      <div style={s.eraHeader}>
        <div style={s.eraHeaderLine} />
        <h2 style={s.eraTitle}>{label}</h2>
        <div style={s.eraHeaderLine} />
      </div>
      <div style={s.cardStack}>
        {sources.map((src) => <SourceCard key={src.id} source={src} />)}
      </div>
    </section>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ activeId, onScrollTo }) {
  // Accordion behavior: Tanakh starts open, and only one grouped era can be
  // expanded at a time. Single-level eras close the accordion when active.
  const [openEraId, setOpenEraId] = useState("tanakh");

  useEffect(() => {
    const activeGroupedEra = ERAS.find(
      era => era.subs && era.subs.some(sub => sub.id === activeId)
    );
    setOpenEraId(activeGroupedEra ? activeGroupedEra.id : null);
  }, [activeId]);

  const handleParentClick = (era) => {
    if (!era.subs) {
      setOpenEraId(null);
      onScrollTo(era.id);
      return;
    }

    // Clicking an already-open parent keeps it open and returns the reader to
    // the beginning of that era; clicking another parent closes the prior one.
    setOpenEraId(era.id);
    onScrollTo(era.subs[0].id);
  };

  return (
    <aside style={s.sidebar}>
      <div style={s.sidebarLabel}>GENEALOGY</div>
      <nav>
        {ERAS.map((era) => {
          const eraActive = era.subs ? era.subs.some(sub => sub.id === activeId) || activeId === era.id : activeId === era.id;
          return (
            <div key={era.id}>
              <div style={s.sidebarEraRow}>
                <button
                  onClick={() => handleParentClick(era)}
                  style={{ ...s.sidebarItem, ...(eraActive ? (era.subs ? s.sidebarItemParentActive : s.sidebarItemActive) : {}) }}
                >
                  <span>{era.label}</span>
                  <span style={s.sidebarYears}>{era.years}</span>
                </button>
                {era.subs && (
                  <span style={s.sidebarToggle}>
                    {openEraId === era.id ? "▾" : "▸"}
                  </span>
                )}
              </div>
              {era.subs && openEraId === era.id && (
                <div style={s.sidebarSubs}>
                  {era.subs.map(sub => (
                    <button key={sub.id} onClick={() => onScrollTo(sub.id)}
                      style={{ ...s.sidebarSubItem, ...(activeId === sub.id ? s.sidebarItemActive : {}) }}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div style={s.sidebarSynthesisDivider} />
        <button
          onClick={() => onScrollTo("synthesis")}
          style={{ ...s.sidebarSynthesisItem, ...(activeId === "synthesis" ? s.sidebarItemActive : {}) }}
        >
          <span>Synthesis</span>
          <span style={s.sidebarYears}>Interpretive overview</span>
        </button>
      </nav>
    </aside>
  );
}

// ─── CONCEPT PAGE ─────────────────────────────────────────────────────────────

function ConceptPage({ conceptId, onNavigate, onBack, history }) {
  const concept = CONCEPTS[conceptId];
  const [activeId, setActiveId] = useState("tanakh_torah");
  const sectionRefs = useRef({});

  useEffect(() => { window.scrollTo(0, 0); setActiveId("tanakh_torah"); }, [conceptId]);

  useEffect(() => {
    const observers = [];
    const options = { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 };
    SECTION_IDS.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveId(id); });
      }, options);
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [conceptId]);

  const scrollTo = (id) => {
    let el = sectionRefs.current[id];
    if (!el) {
      const era = ERAS.find(e => e.subs && e.subs.some(s => s.id === id));
      if (era) {
        const found = era.subs.find(s => sectionRefs.current[s.id]);
        if (found) el = sectionRefs.current[found.id];
        else el = sectionRefs.current[era.id];
      }
    }
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Determine back label
  const prevPage = history && history[history.length - 1];
  const backLabel = prevPage
    ? prevPage.startsWith("cat:")
      ? `← ${HOME_CATEGORIES.find(c => c.id === prevPage.slice(4))?.label || "Back"}`
      : prevPage === "home" ? "← Home" : "← Back"
    : null;

  if (!concept) return (
    <div style={s.root}>
      <header style={s.nav}><button onClick={() => onNavigate("home")} style={s.navLogo}>RabbAI</button></header>
      <div style={{ padding: "120px 40px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 12 }}>{conceptId.charAt(0).toUpperCase() + conceptId.slice(1)}</h1>
        <p style={{ color: "#6B7280", fontSize: 16 }}>Full genealogy coming soon.</p>
        <button onClick={onBack} style={{ marginTop: 24, padding: "10px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
      </div>
    </div>
  );

  const sections = ERAS.flatMap(era =>
    era.subs
      ? era.subs.map(sub => ({ id: sub.id, label: era.label + " — " + sub.label, sources: concept.sources[sub.id] }))
      : [{ id: era.id, label: era.label, sources: concept.sources[era.id] }]
  );

  return (
    <div style={s.root}>
      <header style={s.nav}><button onClick={() => onNavigate("home")} style={s.navLogo}>RabbAI</button></header>
      <div style={s.layout}>
        <Sidebar activeId={activeId} onScrollTo={scrollTo} />
        <main style={s.main}>
          {backLabel && (
            <button onClick={onBack} style={s.backBtn}>{backLabel}</button>
          )}
          <div style={s.pageHero}>
            <h1 style={s.pageTitle}>{concept.title}</h1>
            <p style={s.pageSubtitle}>{concept.subtitle}</p>
          </div>
          {sections.map(({ id, label, sources }) => (
            <EraSection key={id} eraId={id} label={label} sources={sources}
              sectionRef={(el) => (sectionRefs.current[id] = el)} />
          ))}
          <div style={s.relatedPanel}>
            <p style={s.relatedLabel}>Explore Related Concepts</p>
            <div style={s.chipsRow}>
              {concept.relatedChips.map((chip) => {
                const target = ALL_CONCEPTS.find(c => c.label.toLowerCase() === chip.toLowerCase());
                return (
                  <button key={chip} onClick={() => target && onNavigate(target.id)}
                    style={{ ...s.chip, ...(target ? s.chipLinked : {}) }}>
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
          <section
            ref={(el) => (sectionRefs.current.synthesis = el)}
            id="synthesis"
            style={s.synthesisSection}
          >
            <div style={s.eraHeader}>
              <div style={s.eraHeaderLine} />
              <h2 style={s.eraTitle}>Synthesis</h2>
              <div style={s.eraHeaderLine} />
            </div>
            <div style={s.synthesisPanel}>
              <p style={s.synthesisHeader}>INTERPRETIVE SYNTHESIS</p>
              <p style={s.synthesisText}>{concept.synthesis}</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// ─── CATEGORY PAGE ────────────────────────────────────────────────────────────

function CategoryPage({ catId, onNavigate, onBack }) {
  const cat = HOME_CATEGORIES.find(c => c.id === catId);
  if (!cat) return null;
  const concepts = cat.conceptIds.map(id => ALL_CONCEPTS.find(c => c.id === id)).filter(Boolean);

  return (
    <div style={s.root}>
      <header style={s.nav}><button onClick={() => onNavigate("home")} style={s.navLogo}>RabbAI</button></header>
      <main style={{ paddingTop: 64, maxWidth: 860, margin: "0 auto", padding: "80px 40px 120px" }}>
        <button onClick={onBack} style={s.backBtn}>← Home</button>
        <div style={s.pageHero}>
          <h1 style={s.pageTitle}>{cat.label}</h1>
          <p style={s.pageSubtitle}>{cat.fullDesc || cat.desc}</p>
        </div>
        <div style={s.catConceptGrid}>
          {concepts.map(c => (
            <button key={c.id} onClick={() => onNavigate(c.id)} style={s.catConceptCard}>
              <span style={s.catConceptCardTitle}>{c.label}</span>
              <span style={s.catConceptCardDesc}>{c.desc}</span>
              <span style={s.catConceptCardArrow}>{`Explore the genealogy of Jewish ${c.genealogyDesc || c.desc}`} →</span>
            </button>
          ))}
        </div>
        <p style={{ marginTop: 40, fontSize: 14, color: "#9CA3AF", textAlign: "center", letterSpacing: "0.01em" }}>
          More concepts coming soon.
        </p>
      </main>
    </div>
  );
}

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────

function HomePage({ onNavigate }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? ALL_CONCEPTS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase()))
    : null;

  const handleKey = (e) => {
    if (e.key === "Enter" && filtered && filtered.length > 0) onNavigate(filtered[0].id);
  };

  return (
    <div style={s.root}>
      <header style={s.nav}>
        <button onClick={() => onNavigate("home")} style={s.navLogo}>RabbAI</button>
      </header>
      <main style={s.homeMain}>
        <div style={s.homeCenter}>
          <h1 style={s.homeLogo}>RabbAI</h1>
          <p style={s.homeTagline}>
            Research genealogies of Jewish principles and practices.<br />
            Primary sources from every era, for students and educators.
          </p>
          <div style={s.homeSearchBox}>
            <input
              type="text"
              placeholder="Research…"
              style={s.homeSearchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
          {filtered ? (
            <div style={s.searchResults}>
              {filtered.length === 0
                ? <p style={{ color: "#6B7280", fontSize: 15 }}>No concepts found.</p>
                : filtered.map(c => (
                  <button key={c.id} onClick={() => onNavigate(c.id)} style={s.searchResultItem}>
                    <span style={{ fontWeight: 600, color: "#111827" }}>{c.label}</span>
                    <span style={{ color: "#6B7280", fontSize: 14 }}>{c.desc}</span>
                  </button>
                ))
              }
            </div>
          ) : (
            <>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#6B7280", marginBottom: 16, marginTop: 6 }}>
                New to <strong>RabbAI</strong>? Click a topic box below to get started.
              </p>
              <div style={s.catGrid}>
                {[0, 1].map(col => (
                  <div key={col} style={s.catCol}>
                    {HOME_CATEGORIES.filter(cat => cat.col === col).map(cat => (
                      <button key={cat.id} onClick={() => onNavigate("cat:" + cat.id)} style={s.catCard}>
                        <span style={s.catCardLabel}>{cat.label}</span>
                        <span style={s.catCardDesc}>{cat.desc}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

function App() {
  const [page, setPage] = useState("home");
  const [history, setHistory] = useState([]);

  const navigate = (id) => {
    setHistory(prev => [...prev, page]);
    setPage(id);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setPage(prev);
    window.scrollTo(0, 0);
  };

  if (page === "home") return <HomePage onNavigate={navigate} />;
  if (page.startsWith("cat:")) return <CategoryPage catId={page.slice(4)} onNavigate={navigate} onBack={goBack} />;
  return <ConceptPage conceptId={page} onNavigate={navigate} onBack={goBack} history={history} />;
}

export default App;

// ─── STYLES ───────────────────────────────────────────────────────────────────

const s = {
  root:               { minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Inter', system-ui, sans-serif" },
  nav:                { position: "fixed", top: 0, left: 0, right: 0, height: 64, background: "#fff", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "0 32px", zIndex: 100 },
  navLogo:            { fontSize: 22, fontWeight: 900, color: "#111827", background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.5px", fontFamily: "inherit" },
  navSearch:          { flex: 1, maxWidth: 360 },
  searchInput:        { width: "100%", padding: "8px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", background: "#F9FAFB" },
  navExplore:         { padding: "8px 18px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  layout:             { display: "flex", minHeight: "100vh", paddingTop: 64 },
  sidebar:            { width: 260, flexShrink: 0, position: "sticky", top: 64, height: "calc(100vh - 64px)", overflowY: "auto", padding: "32px 0 32px 16px", borderRight: "1px solid #E5E7EB", background: "#fff" },
  sidebarLabel:       { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#9CA3AF", marginBottom: 16, textTransform: "uppercase", paddingLeft: 10 },
  sidebarEraRow:      { display: "flex", alignItems: "stretch", marginBottom: 2 },
  sidebarItem:        { display: "flex", flexDirection: "column", width: "100%", padding: "9px 10px", textAlign: "left", background: "none", border: "none", borderLeft: "3px solid transparent", borderRadius: "0 6px 6px 0", fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer", fontFamily: "inherit", gap: 2 },
  sidebarItemActive:  { background: "#E8F0FF", borderLeftColor: "#3B82F6", color: "#1D4ED8" },
  sidebarItemParentActive: { background: "#F5F3FF", borderLeftColor: "#7C3AED", color: "#5B21B6" },
  sidebarYears:       { fontSize: 11, color: "#9CA3AF" },
  sidebarToggle:      { fontSize: 11, color: "#9CA3AF", padding: "4px 8px", cursor: "default", userSelect: "none" },
  sidebarToggleBtn:   { fontSize: 11, color: "#9CA3AF", padding: "4px 8px", background: "none", border: "none", cursor: "pointer", userSelect: "none", fontFamily: "inherit" },
  sidebarSubs:        { paddingLeft: 16, marginBottom: 4 },
  sidebarSubItem:     { display: "block", width: "100%", padding: "5px 10px", background: "none", border: "none", borderLeft: "3px solid transparent", borderRadius: "0 4px 4px 0", cursor: "pointer", fontSize: 13, color: "#6B7280", fontFamily: "inherit", textAlign: "left" },
  sidebarSynthesisDivider: { height: 1, background: "#E5E7EB", margin: "18px 12px 12px 0" },
  sidebarSynthesisItem: { display: "flex", flexDirection: "column", width: "100%", padding: "9px 10px", textAlign: "left", background: "none", border: "none", borderLeft: "3px solid transparent", borderRadius: "0 6px 6px 0", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit", gap: 2 },
  main:               { flex: 1, padding: "48px 56px 120px 56px", maxWidth: 860 },
  pageHero:           { marginBottom: 48 },
  pageTitle:          { fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: "-1px", marginBottom: 12 },
  pageSubtitle:       { fontSize: 17, color: "#6B7280", lineHeight: 1.6, maxWidth: 560 },
  backBtn:            { background: "none", border: "none", color: "#2563EB", fontSize: 14, cursor: "pointer", marginBottom: 32, padding: 0, fontFamily: "inherit" },
  eraSection:         { marginBottom: 64, scrollMarginTop: 96 },
  eraHeader:          { display: "flex", alignItems: "center", gap: 14, marginBottom: 24 },
  eraHeaderLine:      { flex: 1, height: 1, background: "#E5E7EB" },
  eraTitle:           { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase", whiteSpace: "nowrap" },
  cardStack:          { display: "flex", flexDirection: "column", gap: 16 },
  card:               { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px" },
  cardTitleRow:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, textDecoration: "none", gap: 12 },
  cardTitleLeft:      { display: "flex", flexDirection: "column", gap: 4 },
  cardTitle:          { fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" },
  cardTag:            { fontSize: 12, color: "#6B7280", fontStyle: "italic" },
  cardCitation:       { fontSize: 11, color: "#9CA3AF", lineHeight: 1.4 },
  cardLink:           { fontSize: 12, color: "#2563EB", whiteSpace: "nowrap", fontWeight: 500 },
  hebrewBlock:        { background: "#F9FAFB", borderRadius: 8, padding: "12px 16px", marginBottom: 12, textAlign: "right" },
  textBlockLabel:     { display: "block", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 6, textAlign: "left" },
  paraphraseLabel:    { display: "block", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: "#92400E", marginBottom: 6 },
  hebrewText:         { fontSize: 18, lineHeight: 1.8, color: "#111827", direction: "rtl", margin: 0 },
  englishBlock:       { marginBottom: 12 },
  englishText:        { fontSize: 15, color: "#374151", lineHeight: 1.7, fontStyle: "italic", margin: 0 },
  paraphraseText:     { fontStyle: "normal" },
  citationNote:       { fontSize: 11, color: "#92400E", lineHeight: 1.5, margin: "8px 0 0" },
  summaryBlock:       { borderTop: "1px solid #F3F4F6", paddingTop: 10, marginTop: 4 },
  summaryLabel:       { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase", display: "block", marginBottom: 4 },
  summaryText:        { fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 },
  synthesisSection:   { marginTop: 72, scrollMarginTop: 96 },
  synthesisPanel:     { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "28px 32px" },
  synthesisHeader:    { fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 16, margin: 0 },
  synthesisText:      { fontSize: 16, color: "#374151", lineHeight: 1.8, marginTop: 12 },
  relatedPanel:       { marginTop: 40, marginBottom: 24 },
  relatedLabel:       { fontSize: 13, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 },
  chipsRow:           { display: "flex", flexWrap: "wrap", gap: 8 },
  chip:               { padding: "6px 14px", borderRadius: 20, border: "1px solid #E5E7EB", background: "#fff", fontSize: 13, color: "#6B7280", cursor: "default", fontFamily: "inherit" },
  chipLinked:         { color: "#2563EB", borderColor: "#BFDBFE", cursor: "pointer", background: "#EFF6FF" },
  homeMain:           { paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center" },
  homeCenter:         { width: "100%", maxWidth: 860, padding: "40px 40px 60px", textAlign: "center" },
  homeLogo:           { fontSize: 72, fontWeight: 800, color: "#111827", margin: "0 0 10px", letterSpacing: "-4px", lineHeight: 1, textAlign: "center" },
  homeTagline:        { fontSize: 16, color: "#6B7280", lineHeight: 1.5, margin: "0 0 18px", fontWeight: 400, textAlign: "center" },
  homeSearchBox:      { marginBottom: 6 },
  homeSearchInput:    { width: "100%", height: 42, border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "0 18px", fontSize: 15, color: "#374151", background: "#F9FAFB", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  searchResults:      { marginTop: 16, display: "flex", flexDirection: "column", gap: 4 },
  searchResultItem:   { display: "flex", flexDirection: "column", gap: 2, padding: "12px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, textAlign: "left", cursor: "pointer", fontFamily: "inherit" },
  catGrid:            { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, gridAutoRows: "1fr" },
  catCol:             { display: "flex", flexDirection: "column", gap: 12 },
  catCard:            { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4, textAlign: "left", cursor: "pointer", fontFamily: "inherit", flex: 1 },
  catCardLabel:       { fontSize: 15, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" },
  catCardDesc:        { fontSize: 12, color: "#9CA3AF", lineHeight: 1.4 },
  catConceptGrid:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  catConceptCard:     { background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 6, textAlign: "left", cursor: "pointer", fontFamily: "inherit" },
  catConceptCardTitle:{ fontSize: 18, fontWeight: 700, color: "#111827", letterSpacing: "-0.3px" },
  catConceptCardDesc: { fontSize: 14, color: "#6B7280", lineHeight: 1.5 },
  catConceptCardArrow:{ fontSize: 13, color: "#2563EB", fontWeight: 500, marginTop: 4, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
};
