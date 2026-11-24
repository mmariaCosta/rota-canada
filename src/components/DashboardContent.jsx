import { campaignPhases } from "./Campaign";

function getAllCampaignMissions() {
  return campaignPhases.flatMap((phase) =>
    phase.months.flatMap((month) =>
      month.missions.map((mission) => ({
        ...mission,
        phaseId: phase.id,
        phaseTitle: phase.title,
        phaseYears: phase.years,
        phaseDescription: phase.description,
        monthData: month
      }))
    )
  );
}

function getMissionTrack(data, trackId) {
  return (
    data.tracks.find((track) => track.id === trackId) ||
    data.tracks.find((track) => track.id === "technical") ||
    {
      id: trackId,
      name: {
        pt: "Trilha técnica",
        en: "Technical track"
      },
      color: "#62a8ff"
    }
  );
}

function createDashboardMission({
  campaignMission,
  data
}) {
  const language = data.language;
  const track = getMissionTrack(
    data,
    campaignMission.trackId
  );

  const month = campaignMission.monthData;

  const isEnglish =
    campaignMission.trackId === "english";

  const isResearch =
    campaignMission.trackId === "career" ||
    campaignMission.trackId === "immigration";

  return {
    id: campaignMission.id,
    trackId: campaignMission.trackId,

    track: {
      pt: track.name.pt,
      en: track.name.en
    },

    title: campaignMission.title,

    month: {
      pt: `${month.month.pt} de ${month.year}`,
      en: `${month.month.en} ${month.year}`
    },

    objective: {
      pt: `Concluir a missão "${campaignMission.title.pt}" e registrar uma evidência simples do trabalho realizado.`,
      en: `Complete "${campaignMission.title.en}" and record simple evidence of the work completed.`
    },

    relevance: {
      pt: `Esta missão contribui para a trilha de ${track.name.pt.toLowerCase()} e ajuda a transformar o planejamento em prática observável.`,
      en: `This mission contributes to the ${track.name.en.toLowerCase()} track and helps turn the plan into observable practice.`
    },

    prerequisites: {
      pt: [
        "Verificar o tempo disponível na semana.",
        "Escolher uma fonte confiável ou um ambiente seguro de prática.",
        "Definir uma entrega mínima possível.",
        "Registrar dúvidas e descobertas."
      ],
      en: [
        "Check the time available during the week.",
        "Choose a reliable source or safe practice environment.",
        "Define a possible minimum deliverable.",
        "Record questions and discoveries."
      ]
    },

    steps: {
      pt: [
        `Ler o objetivo da missão de ${month.month.pt} de ${month.year}.`,
        "Dividir a atividade em partes pequenas.",
        "Executar a prática principal.",
        "Registrar o que foi aprendido.",
        "Guardar a evidência.",
        "Definir o próximo passo."
      ],
      en: [
        `Read the objective for ${month.month.en} ${month.year}.`,
        "Divide the activity into small parts.",
        "Complete the main practice.",
        "Record what was learned.",
        "Store the evidence.",
        "Define the next step."
      ]
    },

    time: isEnglish
      ? "30–50 min"
      : isResearch
        ? "30–60 min"
        : "45–90 min",

    cost: {
      pt: isResearch
        ? "Gratuito — confirmar fonte e disponibilidade"
        : "Preferencialmente gratuito",
      en: isResearch
        ? "Free — confirm source and availability"
        : "Preferably free"
    },

    evidence: {
      pt: [
        "Registro do que foi realizado.",
        "Explicação com suas próprias palavras.",
        "Dúvidas ou dificuldades encontradas.",
        "Link, arquivo, captura ou anotação, quando aplicável.",
        "Próximo passo definido."
      ],
      en: [
        "Record of what was completed.",
        "Explanation in your own words.",
        "Questions or difficulties found.",
        "Link, file, screenshot or note, when applicable.",
        "Next step defined."
      ]
    },

    success: {
      pt: "Conseguir explicar o que foi feito, qual competência foi praticada e qual evidência demonstra o trabalho.",
      en: "Explain what was done, which competency was practiced and what evidence demonstrates the work."
    },

    nextStep: {
      pt: "Revisar a evidência posteriormente e escolher uma pequena evolução.",
      en: "Review the evidence later and choose a small improvement."
    },

    difficultAlternative: {
      pt: "Dedicar 10–15 minutos ao tema, registrar uma descoberta e definir o menor próximo passo possível.",
      en: "Spend 10–15 minutes on the topic, record one discovery and define the smallest possible next step."
    },

    phase: campaignMission.phaseTitle,
    phaseYears: campaignMission.phaseYears,
    language
  };
}

function getNextPendingMission(data) {
  const missions = getAllCampaignMissions();

  return (
    missions.find(
      (mission) =>
        !data.completedMissions?.includes(mission.id)
    ) || missions[0]
  );
}

function getCurrentPhase(data, mission) {
  if (!mission) {
    return campaignPhases[0];
  }

  return (
    campaignPhases.find(
      (phase) => phase.id === mission.phaseId
    ) || campaignPhases[0]
  );
}

function getCurrentMonth(data, mission) {
  if (!mission) {
    return null;
  }

  return mission.monthData;
}

function getProgressSummary(data) {
  const allMissions = getAllCampaignMissions();
  const completedMissions = data.completedMissions || [];

  const completedCount = allMissions.filter((mission) =>
    completedMissions.includes(mission.id)
  ).length;

  const totalCount = allMissions.length;

  const percentage =
    totalCount === 0
      ? 0
      : Math.round(
          (completedCount / totalCount) * 100
        );

  return {
    completedCount,
    totalCount,
    percentage
  };
}

function getUpcomingMilestones(data, currentMission) {
  const allMonths = campaignPhases.flatMap((phase) =>
    phase.months.map((month) => ({
      ...month,
      phaseId: phase.id
    }))
  );

  const currentIndex = allMonths.findIndex(
    (month) =>
      month.year === currentMission?.monthData?.year &&
      month.monthIndex ===
        currentMission?.monthData?.monthIndex
  );

  const startIndex = currentIndex >= 0 ? currentIndex : 0;

  return allMonths
    .slice(startIndex, startIndex + 3)
    .map((month) => ({
      month,
      phase: campaignPhases.find(
        (phase) => phase.id === month.phaseId
      )
    }));
}

function DashboardContent({
  data,
  t,
  mission,
  completed,
  onComplete,
  onOpenMission,
  onToggleWeekMode,
  onReview,
  onOpenSettings,
  onOpenBackup
}) {
  const hours =
    data.mode === "normal"
      ? data.weeklyHours
      : data.difficultWeekHours;

  const nextCampaignMission =
    getNextPendingMission(data);

  const dashboardMission = createDashboardMission({
    campaignMission: nextCampaignMission,
    data
  });

  const currentPhase = getCurrentPhase(
    data,
    nextCampaignMission
  );

  const currentMonth = getCurrentMonth(
    data,
    nextCampaignMission
  );

  const progress = getProgressSummary(data);

  const upcomingMilestones =
    getUpcomingMilestones(
      data,
      nextCampaignMission
    );

  const activeTracks = data.tracks.filter(
    (track) => track.progress > 0
  ).length;

  const dashboardMissionCompleted =
    data.completedMissions?.includes(
      dashboardMission.id
    );

  function handleOpenDashboardMission() {
    onOpenMission(dashboardMission);
  }

  function handleCompleteDashboardMission() {
    onComplete(dashboardMission);
  }

  return (
    <>
      <section className="hero-grid">
        <article className="mission-card main-card">
          <div className="card-topline">
            <span className="status-dot" />

            <span>{t.currentMission}</span>

            <span className="mission-month">
              {currentMonth
                ? data.language === "pt"
                  ? `${currentMonth.month.pt.slice(
                      0,
                      3
                    ).toUpperCase()} / ${
                      currentMonth.year
                    }`
                  : `${currentMonth.month.en
                      .slice(0, 3)
                      .toUpperCase()} / ${
                      currentMonth.year
                    }`
                : "—"}
            </span>
          </div>

          <div className="mission-content">
            <div>
              <span className="tag">
                {
                  dashboardMission.track[
                    data.language
                  ]
                }
              </span>

              <h2>
                {
                  dashboardMission.title[
                    data.language
                  ]
                }
              </h2>

              <p>
                {
                  dashboardMission.objective[
                    data.language
                  ]
                }
              </p>

              <span className="mission-phase-label">
                {data.language === "pt"
                  ? `Fase ${currentPhase.id}: ${currentPhase.title.pt}`
                  : `Phase ${currentPhase.id}: ${currentPhase.title.en}`}
              </span>
            </div>

            <div className="mission-meta">
              <div>
                <small>{t.time}</small>

                <strong>
                  {dashboardMission.time}
                </strong>
              </div>

              <div>
                <small>{t.cost}</small>

                <strong>
                  {
                    dashboardMission.cost[
                      data.language
                    ]
                  }
                </strong>
              </div>
            </div>
          </div>

          <div className="mission-actions">
            <button
              className="primary-button"
              onClick={
                handleCompleteDashboardMission
              }
              type="button"
            >
              {dashboardMissionCompleted
                ? `✓ ${t.completed}`
                : t.complete}
            </button>

            <button
              className="secondary-button"
              onClick={handleOpenDashboardMission}
              type="button"
            >
              {t.details}
            </button>

            <button
              className="secondary-button"
              onClick={onOpenBackup}
              type="button"
            >
              💾{" "}
              {data.language === "pt"
                ? "Backup dos dados"
                : "Data backup"}
            </button>
          </div>

          {dashboardMissionCompleted && (
            <div className="success-message">
              ✓ {t.completed}
            </div>
          )}
        </article>

        <article className="next-action-card">
          <div className="card-icon">↗</div>

          <span className="eyebrow">
            {t.nextAction}
          </span>

          <h3>
            {data.language === "pt"
              ? "Trabalhe na menor próxima entrega"
              : "Work on the smallest next deliverable"}
          </h3>

          <p>
            {data.language === "pt"
              ? "Você não precisa concluir toda a carreira agora. Execute a missão atual, registre a evidência e revise o próximo passo."
              : "You do not need to complete your entire career now. Complete the current mission, record evidence and review the next step."}
          </p>

          <button
            className="link-button"
            onClick={handleOpenDashboardMission}
            type="button"
          >
            {t.details} →
          </button>
        </article>
      </section>

      <section className="stats-grid">
        <StatCard
          label={t.weeklyLoad}
          value={`${hours}h`}
          detail={
            data.mode === "normal"
              ? t.normalWeek
              : t.difficultWeek
          }
          action={
            <button
              className="mini-toggle"
              onClick={onToggleWeekMode}
              type="button"
            >
              {data.mode === "normal"
                ? t.difficultMode
                : t.normalMode}
            </button>
          }
        />

        <StatCard
          label={t.budget}
          value={`R$ ${data.monthlyBudget}`}
          detail={
            data.language === "pt"
              ? "Editável e privado"
              : "Editable and private"
          }
        />

        <StatCard
          label={t.currentPhase}
          value={String(currentPhase.id).padStart(
            2,
            "0"
          )}
          detail={
            data.language === "pt"
              ? `${currentPhase.title.pt} — ${currentPhase.years}`
              : `${currentPhase.title.en} — ${currentPhase.years}`
          }
        />

        <StatCard
          label={
            data.language === "pt"
              ? "Progresso geral"
              : "Overall progress"
          }
          value={`${progress.percentage}%`}
          detail={
            data.language === "pt"
              ? `${progress.completedCount} de ${progress.totalCount} missões`
              : `${progress.completedCount} of ${progress.totalCount} missions`
          }
        />

        <StatCard
          label={
            data.language === "pt"
              ? "Última revisão"
              : "Last review"
          }
          value={data.lastReview ? "✓" : "—"}
          detail={
            data.lastReview ||
            (data.language === "pt"
              ? "Ainda não realizada"
              : "Not completed yet")
          }
          action={
            <button
              className="mini-toggle"
              onClick={onReview}
              type="button"
            >
              {t.reviewNow}
            </button>
          }
        />

        <button
          className="secondary-button settings-button"
          onClick={onOpenSettings}
          type="button"
        >
          ⚙️{" "}
          {data.language === "pt"
            ? "Editar planejamento"
            : "Edit planning"}
        </button>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                {t.tracksProgress}
              </span>

              <h2>
                {data.language === "pt"
                  ? "Construindo competências"
                  : "Building competencies"}
              </h2>
            </div>

            <span className="panel-count">
              {activeTracks} / {data.tracks.length}
            </span>
          </div>

          <div className="track-list">
            {data.tracks.map((track) => (
              <div
                className="track-row"
                key={track.id}
              >
                <div className="track-label">
                  <span
                    className="track-dot"
                    style={{
                      background: track.color
                    }}
                  />

                  <span>
                    {track.name[data.language]}
                  </span>

                  <strong>{track.progress}%</strong>
                </div>

                <div
                  className="progress-bar"
                  aria-label={`${track.name[data.language]}: ${track.progress}%`}
                >
                  <span
                    style={{
                      width: `${track.progress}%`,
                      background: track.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                {t.milestones}
              </span>

              <h2>
                {data.language === "pt"
                  ? "Próximos meses"
                  : "Upcoming months"}
              </h2>
            </div>
          </div>

          <div className="milestone-list">
            {upcomingMilestones.map(
              ({ month, phase }) => (
                <Milestone
                  key={`${month.year}-${month.monthIndex}`}
                  month={
                    data.language === "pt"
                      ? `${month.month.pt.slice(
                          0,
                          3
                        ).toUpperCase()} / ${
                          month.year
                        }`
                      : `${month.month.en
                          .slice(0, 3)
                          .toUpperCase()} / ${
                          month.year
                        }`
                  }
                  text={
                    month.milestone[data.language]
                  }
                  phase={
                    data.language === "pt"
                      ? phase.title.pt
                      : phase.title.en
                  }
                />
              )
            )}
          </div>
        </article>
      </section>

      <section className="aspiration-banner">
        <div className="compass">◎</div>

        <div>
          <span className="eyebrow">
            {t.aspiration}
          </span>

          <p>{t.aspirationText}</p>
        </div>

        <span className="review-badge">
          {t.reviewable}
        </span>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  detail,
  action
}) {
  return (
    <article className="stat-card">
      <span className="eyebrow">{label}</span>

      <strong className="stat-value">
        {value}
      </strong>

      <span className="stat-detail">
        {detail}
      </span>

      {action}
    </article>
  );
}

function Milestone({ month, text, phase }) {
  return (
    <div className="milestone">
      <span className="milestone-month">
        {month}
      </span>

      <div>
        <strong>{phase}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default DashboardContent;