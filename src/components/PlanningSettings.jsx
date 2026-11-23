import { useState } from "react";

function PlanningSettings({
  data,
  t,
  onSave,
  onClose
}) {
  const [weeklyHours, setWeeklyHours] = useState(
    data.weeklyHours
  );

  const [difficultWeekHours, setDifficultWeekHours] =
    useState(data.difficultWeekHours);

  const [monthlyBudget, setMonthlyBudget] = useState(
    data.monthlyBudget
  );

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      weeklyHours: Number(weeklyHours),
      difficultWeekHours: Number(difficultWeekHours),
      monthlyBudget: Number(monthlyBudget)
    });
  }

  return (
    <div className="modal-backdrop">
      <section
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
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
          {data.language === "pt"
            ? "CONFIGURAÇÕES"
            : "SETTINGS"}
        </span>

        <h2 id="settings-title">
          {data.language === "pt"
            ? "Ajuste sua rota"
            : "Adjust your route"}
        </h2>

        <p>
          {data.language === "pt"
            ? "Esses valores são editáveis e servem apenas para orientar seu planejamento."
            : "These values are editable and only guide your planning."}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="weeklyHours">
            {data.language === "pt"
              ? "Horas em uma semana normal"
              : "Hours during a normal week"}
          </label>

          <input
            id="weeklyHours"
            type="number"
            min="1"
            max="80"
            value={weeklyHours}
            onChange={(event) =>
              setWeeklyHours(event.target.value)
            }
            required
          />

          <label htmlFor="difficultWeekHours">
            {data.language === "pt"
              ? "Horas em uma semana difícil"
              : "Hours during a difficult week"}
          </label>

          <input
            id="difficultWeekHours"
            type="number"
            min="1"
            max="80"
            value={difficultWeekHours}
            onChange={(event) =>
              setDifficultWeekHours(event.target.value)
            }
            required
          />

          <label htmlFor="monthlyBudget">
            {data.language === "pt"
              ? "Orçamento mensal — R$"
              : "Monthly budget — BRL"}
          </label>

          <input
            id="monthlyBudget"
            type="number"
            min="0"
            step="10"
            value={monthlyBudget}
            onChange={(event) =>
              setMonthlyBudget(event.target.value)
            }
            required
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
              type="submit"
            >
              {t.save}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PlanningSettings;