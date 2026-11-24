import { useEffect, useMemo, useState } from "react";
import Campaign, {
  campaignPhases
} from "./components/Campaign";
import DashboardContent from "./components/DashboardContent";
import PlanningSettings from "./components/PlanningSettings";
import EvidenceModal from "./components/EvidenceModal";
import DataBackup from "./components/DataBackup";
import LibraryProjects from "./components/LibraryProjects";

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
    backup: "Backup dos dados",
    settings: "Configurações",
    logout: "Sair",
    logoutConfirm:
      "Deseja sair do planejamento? Seus dados continuarão salvos neste navegador.",
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
    firstReview: "Revisão da rota",
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
    localStorageNotice:
      "Seus dados ficam salvos neste navegador. Este protótipo não possui autenticação em servidor.",
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
    backup: "Data backup",
    settings: "Settings",
    logout: "Log out",
    logoutConfirm:
      "Do you want to leave the planning space? Your data will remain saved in this browser.",
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
    firstReview: "Route review",
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
    localStorageNotice:
      "Your data is saved in this browser. This prototype does not use server authentication.",
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

const initialProjects = [
  {
    id: "web-application",
    title: {
      pt: "Aplicação web pequena",
      en: "Small web application"
    },
    description: {
      pt: "Interface, API, banco de dados, testes e README.",
      en: "Interface, API, database, tests and README."
    },
    stages: [
      {
        id: "planning",
        pt: "Definir problema e escopo",
        en: "Define problem and scope"
      },
      {
        id: "interface",
        pt: "Criar a interface",
        en: "Build the interface"
      },
      {
        id: "api",
        pt: "Criar a API",
        en: "Build the API"
      },
      {
        id: "database",
        pt: "Conectar o banco de dados",
        en: "Connect the database"
      },
      {
        id: "tests",
        pt: "Adicionar testes",
        en: "Add tests"
      },
      {
        id: "documentation",
        pt: "Documentar no README",
        en: "Document in the README"
      }
    ],
    completedStages: []
  },
  {
    id: "service-integration",
    title: {
      pt: "Integração entre serviços",
      en: "Service integration"
    },
    description: {
      pt: "API, webhook, autenticação, logs e tratamento de falhas.",
      en: "API, webhook, authentication, logs and failure handling."
    },
    stages: [
      {
        id: "integration-scope",
        pt: "Definir os serviços envolvidos",
        en: "Define the services involved"
      },
      {
        id: "api-connection",
        pt: "Criar a conexão entre APIs",
        en: "Create the API connection"
      },
      {
        id: "webhook",
        pt: "Implementar webhook",
        en: "Implement the webhook"
      },
      {
        id: "authentication",
        pt: "Adicionar autenticação",
        en: "Add authentication"
      },
      {
        id: "logs",
        pt: "Registrar logs e erros",
        en: "Record logs and errors"
      },
      {
        id: "failure-handling",
        pt: "Tratar falhas e indisponibilidade",
        en: "Handle failures and downtime"
      }
    ],
    completedStages: []
  },
  {
    id: "cloud-deployment",
    title: {
      pt: "Deploy em cloud",
      en: "Cloud deployment"
    },
    description: {
      pt: "Diagrama, IAM, monitoramento, custos e desligamento.",
      en: "Diagram, IAM, monitoring, costs and shutdown checklist."
    },
    stages: [
      {
        id: "architecture",
        pt: "Desenhar a arquitetura",
        en: "Design the architecture"
      },
      {
        id: "aws-service",
        pt: "Escolher os serviços AWS",
        en: "Choose AWS services"
      },
      {
        id: "iam",
        pt: "Configurar permissões IAM",
        en: "Configure IAM permissions"
      },
      {
        id: "deployment",
        pt: "Realizar o deploy",
        en: "Perform the deployment"
      },
      {
        id: "monitoring",
        pt: "Configurar monitoramento",
        en: "Configure monitoring"
      },
      {
        id: "costs",
        pt: "Registrar custos e checklist de desligamento",
        en: "Record costs and shutdown checklist"
      }
    ],
    completedStages: []
  }
];

const initialData = {
  user: null,
  language: "pt",
  theme: "dark",
  page: "dashboard",
  library: [],
  mode: "normal",
  weeklyHours: 15,
  difficultWeekHours: 7,
  monthlyBudget: 500,
  lastReview: null,
  reviewNote: "",
  evidences: {},
  projects: initialProjects,
  completedMissions: [],
  missionStatuses: {},
  tracks: initialTracks
};

function normalizeData(parsed = {}) {
  const savedTracks = Array.isArray(parsed.tracks)
    ? parsed.tracks
    : initialTracks;

  const savedProjects = Array.isArray(parsed.projects)
    ? parsed.projects
    : initialProjects;

  const savedLibrary = Array.isArray(parsed.library)
    ? parsed.library
    : [];

  return {
    ...initialData,
    ...parsed,
    library: savedLibrary,
    tracks: savedTracks,
    projects: savedProjects.map((project) => ({
      ...project,
      completedStages: Array.isArray(project.completedStages)
        ? project.completedStages
        : []
    })),
    completedMissions: Array.isArray(parsed.completedMissions)
      ? parsed.completedMissions
      : [],
    missionStatuses: parsed.missionStatuses || {},
    evidences: parsed.evidences || {},
    reviewNote: parsed.reviewNote || ""
  };
}

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  const backupData = localStorage.getItem(`${STORAGE_KEY}-backup`);

  if (savedData) {
    try {
      return normalizeData(JSON.parse(savedData));
    } catch {
      console.warn(
        "Dados principais inválidos. Tentando recuperar o backup."
      );
    }
  }

  if (backupData) {
    try {
      const recoveredData = normalizeData(
        JSON.parse(backupData)
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recoveredData)
      );

      return recoveredData;
    } catch {
      console.warn(
        "Não foi possível recuperar o backup automático."
      );
    }
  }

  return initialData;
}

function collectMissions(value, missions = []) {
  if (!value) {
    return missions;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectMissions(item, missions);
    });

    return missions;
  }

  if (typeof value !== "object") {
    return missions;
  }

  const isMission =
    typeof value.id === "string" &&
    typeof value.trackId === "string" &&
    value.title &&
    typeof value.title === "object";

  if (isMission) {
    if (!missions.some((mission) => mission.id === value.id)) {
      missions.push(value);
    }

    return missions;
  }

  Object.values(value).forEach((item) => {
    collectMissions(item, missions);
  });

  return missions;
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
    const serializedData = JSON.stringify(data);

    localStorage.setItem(STORAGE_KEY, serializedData);
    localStorage.setItem(
      `${STORAGE_KEY}-backup`,
      serializedData
    );
    localStorage.setItem(
      `${STORAGE_KEY}-backup-date`,
      new Date().toISOString()
    );

    document.documentElement.dataset.theme = data.theme;
  }, [data]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== "Escape") {
        return;
      }

      if (showBackup) {
        setShowBackup(false);
        return;
      }

      if (showSettings) {
        setShowSettings(false);
        return;
      }

      if (showReview) {
        setShowReview(false);
        return;
      }

      if (evidenceMission) {
        setEvidenceMission(null);
        return;
      }

      if (selectedMission) {
        setSelectedMission(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [
    showBackup,
    showSettings,
    showReview,
    evidenceMission,
    selectedMission
  ]);

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

  useEffect(() => {
    const modalIsOpen =
      Boolean(selectedMission) ||
      Boolean(evidenceMission) ||
      showReview ||
      showSettings ||
      showBackup;

    document.body.style.overflow = modalIsOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    selectedMission,
    evidenceMission,
    showReview,
    showSettings,
    showBackup
  ]);

  function updateData(changes) {
    setData((current) => ({
      ...current,
      ...changes
    }));
  }

  function navigate(page) {
    updateData({ page });
    setSidebarOpen(false);
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
    if (!mission || !mission.id) {
      return;
    }

    const isCompleted = data.completedMissions.includes(
      mission.id
    );

    const completedMissions = isCompleted
      ? data.completedMissions.filter(
          (id) => id !== mission.id
        )
      : [...data.completedMissions, mission.id];

    updateData({
      completedMissions,
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

  function toggleProjectStage(projectId, stageId) {
    const projects = data.projects.map((project) => {
      if (project.id !== projectId) {
        return project;
      }

      const completedStages = Array.isArray(
        project.completedStages
      )
        ? project.completedStages
        : [];

      const isCompleted =
        completedStages.includes(stageId);

      return {
        ...project,
        completedStages: isCompleted
          ? completedStages.filter(
              (id) => id !== stageId
            )
          : [...completedStages, stageId]
      };
    });

    updateData({ projects });
  }

  function importBackup(backupData) {
    const normalized = normalizeData({
      ...backupData,
      user: data.user,
      page: "dashboard"
    });

    setData(normalized);
    setShowBackup(false);
  }

  function handleLogout() {
    const confirmed = window.confirm(t.logoutConfirm);

    if (!confirmed) {
      return;
    }

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
          setSidebarOpen(false);
        }}
        onOpenSettings={() => {
          setShowSettings(true);
          setSidebarOpen(false);
        }}
        onOpenBackup={() => {
          setShowBackup(true);
          setSidebarOpen(false);
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
            onComplete={toggleMissionComplete}
            onOpenMission={(mission) => {
              setSelectedMission(mission);
              setSidebarOpen(false);
            }}
            onToggleWeekMode={toggleWeekMode}
            onReview={() => {
              setShowReview(true);
              setSidebarOpen(false);
            }}
            onOpenSettings={() => {
              setShowSettings(true);
              setSidebarOpen(false);
            }}
            onOpenBackup={() => {
              setShowBackup(true);
              setSidebarOpen(false);
            }}
          />
        )}

        {data.page === "campaign" && (
          <Campaign
            data={data}
            t={t}
            onOpenMission={(mission) => {
              setSelectedMission(mission);
              setSidebarOpen(false);
            }}
          />
        )}

        {data.page === "tracks" && (
          <TracksPage
            data={data}
            t={t}
            campaignPhases={campaignPhases}
          />
        )}

        {data.page === "library-projects" && (
          <LibraryProjects
            data={data}
            t={t}
            onChange={updateData}
          />
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

        <p className="local-storage-notice">
          🔒 {t.localStorageNotice}
        </p>

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
  onReview,
  onOpenSettings,
  onOpenBackup
}) {
  const items = [
    ["dashboard", "⌂", t.dashboard],
    ["campaign", "◈", t.campaign],
    ["tracks", "◎", t.tracks],
    [
      "library-projects",
      "▣",
      data.language === "pt"
        ? "Biblioteca e projetos"
        : "Library and projects"
    ]
  ];
  return (
    <aside
      id="main-sidebar"
      className={`sidebar ${
        isOpen ? "is-open" : "is-closed"
      }`}
    >
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        type="button"
        aria-label={
          data.language === "pt"
            ? isOpen
              ? "Fechar menu"
              : "Abrir menu"
            : isOpen
              ? "Close menu"
              : "Open menu"
        }
        aria-expanded={isOpen}
        aria-controls="main-sidebar"
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
        aria-label={
          data.language === "pt"
            ? "Navegação principal"
            : "Main navigation"
        }
      >
        {items.map(([id, icon, label]) => {
          const isActive = data.page === id;

          return (
            <button
              key={id}
              className={`nav-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => onNavigate(id)}
              type="button"
              aria-current={
                isActive ? "page" : undefined
              }
              aria-label={label}
            >
              <span aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}

        <button
          className="nav-item"
          onClick={onOpenSettings}
          type="button"
          aria-label={t.settings}
        >
          <span aria-hidden="true">⚙</span>
          <span>{t.settings}</span>
        </button>

        <button
          className="nav-item"
          onClick={onReview}
          type="button"
          aria-label={t.review}
        >
          <span aria-hidden="true">✎</span>
          <span>{t.review}</span>
        </button>

        <button
          className="nav-item"
          onClick={onOpenBackup}
          type="button"
          aria-label={t.backup}
        >
          <span aria-hidden="true">↥</span>
          <span>{t.backup}</span>
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
    library: t.library,
    "library-projects":
      data.language === "pt"
        ? "Biblioteca e projetos"
        : "Library and projects"
  };

  return (
    <header className="topbar">
      <button
        className="mobile-menu-button"
        onClick={onToggleSidebar}
        type="button"
        aria-label={
          data.language === "pt"
            ? sidebarOpen
              ? "Fechar menu"
              : "Abrir menu"
            : sidebarOpen
              ? "Close menu"
              : "Open menu"
        }
        aria-expanded={sidebarOpen}
        aria-controls="main-sidebar"
      >
        <span aria-hidden="true">☰</span>
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
          aria-label={`${t.logout}: ${data.user.email}`}
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

  const read = (field, fallback = "") => {
    if (!field) {
      return fallback;
    }

    if (
      typeof field === "object" &&
      !Array.isArray(field)
    ) {
      return field[language] || field.pt || field.en || fallback;
    }

    return field;
  };

  const readList = (field) => {
    const value = read(field, []);

    return Array.isArray(value) ? value : [];
  };

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
            {read(mission.track)}
          </span>

          <span className="mission-modal-month">
            {read(mission.month)}
          </span>
        </div>

        <h2 id="mission-modal-title">
          {read(mission.title)}
        </h2>

        <MissionSection
          title={t.objective}
          content={read(mission.objective)}
        />

        <MissionSection
          title={t.relevance}
          content={read(mission.relevance)}
        />

        <MissionList
          title={t.prerequisites}
          items={readList(mission.prerequisites)}
        />

        <MissionList
          title={t.steps}
          items={readList(mission.steps)}
        />

        <div className="mission-detail-grid">
          <div>
            <small>{t.time}</small>
            <strong>{read(mission.time)}</strong>
          </div>

          <div>
            <small>{t.cost}</small>
            <strong>{read(mission.cost)}</strong>
          </div>
        </div>

        <MissionList
          title={t.evidence}
          items={readList(mission.evidence)}
        />

        <MissionSection
          title={t.success}
          content={read(mission.success)}
        />

        <MissionSection
          title={t.nextStep}
          content={read(mission.nextStep)}
        />

        <MissionSection
          title={t.difficultAlternative}
          content={read(mission.difficultAlternative)}
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
  if (!content) {
    return null;
  }

  return (
    <div className="mission-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

function MissionList({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }

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
          autoFocus
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

function TracksPage({
  data,
  t,
  campaignPhases: phases
}) {
  const missions = useMemo(
    () => collectMissions(phases),
    [phases]
  );

  const statsByTrack = data.tracks.reduce(
    (result, track) => {
      const trackMissions = missions.filter(
        (mission) => mission.trackId === track.id
      );

      const completed = trackMissions.filter((mission) =>
        data.completedMissions.includes(mission.id)
      ).length;

      const total = trackMissions.length;

      result[track.id] = {
        total,
        completed,
        progress:
          total > 0
            ? Math.round((completed / total) * 100)
            : 0
      };

      return result;
    },
    {}
  );

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
            ? "O progresso é calculado pelas missões concluídas em cada trilha."
            : "Progress is calculated from completed missions in each track."}
        </p>
      </div>

      <div className="large-track-grid">
        {data.tracks.map((track) => {
          const stats = statsByTrack[track.id] || {
            total: 0,
            completed: 0,
            progress: 0
          };

          return (
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

                <strong>{stats.progress}%</strong>
              </div>

              <div className="progress-bar">
                <span
                  style={{
                    width: `${stats.progress}%`,
                    background: track.color
                  }}
                />
              </div>

              <p className="track-mission-count">
                {data.language === "pt"
                  ? `${stats.completed} de ${stats.total} missões concluídas`
                  : `${stats.completed} of ${stats.total} missions completed`}
              </p>

              {stats.total === 0 && (
                <p className="track-mission-count">
                  {data.language === "pt"
                    ? "Missões ainda não cadastradas nesta trilha."
                    : "No missions registered for this track yet."}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProjectsPage({
  data,
  onToggleStage
}) {
  const language = data.language;

  return (
    <section className="simple-page">
      <div className="page-heading">
        <span className="eyebrow">
          {language === "pt"
            ? "PORTFÓLIO"
            : "PORTFOLIO"}
        </span>

        <h2>
          {language === "pt"
            ? "Projetos progressivos"
            : "Progressive projects"}
        </h2>

        <p>
          {language === "pt"
            ? "Construa evidências práticas em etapas pequenas e verificáveis."
            : "Build practical evidence through small and verifiable stages."}
        </p>
      </div>

      <div className="project-grid">
        {data.projects.map((project, index) => {
          const completedStages = Array.isArray(
            project.completedStages
          )
            ? project.completedStages
            : [];

          const totalStages = project.stages.length;

          const completedCount =
            project.stages.filter((stage) =>
              completedStages.includes(stage.id)
            ).length;

          const progress =
            totalStages > 0
              ? Math.round(
                  (completedCount / totalStages) * 100
                )
              : 0;

          return (
            <article
              className="project-card"
              key={project.id}
            >
              <div className="project-card-header">
                <span className="project-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="project-progress">
                  {progress}%
                </span>
              </div>

              <h3>{project.title[language]}</h3>

              <p>{project.description[language]}</p>

              <div className="progress-bar">
                <span
                  style={{
                    width: `${progress}%`
                  }}
                />
              </div>

              <p className="project-stage-count">
                {language === "pt"
                  ? `${completedCount} de ${totalStages} etapas concluídas`
                  : `${completedCount} of ${totalStages} stages completed`}
              </p>

              <div className="project-stages">
                {project.stages.map((stage) => {
                  const isCompleted =
                    completedStages.includes(stage.id);

                  return (
                    <label
                      className={`project-stage ${
                        isCompleted
                          ? "is-completed"
                          : ""
                      }`}
                      key={stage.id}
                    >
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() =>
                          onToggleStage(
                            project.id,
                            stage.id
                          )
                        }
                      />

                      <span>{stage[language]}</span>
                    </label>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LibraryPage({ data }) {
  const language = data.language;

  const resources = [
    {
      id: "bbc-english",
      category: {
        pt: "Inglês profissional",
        en: "Professional English"
      },
      priority: {
        pt: "Prioridade alta",
        en: "High priority"
      },
      type: {
        pt: "Curso gratuito",
        en: "Free course"
      },
      name: "BBC Learning English",
      description: {
        pt: "Prática de vocabulário, gramática, escuta e pronúncia em inglês.",
        en: "Practice vocabulary, grammar, listening and pronunciation in English."
      },
      url: "https://www.bbc.co.uk/learningenglish/"
    },
    {
      id: "aws-skill-builder",
      category: {
        pt: "Cloud / AWS",
        en: "Cloud / AWS"
      },
      priority: {
        pt: "Prioridade alta",
        en: "High priority"
      },
      type: {
        pt: "Treinamento oficial",
        en: "Official training"
      },
      name: "AWS Skill Builder",
      description: {
        pt: "Cursos e materiais oficiais para fundamentos de cloud e AWS.",
        en: "Official courses and materials for cloud and AWS fundamentals."
      },
      url: "https://skillbuilder.aws/"
    },
    {
      id: "python",
      category: {
        pt: "Programação",
        en: "Programming"
      },
      priority: {
        pt: "Prioridade média",
        en: "Medium priority"
      },
      type: {
        pt: "Documentação oficial",
        en: "Official documentation"
      },
      name: "Python.org",
      description: {
        pt: "Documentação e tutorial oficial para desenvolver fundamentos de programação.",
        en: "Official documentation and tutorial for building programming fundamentals."
      },
      url: "https://docs.python.org/3/tutorial/"
    },
    {
      id: "github-docs",
      category: {
        pt: "Ferramentas de desenvolvimento",
        en: "Development tools"
      },
      priority: {
        pt: "Prioridade média",
        en: "Medium priority"
      },
      type: {
        pt: "Documentação oficial",
        en: "Official documentation"
      },
      name: "GitHub Docs",
      description: {
        pt: "Repositórios, branches, commits, pull requests e colaboração.",
        en: "Repositories, branches, commits, pull requests and collaboration."
      },
      url: "https://docs.github.com/en"
    },
    {
      id: "owasp",
      category: {
        pt: "Cibersegurança",
        en: "Cybersecurity"
      },
      priority: {
        pt: "Prioridade alta",
        en: "High priority"
      },
      type: {
        pt: "Referência técnica",
        en: "Technical reference"
      },
      name: "OWASP",
      description: {
        pt: "Boas práticas para segurança de aplicações e identificação de riscos.",
        en: "Best practices for application security and risk identification."
      },
      url: "https://owasp.org/"
    },
    {
      id: "tv5monde",
      category: {
        pt: "Francês",
        en: "French"
      },
      priority: {
        pt: "Prioridade de manutenção",
        en: "Maintenance priority"
      },
      type: {
        pt: "Curso gratuito",
        en: "Free course"
      },
      name: "TV5MONDE - Apprendre le français",
      description: {
        pt: "Exercícios e materiais para manter o contato gradual com o francês.",
        en: "Exercises and materials for maintaining gradual contact with French."
      },
      url: "https://apprendre.tv5monde.com/"
    },
    {
      id: "dev-community",
      category: {
        pt: "Carreira e comunidade",
        en: "Career and community"
      },
      priority: {
        pt: "Prioridade média",
        en: "Medium priority"
      },
      type: {
        pt: "Comunidade técnica",
        en: "Technical community"
      },
      name: "DEV Community",
      description: {
        pt: "Artigos, experiências e discussões sobre desenvolvimento e tecnologia.",
        en: "Articles, experiences and discussions about development and technology."
      },
      url: "https://dev.to/"
    }
  ];

  return (
    <section className="simple-page">
      <div className="page-heading">
        <span className="eyebrow">
          {language === "pt"
            ? "RECURSOS"
            : "RESOURCES"}
        </span>

        <h2>
          {language === "pt"
            ? "Biblioteca de aprendizagem"
            : "Learning library"}
        </h2>

        <p>
          {language === "pt"
            ? "Materiais organizados para apoiar as trilhas da sua rota."
            : "Organized materials to support the tracks in your route."}
        </p>
      </div>

      <div className="resource-list">
        {resources.map((resource) => (
          <article
            className="resource-card"
            key={resource.id}
          >
            <div className="resource-card-content">
              <div className="resource-card-top">
                <span className="eyebrow">
                  {resource.category[language]}
                </span>

                <span className="resource-priority">
                  {resource.priority[language]}
                </span>
              </div>

              <h3>{resource.name}</h3>

              <p>{resource.description[language]}</p>

              <div className="resource-meta">
                <span>{resource.type[language]}</span>
              </div>

              <a
                className="secondary-button resource-link"
                href={resource.url}
                target="_blank"
                rel="noreferrer"
              >
                {language === "pt"
                  ? "Abrir recurso"
                  : "Open resource"}
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default App;