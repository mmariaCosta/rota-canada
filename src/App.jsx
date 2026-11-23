import { useEffect, useState } from "react";
import Campaign from "./components/Campaign";
import DashboardContent from "./components/DashboardContent";
import PlanningSettings from "./components/PlanningSettings";
import EvidenceModal from "./components/EvidenceModal";
import DataBackup from "./components/DataBackup";

const STORAGE_KEY = "rota-canada-app-v3";

const translations = {
  pt: {
    appName: "Rota para o Canadá",
    subtitle: "Arquiteta de Soluções",
    dashboard: "Painel",
    campaign: "Campanha",
    tracks: "Trilhas",
    projects: "Projetos",
    library: "Biblioteca",
    review: "Revisão",
    logout: "Sair",
    light: "Modo claro",
    dark: "Modo escuro",
    currentMission: "Missão atual",
    nextAction: "Próxima ação de 10 minutos",
    tracksProgress: "Progresso por trilha",
    milestones: "Marcos revisáveis",
    weeklyLoad: "Carga semanal",
    budget: "Orçamento mensal",
    currentPhase: "Fase atual",
    normalWeek: "Semana normal",
    difficultWeek: "Semana difícil",
    difficultMode: "Ativar semana difícil",
    normalMode: "Voltar ao modo normal",
    complete: "Marcar como concluída",
    completed: "Concluída",
    details: "Detalhes da missão",
    reviewNow: "Fazer revisão curta",
    aspiration: "Meta aspiracional",
    reviewable: "Revisável",
    inProgress: "Em andamento",
    campaignMap: "Mapa da jornada",
    futurePhase: "Planejamento futuro revisável",
    objective: "Objetivo",
    relevance: "Por que isso importa",
    prerequisites: "Pré-requisitos",
    steps: "Passos",
    time: "Tempo estimado",
    cost: "Custo",
    evidence: "Evidência de conclusão",
    success: "Critério de sucesso",
    nextStep: "Próximo passo",
    difficultAlternative: "Alternativa para semana difícil",
    status: "Estado da missão",
    notStarted: "Não iniciada",
    started: "Em andamento",
    postponed: "Adiada",
    recalibrate: "Recalibrar",
    close: "Fechar",
    save: "Salvar",
    cancel: "Cancelar",
    firstReview: "Primeira revisão",
    reviewQuestion: "Como está sua rota neste momento?",
    reviewDescription:
      "Registre uma observação curta. Você poderá complementar depois.",
    reviewPlaceholder:
      "Ex.: Quero começar pelo diagnóstico de inglês e entender como distribuir minhas 15 horas.",
    loginTitle: "Comece sua rota",
    loginDescription:
      "Um espaço privado para transformar objetivos grandes em próximos passos possíveis.",
    email: "Seu e-mail",
    enter: "Entrar no planejamento",
    privateData: "Dados privados e editáveis",
    registerEvidence: "Registrar evidência",
    aspirationText:
      "Avaliar a possibilidade de residir no Canadá até 2033, conforme formação, experiência, idioma, recursos, oportunidades e regras vigentes.",
    resourceWarning:
      "Verifique links, preços e disponibilidade antes de utilizar ou pagar por qualquer recurso."
  },

  en: {
    appName: "Route to Canada",
    subtitle: "Solutions Architect",
    dashboard: "Dashboard",
    campaign: "Campaign",
    tracks: "Tracks",
    projects: "Projects",
    library: "Library",
    review: "Review",
    logout: "Log out",
    light: "Light mode",
    dark: "Dark mode",
    currentMission: "Current mission",
    nextAction: "Next 10-minute action",
    tracksProgress: "Progress by track",
    milestones: "Reviewable milestones",
    weeklyLoad: "Weekly load",
    budget: "Monthly budget",
    currentPhase: "Current phase",
    normalWeek: "Normal week",
    difficultWeek: "Difficult week",
    difficultMode: "Activate difficult week",
    normalMode: "Return to normal mode",
    complete: "Mark as completed",
    completed: "Completed",
    details: "Mission details",
    reviewNow: "Do short review",
    aspiration: "Aspirational goal",
    reviewable: "Reviewable",
    inProgress: "In progress",
    campaignMap: "Journey map",
    futurePhase: "Reviewable future planning",
    objective: "Objective",
    relevance: "Why it matters",
    prerequisites: "Prerequisites",
    steps: "Steps",
    time: "Estimated time",
    cost: "Cost",
    evidence: "Completion evidence",
    success: "Success criteria",
    nextStep: "Next step",
    difficultAlternative: "Difficult-week alternative",
    status: "Mission status",
    notStarted: "Not started",
    started: "In progress",
    postponed: "Postponed",
    recalibrate: "Recalibrate",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    firstReview: "First review",
    reviewQuestion: "How is your route right now?",
    reviewDescription:
      "Write a short note. You can add more details later.",
    reviewPlaceholder:
      "Example: I want to start with the English assessment and understand how to distribute my 15 hours.",
    loginTitle: "Start your route",
    loginDescription:
      "A private space to transform large goals into realistic next steps.",
    email: "Your email",
    enter: "Enter planning space",
    privateData: "Private and editable data",
    registerEvidence: "Record evidence",
    aspirationText:
      "Assess the possibility of living in Canada by 2033 according to education, experience, language, resources, opportunities and current rules.",
    resourceWarning:
      "Check links, prices and availability before using or paying for any resource."
  }
};

const initialTracks = [
  ["english", "Inglês profissional", "Professional English", "#51d7c4"],
  ["french", "Francês", "French", "#9c8cff"],
  ["technical", "Fundamentos técnicos", "Technical fundamentals", "#f3b562"],
  ["security", "Cibersegurança", "Cybersecurity", "#ff719d"],
  ["cloud", "Cloud / AWS", "Cloud / AWS", "#62a8ff"],
  ["software", "Arquitetura de software", "Software architecture", "#d98cff"],
  ["integration", "Integração", "Integration", "#78d98a"],
  ["career", "Carreira", "Career", "#c8d66b"],
  ["immigration", "Imigração informativa", "Immigration research", "#ffad7a"]
].map(([id, pt, en, color]) => ({
  id,
  name: { pt, en },
  color,
  progress: 0
}));

const initialData = {
  user: null,
  language: "pt",
  theme: "dark",
  page: "dashboard",
  mode: "normal",
  weeklyHours: 15,
  difficultWeekHours: 7,
  monthlyBudget: 500,
  lastReview: null,
  reviewNote: "",
  evidences: {},
  completedMissions: [],
  missionStatuses: {},
  tracks: initialTracks
};

const mainMission = {
  id: "english-baseline-2027-01",
  trackId: "english",

  title: {
    pt: "Descobrir seu ponto de partida no inglês",
    en: "Discover your English starting point"
  },

  track: {
    pt: "Inglês profissional",
    en: "Professional English"
  },

  month: {
    pt: "Janeiro de 2027",
    en: "January 2027"
  },

  objective: {
    pt: "Fazer uma avaliação inicial e registrar os resultados para ajustar a trilha de estudos.",
    en: "Take an initial assessment and record the results to adjust your study track."
  },

  relevance: {
    pt: "Um diagnóstico inicial ajuda a criar metas realistas para leitura, escrita, escuta e fala.",
    en: "An initial assessment helps create realistic goals for reading, writing, listening and speaking."
  },

  prerequisites: {
    pt: [
      "Separar aproximadamente 50 minutos.",
      "Escolher uma avaliação disponível e confiável.",
      "Registrar a data e o resultado."
    ],
    en: [
      "Set aside approximately 50 minutes.",
      "Choose an available and reliable assessment.",
      "Record the date and result."
    ]
  },

  steps: {
    pt: [
      "Fazer a avaliação inicial de inglês.",
      "Registrar o resultado e a data.",
      "Anotar quais habilidades pareceram mais difíceis.",
      "Definir o próximo foco de estudo.",
      "Guardar a evidência no diário de progresso."
    ],
    en: [
      "Take the initial English assessment.",
      "Record the result and date.",
      "Write down which skills felt more difficult.",
      "Define the next study focus.",
      "Save the evidence in the progress journal."
    ]
  },

  time: "50 min",

  cost: {
    pt: "Gratuito — confirmar disponibilidade",
    en: "Free — confirm availability"
  },

  evidence: {
    pt: [
      "Resultado da avaliação.",
      "Data da realização.",
      "Observações sobre pontos fortes e dificuldades.",
      "Próximo objetivo definido."
    ],
    en: [
      "Assessment result.",
      "Date completed.",
      "Notes about strengths and difficulties.",
      "Next objective defined."
    ]
  },

  success: {
    pt: "Conseguir descrever seu ponto de partida sem transformar o resultado em um julgamento pessoal.",
    en: "Describe your starting point without turning the result into a personal judgment."
  },

  nextStep: {
    pt: "Escolher uma rotina inicial de inglês profissional ajustada ao resultado.",
    en: "Choose an initial professional English routine based on the result."
  },

  difficultAlternative: {
    pt: "Criar uma nota chamada “Meu ponto de partida no inglês” e escrever três dificuldades percebidas.",
    en: "Create a note called “My English starting point” and write down three perceived difficulties."
  }
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialData;
    }

    const parsed = JSON.parse(saved);

    return {
      ...initialData,
      ...parsed,
      tracks: Array.isArray(parsed.tracks)
        ? parsed.tracks
        : initialTracks,
      completedMissions: Array.isArray(parsed.completedMissions)
        ? parsed.completedMissions
        : [],
      missionStatuses: parsed.missionStatuses || {},
      evidences: parsed.evidences || {},
      reviewNote: parsed.reviewNote || ""
    };
  } catch {
    return initialData;
  }
}

function App() {
  const [data, setData] = useState(loadData);
  const [selectedMission, setSelectedMission] = useState(null);
  const [evidenceMission, setEvidenceMission] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth > 680
  );
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= 680
  );

  const t = translations[data.language];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    document.documentElement.dataset.theme = data.theme;
  }, [data]);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 680;

      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(true);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function updateData(changes) {
    setData((current) => ({
      ...current,
      ...changes
    }));
  }

  function navigate(page) {
    updateData({ page });

    if (window.innerWidth <= 680) {
      setSidebarOpen(false);
    }
  }

  function toggleLanguage() {
    updateData({
      language: data.language === "pt" ? "en" : "pt"
    });
  }

  function toggleTheme() {
    updateData({
      theme: data.theme === "dark" ? "light" : "dark"
    });
  }

  function toggleWeekMode() {
    updateData({
      mode: data.mode === "normal" ? "difficult" : "normal"
    });
  }

  function setMissionStatus(missionId, status) {
    updateData({
      missionStatuses: {
        ...data.missionStatuses,
        [missionId]: status
      }
    });
  }

  function toggleMissionComplete(mission) {
    const isCompleted = data.completedMissions.includes(
      mission.id
    );

    const completedMissions = isCompleted
      ? data.completedMissions.filter(
          (id) => id !== mission.id
        )
      : [...data.completedMissions, mission.id];

    const tracks = data.tracks.map((track) => {
      if (track.id !== mission.trackId) {
        return track;
      }

      return {
        ...track,
        progress: isCompleted
          ? Math.max(0, track.progress - 8)
          : Math.min(100, track.progress + 8)
      };
    });

    updateData({
      completedMissions,
      tracks,
      missionStatuses: {
        ...data.missionStatuses,
        [mission.id]: isCompleted
          ? "not_started"
          : "completed"
      }
    });
  }

  function saveReview(reviewText) {
    const reviewDate = new Date().toLocaleDateString(
      data.language === "pt" ? "pt-BR" : "en-US"
    );

    updateData({
      lastReview: reviewDate,
      reviewNote: reviewText
    });

    setShowReview(false);
  }

  function savePlanningSettings(settings) {
    updateData(settings);
    setShowSettings(false);
  }

  function saveEvidence(missionId, evidence) {
    updateData({
      evidences: {
        ...data.evidences,
        [missionId]: evidence
      }
    });

    setEvidenceMission(null);
  }

  function importBackup(backupData) {
    setData({
      ...initialData,
      ...backupData,
      user: data.user,
      tracks: Array.isArray(backupData.tracks)
        ? backupData.tracks
        : initialTracks,
      completedMissions: Array.isArray(
        backupData.completedMissions
      )
        ? backupData.completedMissions
        : [],
      missionStatuses: backupData.missionStatuses || {},
      evidences: backupData.evidences || {}
    });

    setShowBackup(false);
  }

  function handleLogout() {
    updateData({
      user: null,
      page: "dashboard"
    });

    setSidebarOpen(true);
  }

  if (!data.user) {
    return (
      <LoginScreen
        language={data.language}
        t={t}
        onLanguageChange={toggleLanguage}
        onLogin={(email) => {
          updateData({
            user: { email },
            page: "dashboard"
          });
        }}
      />
    );
  }

  const isMainMissionCompleted =
    data.completedMissions.includes(mainMission.id);

  return (
    <div
      className={`app-shell ${
        sidebarOpen
          ? "sidebar-is-open"
          : "sidebar-is-closed"
      }`}
    >
      {isMobile && sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label={
            data.language === "pt"
              ? "Fechar menu"
              : "Close menu"
          }
          type="button"
        />
      )}

      <Sidebar
        data={data}
        t={t}
        isOpen={sidebarOpen}
        onToggle={() =>
          setSidebarOpen((current) => !current)
        }
        onNavigate={navigate}
        onToggleLanguage={toggleLanguage}
        onToggleTheme={toggleTheme}
        onReview={() => {
          setShowReview(true);

          if (isMobile) {
            setSidebarOpen(false);
          }
        }}
      />

      <main className="main-content">
        <Header
          data={data}
          t={t}
          onLogout={handleLogout}
          onToggleSidebar={() =>
            setSidebarOpen((current) => !current)
          }
          sidebarOpen={sidebarOpen}
        />

        {data.page === "dashboard" && (
          <DashboardContent
            data={data}
            t={t}
            mission={mainMission}
            completed={isMainMissionCompleted}
            onComplete={() =>
              toggleMissionComplete(mainMission)
            }
            onOpenMission={() =>
              setSelectedMission(mainMission)
            }
            onToggleWeekMode={toggleWeekMode}
            onReview={() => setShowReview(true)}
            onOpenSettings={() =>
              setShowSettings(true)
            }
            onOpenBackup={() => setShowBackup(true)}
          />
        )}

        {data.page === "campaign" && (
          <Campaign
            data={data}
            t={t}
            onOpenMission={(mission) =>
              setSelectedMission(mission)
            }
          />
        )}

        {data.page === "tracks" && (
          <TracksPage data={data} t={t} />
        )}

        {data.page === "projects" && (
          <ProjectsPage data={data} t={t} />
        )}

        {data.page === "library" && (
          <LibraryPage data={data} t={t} />
        )}

        <footer className="privacy-note">
          {t.privateData}. {t.resourceWarning}
        </footer>
      </main>

      {selectedMission && (
        <MissionModal
          mission={selectedMission}
          data={data}
          t={t}
          hasEvidence={Boolean(
            data.evidences?.[selectedMission.id]
          )}
          onClose={() => setSelectedMission(null)}
          onStatusChange={(status) =>
            setMissionStatus(
              selectedMission.id,
              status
            )
          }
          onComplete={() =>
            toggleMissionComplete(selectedMission)
          }
          onOpenEvidence={() => {
            setEvidenceMission(selectedMission);
            setSelectedMission(null);
          }}
        />
      )}

      {evidenceMission && (
        <EvidenceModal
          mission={evidenceMission}
          data={data}
          t={t}
          initialEvidence={
            data.evidences?.[evidenceMission.id]
          }
          onClose={() => setEvidenceMission(null)}
          onSave={(evidence) =>
            saveEvidence(
              evidenceMission.id,
              evidence
            )
          }
        />
      )}

      {showReview && (
        <ReviewModal
          t={t}
          initialText={data.reviewNote}
          onClose={() => setShowReview(false)}
          onSave={saveReview}
        />
      )}

      {showSettings && (
        <PlanningSettings
          data={data}
          t={t}
          onClose={() => setShowSettings(false)}
          onSave={savePlanningSettings}
        />
      )}

      {showBackup && (
        <DataBackup
          data={data}
          t={t}
          onClose={() => setShowBackup(false)}
          onImport={importBackup}
        />
      )}
    </div>
  );
}

function LoginScreen({
  language,
  t,
  onLanguageChange,
  onLogin
}) {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (normalizedEmail) {
      onLogin(normalizedEmail);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand login-brand">
          <div className="brand-mark">✦</div>

          <div>
            <strong>{t.appName}</strong>
            <span>{t.subtitle}</span>
          </div>
        </div>

        <span className="eyebrow">
          PERSONAL CAREER CAMPAIGN
        </span>

        <h1>{t.loginTitle}</h1>

        <p>{t.loginDescription}</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">
            {t.email}
          </label>

          <input
            id="login-email"
            type="email"
            value={email}
            placeholder="voce@exemplo.com"
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <button
            className="primary-button full-button"
            type="submit"
          >
            {t.enter}
          </button>
        </form>

        <button
          className="text-button"
          onClick={onLanguageChange}
          type="button"
        >
          {language === "pt"
            ? "English"
            : "Português"}
        </button>
      </section>
    </main>
  );
}

function Sidebar({
  data,
  t,
  isOpen,
  onToggle,
  onNavigate,
  onToggleLanguage,
  onToggleTheme,
  onReview
}) {
  const items = [
    ["dashboard", "⌂", t.dashboard],
    ["campaign", "◈", t.campaign],
    ["tracks", "◎", t.tracks],
    ["projects", "▣", t.projects],
    ["library", "▤", t.library]
  ];

  return (
    <aside
      className={`sidebar ${
        isOpen ? "is-open" : "is-closed"
      }`}
    >
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        type="button"
        aria-label={
          isOpen ? "Fechar menu" : "Abrir menu"
        }
      >
        {isOpen ? "‹" : "›"}
      </button>

      <div className="brand">
        <div className="brand-mark">✦</div>

        <div>
          <strong>{t.appName}</strong>
          <span>{t.subtitle}</span>
        </div>
      </div>

      <nav
        className="main-nav"
        aria-label="Navegação principal"
      >
        {items.map(([id, icon, label]) => (
          <button
            key={id}
            className={`nav-item ${
              data.page === id ? "active" : ""
            }`}
            onClick={() => onNavigate(id)}
            type="button"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}

        <button
          className="nav-item"
          onClick={onReview}
          type="button"
        >
          ◌
          <span>{t.review}</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button
          className="text-button"
          onClick={onToggleTheme}
          type="button"
        >
          {data.theme === "dark" ? "☼" : "☾"}{" "}
          {data.theme === "dark"
            ? t.light
            : t.dark}
        </button>

        <button
          className="text-button"
          onClick={onToggleLanguage}
          type="button"
        >
          ◉{" "}
          {data.language === "pt"
            ? "English"
            : "Português"}
        </button>
      </div>
    </aside>
  );
}

function Header({
  data,
  t,
  onLogout,
  onToggleSidebar,
  sidebarOpen
}) {
  const pageTitles = {
    dashboard: t.dashboard,
    campaign: t.campaign,
    tracks: t.tracks,
    projects: t.projects,
    library: t.library
  };

  return (
    <header className="topbar">
      <button
        className="mobile-menu-button"
        onClick={onToggleSidebar}
        type="button"
        aria-label={
          sidebarOpen ? "Fechar menu" : "Abrir menu"
        }
      >
        ☰
      </button>

      <div>
        <span className="eyebrow">
          {data.language === "pt"
            ? "JANEIRO / 2027"
            : "JANUARY / 2027"}
        </span>

        <h1>{pageTitles[data.page]}</h1>
      </div>

      <div className="user-area">
        <span className="user-email">
          {data.user.email}
        </span>

        <button
          className="avatar"
          onClick={onLogout}
          type="button"
          title={t.logout}
        >
          {data.user.email
            .charAt(0)
            .toUpperCase()}
        </button>
      </div>
    </header>
  );
}

function MissionModal({
  mission,
  data,
  t,
  hasEvidence,
  onClose,
  onStatusChange,
  onComplete,
  onOpenEvidence
}) {
  const language = data.language;
  const completed = data.completedMissions.includes(
    mission.id
  );

  const status =
    data.missionStatuses[mission.id] ||
    "not_started";

  return (
    <div className="modal-backdrop">
      <section
        className="mission-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mission-modal-title"
      >
        <button
          className="close-button"
          onClick={onClose}
          type="button"
          aria-label={t.close}
        >
          ×
        </button>

        <div className="modal-header">
          <span className="tag">
            {mission.track[language]}
          </span>

          <span className="mission-modal-month">
            {mission.month[language]}
          </span>
        </div>

        <h2 id="mission-modal-title">
          {mission.title[language]}
        </h2>

        <MissionSection
          title={t.objective}
          content={mission.objective[language]}
        />

        <MissionSection
          title={t.relevance}
          content={mission.relevance[language]}
        />

        <MissionList
          title={t.prerequisites}
          items={mission.prerequisites[language]}
        />

        <MissionList
          title={t.steps}
          items={mission.steps[language]}
        />

        <div className="mission-detail-grid">
          <div>
            <small>{t.time}</small>
            <strong>{mission.time}</strong>
          </div>

          <div>
            <small>{t.cost}</small>
            <strong>{mission.cost[language]}</strong>
          </div>
        </div>

        <MissionList
          title={t.evidence}
          items={mission.evidence[language]}
        />

        <MissionSection
          title={t.success}
          content={mission.success[language]}
        />

        <MissionSection
          title={t.nextStep}
          content={mission.nextStep[language]}
        />

        <MissionSection
          title={t.difficultAlternative}
          content={
            mission.difficultAlternative[language]
          }
        />

        <div className="mission-status-selector">
          <span className="eyebrow">{t.status}</span>

          <div className="status-buttons">
            <button
              className={
                status === "not_started"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                onStatusChange("not_started")
              }
              type="button"
            >
              {t.notStarted}
            </button>

            <button
              className={
                status === "in_progress"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                onStatusChange("in_progress")
              }
              type="button"
            >
              {t.started}
            </button>

            <button
              className={
                status === "paused" ? "selected" : ""
              }
              onClick={() =>
                onStatusChange("paused")
              }
              type="button"
            >
              {t.postponed}
            </button>

            <button
              className={
                status === "recalibrate"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                onStatusChange("recalibrate")
              }
              type="button"
            >
              {t.recalibrate}
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={onOpenEvidence}
            type="button"
          >
            {hasEvidence ? "✓ " : ""}
            {t.registerEvidence}
          </button>

          <button
            className="secondary-button"
            onClick={onClose}
            type="button"
          >
            {t.close}
          </button>

          <button
            className="primary-button"
            onClick={onComplete}
            type="button"
          >
            {completed
              ? `✓ ${t.completed}`
              : t.complete}
          </button>
        </div>
      </section>
    </div>
  );
}

function MissionSection({ title, content }) {
  return (
    <div className="mission-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

function MissionList({ title, items }) {
  return (
    <div className="mission-section">
      <h3>{title}</h3>

      <ol className="mission-ordered-list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReviewModal({
  t,
  initialText,
  onClose,
  onSave
}) {
  const [text, setText] = useState(
    initialText || ""
  );

  return (
    <div className="modal-backdrop">
      <section
        className="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <button
          className="close-button"
          onClick={onClose}
          type="button"
          aria-label={t.close}
        >
          ×
        </button>

        <span className="eyebrow">
          {t.firstReview}
        </span>

        <h2 id="review-modal-title">
          {t.reviewQuestion}
        </h2>

        <p>{t.reviewDescription}</p>

        <textarea
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          placeholder={t.reviewPlaceholder}
          rows="6"
        />

        <div className="modal-actions">
          <button
            className="secondary-button"
            onClick={onClose}
            type="button"
          >
            {t.cancel}
          </button>

          <button
            className="primary-button"
            onClick={() => onSave(text.trim())}
            type="button"
          >
            {t.save}
          </button>
        </div>
      </section>
    </div>
  );
}

function TracksPage({ data, t }) {
  return (
    <section className="simple-page">
      <div className="page-heading">
        <span className="eyebrow">
          {t.tracksProgress}
        </span>

        <h2>
          {data.language === "pt"
            ? "Construindo competências"
            : "Building competencies"}
        </h2>

        <p>
          {data.language === "pt"
            ? "Cada trilha evolui por meio de evidências demonstráveis."
            : "Each track evolves through demonstrable evidence."}
        </p>
      </div>

      <div className="large-track-grid">
        {data.tracks.map((track) => (
          <article
            className="large-track-card"
            key={track.id}
          >
            <div className="large-track-header">
              <span
                className="track-dot"
                style={{
                  background: track.color
                }}
              />

              <h3>{track.name[data.language]}</h3>

              <strong>{track.progress}%</strong>
            </div>

            <div className="progress-bar">
              <span
                style={{
                  width: `${track.progress}%`,
                  background: track.color
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsPage({ data }) {
  const projects = [
    {
      pt: "Aplicação web pequena",
      en: "Small web application",
      descriptionPt:
        "Interface, API, banco de dados, testes e README.",
      descriptionEn:
        "Interface, API, database, tests and README."
    },
    {
      pt: "Integração entre serviços",
      en: "Service integration",
      descriptionPt:
        "API, webhook, autenticação, logs e tratamento de falhas.",
      descriptionEn:
        "API, webhook, authentication, logs and failure handling."
    },
    {
      pt: "Deploy em cloud",
      en: "Cloud deployment",
      descriptionPt:
        "Diagrama, IAM, monitoramento, custos e desligamento.",
      descriptionEn:
        "Diagram, IAM, monitoring, costs and shutdown checklist."
    }
  ];

  return (
    <section className="simple-page">
      <div className="page-heading">
        <span className="eyebrow">PORTFÓLIO</span>

        <h2>
          {data.language === "pt"
            ? "Projetos progressivos"
            : "Progressive projects"}
        </h2>

        <p>
          {data.language === "pt"
            ? "Projetos divididos em etapas pequenas para construir evidências."
            : "Projects divided into small stages to build evidence."}
        </p>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <article
            className="project-card"
            key={project.pt}
          >
            <span className="project-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3>
              {data.language === "pt"
                ? project.pt
                : project.en}
            </h3>

            <p>
              {data.language === "pt"
                ? project.descriptionPt
                : project.descriptionEn}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LibraryPage({ data }) {
  const resources = [
    ["Inglês", "English", "BBC Learning English"],
    ["Cloud", "Cloud", "AWS Skill Builder"],
    ["Programação", "Programming", "Python.org"],
    ["GitHub", "GitHub", "GitHub Docs"],
    ["Segurança", "Security", "OWASP"],
    ["Francês", "French", "TV5MONDE"]
  ];

  return (
    <section className="simple-page">
      <div className="page-heading">
        <span className="eyebrow">RECURSOS</span>

        <h2>
          {data.language === "pt"
            ? "Biblioteca de recursos"
            : "Resource library"}
        </h2>

        <p>
          {data.language === "pt"
            ? "Priorize documentação oficial e materiais gratuitos."
            : "Prioritize official documentation and free materials."}
        </p>
      </div>

      <div className="resource-list">
        {resources.map(([pt, en, name]) => (
          <article
            className="resource-card"
            key={name}
          >
            <div>
              <span className="eyebrow">
                {data.language === "pt"
                  ? pt
                  : en}
              </span>

              <h3>{name}</h3>

              <p>
                {data.language === "pt"
                  ? "Custo e disponibilidade: verificar."
                  : "Cost and availability: verify."}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default App;