function DashboardContent({
  data,
  t,
  mission,
  completed,
  onComplete,
  onOpenMission,
  onToggleWeekMode,
  onReview,
  onOpenSettings
}) {
  const hours =
    data.mode === "normal"
      ? data.weeklyHours
      : data.difficultWeekHours;

  const activeTracks = data.tracks.filter(
    (track) => track.progress > 0
  ).length;

  return (
    <>
      <section className="hero-grid">
        <article className="mission-card main-card">
          <div className="card-topline">
            <span className="status-dot" />

            <span>{t.currentMission}</span>

            <span className="mission-month">
              {data.language === "pt"
                ? "JAN / 2027"
                : "JAN / 2027"}
            </span>
          </div>

          <div className="mission-content">
            <div>
              <span className="tag">
                {mission.track[data.language]}
              </span>

              <h2>{mission.title[data.language]}</h2>

              <p>{mission.objective[data.language]}</p>
            </div>

            <div className="mission-meta">
              <div>
                <small>{t.time}</small>
                <strong>{mission.time}</strong>
              </div>

              <div>
                <small>{t.cost}</small>
                <strong>{mission.cost[data.language]}</strong>
              </div>
            </div>
          </div>

          <div className="mission-actions">
            <button
              className="primary-button"
              onClick={onComplete}
              type="button"
            >
              {completed ? `✓ ${t.completed}` : t.complete}
            </button>

            <button
              className="secondary-button"
              onClick={onOpenMission}
              type="button"
            >
              {t.details}
            </button>
          </div>

          {completed && (
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
              ? "Crie seu primeiro baralho técnico"
              : "Create your first technical deck"}
          </h3>

          <p>
            {data.language === "pt"
              ? "Crie um baralho no Anki e adicione cinco termos técnicos em inglês."
              : "Create an Anki deck and add five technical English terms."}
          </p>

          <button
            className="link-button"
            type="button"
          >
            {t.registerEvidence} →
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
          value="01"
          detail={
            data.language === "pt"
              ? "Fundação — 2027 a 2028"
              : "Foundation — 2027 to 2028"
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
              <div className="track-row" key={track.id}>
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
                  ? "Próximos três meses"
                  : "Next three months"}
              </h2>
            </div>
          </div>

          <div className="milestone-list">
            <Milestone
              month="JAN"
              text={
                data.language === "pt"
                  ? "Iniciar diagnóstico de inglês e tecnólogo"
                  : "Start English assessment and degree"
              }
            />

            <Milestone
              month="FEV"
              text={
                data.language === "pt"
                  ? "Organizar vocabulário técnico e GitHub"
                  : "Organize technical vocabulary and GitHub"
              }
            />

            <Milestone
              month="MAR"
              text={
                data.language === "pt"
                  ? "Documentar o primeiro pequeno projeto"
                  : "Document the first small project"
              }
            />
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

function Milestone({ month, text }) {
  return (
    <div className="milestone">
      <span className="milestone-month">
        {month}
      </span>

      <span>{text}</span>
    </div>
  );
}

export default DashboardContent;