import { useState } from "react";

function EvidenceModal({
  mission,
  data,
  t,
  initialEvidence,
  onClose,
  onSave
}) {
  const language = data.language;

  const [whatDone, setWhatDone] = useState(
    initialEvidence?.whatDone || ""
  );

  const [whatLearned, setWhatLearned] = useState(
    initialEvidence?.whatLearned || ""
  );

  const [difficulties, setDifficulties] = useState(
    initialEvidence?.difficulties || ""
  );

  const [nextStep, setNextStep] = useState(
    initialEvidence?.nextStep || ""
  );

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      whatDone: whatDone.trim(),
      whatLearned: whatLearned.trim(),
      difficulties: difficulties.trim(),
      nextStep: nextStep.trim(),
      updatedAt: new Date().toISOString()
    });
  }

  return (
    <div className="modal-backdrop">
      <section
        className="evidence-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-title"
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
          {language === "pt"
            ? "REGISTRO DE PROGRESSO"
            : "PROGRESS RECORD"}
        </span>

        <h2 id="evidence-title">
          {language === "pt"
            ? "Registrar evidência"
            : "Record evidence"}
        </h2>

        <p className="evidence-mission-title">
          {mission.title[language]}
        </p>

        <form
          className="evidence-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="whatDone">
            {language === "pt"
              ? "O que fiz?"
              : "What did I do?"}
          </label>

          <textarea
            id="whatDone"
            value={whatDone}
            onChange={(event) =>
              setWhatDone(event.target.value)
            }
            placeholder={
              language === "pt"
                ? "Descreva brevemente a atividade realizada."
                : "Briefly describe the activity completed."
            }
            rows="4"
          />

          <label htmlFor="whatLearned">
            {language === "pt"
              ? "O que aprendi?"
              : "What did I learn?"}
          </label>

          <textarea
            id="whatLearned"
            value={whatLearned}
            onChange={(event) =>
              setWhatLearned(event.target.value)
            }
            placeholder={
              language === "pt"
                ? "Registre conceitos, descobertas ou relações que entendeu."
                : "Record concepts, discoveries or connections you understood."
            }
            rows="4"
          />

          <label htmlFor="difficulties">
            {language === "pt"
              ? "Quais dificuldades encontrei?"
              : "What difficulties did I find?"}
          </label>

          <textarea
            id="difficulties"
            value={difficulties}
            onChange={(event) =>
              setDifficulties(event.target.value)
            }
            placeholder={
              language === "pt"
                ? "Registrar dificuldades ajuda a decidir o próximo estudo."
                : "Recording difficulties helps decide what to study next."
            }
            rows="4"
          />

          <label htmlFor="nextStep">
            {language === "pt"
              ? "Qual é o próximo passo?"
              : "What is the next step?"}
          </label>

          <textarea
            id="nextStep"
            value={nextStep}
            onChange={(event) =>
              setNextStep(event.target.value)
            }
            placeholder={
              language === "pt"
                ? "Defina uma próxima ação pequena e concreta."
                : "Define a small and concrete next action."
            }
            rows="4"
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

export default EvidenceModal;