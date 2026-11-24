function DataBackup({
  data,
  t,
  onImport,
  onClose
}) {
  function exportData() {
    const backup = {
      app: "rota-canada",
      version: 1,
      exportedAt: new Date().toISOString(),
      data
    };

    const file = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `backup-rota-canada-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);

        const isValidData =
          backup.data &&
          typeof backup.data === "object" &&
          !Array.isArray(backup.data) &&
          (backup.data.language === "pt" ||
            backup.data.language === "en") &&
          (backup.data.theme === "dark" ||
            backup.data.theme === "light") &&
          Array.isArray(backup.data.tracks) &&
          Array.isArray(backup.data.completedMissions) &&
          backup.data.missionStatuses &&
          typeof backup.data.missionStatuses === "object" &&
          backup.data.evidences &&
          typeof backup.data.evidences === "object";

        if (
          backup.app !== "rota-canada" ||
          backup.version !== 1 ||
          !isValidData
        ) {
          throw new Error("invalid-backup");
        }

        const confirmed = window.confirm(
          data.language === "pt"
            ? "Importar este backup substituirá o planejamento atual. Deseja continuar?"
            : "Importing this backup will replace your current plan. Do you want to continue?"
        );

        if (confirmed) {
          onImport(backup.data);
  }
      } catch {
        window.alert(
          data.language === "pt"
            ? "Arquivo de backup inválido."
            : "Invalid backup file."
        );
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function getLastBackupLabel() {
    const backupDate = localStorage.getItem(
      "rota-canada-app-v3-backup-date"
    );

    if (!backupDate) {
      return data.language === "pt"
        ? "Nenhum backup automático registrado ainda."
        : "No automatic backup recorded yet.";
    }

    const date = new Date(backupDate);

    if (Number.isNaN(date.getTime())) {
      return data.language === "pt"
        ? "Data do backup indisponível."
        : "Backup date unavailable.";
    }

    const formattedDate = new Intl.DateTimeFormat(
      data.language === "pt" ? "pt-BR" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    ).format(date);

    return data.language === "pt"
      ? `Último backup automático: ${formattedDate}`
      : `Last automatic backup: ${formattedDate}`;
  }

  return (
    <div className="modal-backdrop">
      <section
        className="backup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-title"
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
            ? "DADOS LOCAIS"
            : "LOCAL DATA"}
        </span>

        <h2 id="backup-title">
          {data.language === "pt"
            ? "Backup do planejamento"
            : "Planning backup"}
        </h2>

        <p>
          {data.language === "pt"
            ? "Exporte seus dados para guardar uma cópia ou restaurá-los em outro navegador."
            : "Export your data to keep a copy or restore it in another browser."}
        </p>

        <div
          className="automatic-backup-status"
          role="status"
          aria-live="polite"
        >
          <strong>
            {data.language === "pt"
              ? "Backup automático"
              : "Automatic backup"}
          </strong>

          <span>{getLastBackupLabel()}</span>
        </div>

        <div className="backup-actions">
          <button
            className="primary-button"
            onClick={exportData}
            type="button"
          >
            {data.language === "pt"
              ? "Exportar backup"
              : "Export backup"}
          </button>

          <label className="secondary-button file-button">
            {data.language === "pt"
              ? "Importar backup"
              : "Import backup"}

            <input
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        <small className="backup-warning">
          {data.language === "pt"
            ? "O arquivo pode conter informações pessoais do seu planejamento. Guarde-o em local seguro."
            : "The file may contain personal planning information. Keep it in a secure place."}
        </small>
      </section>
    </div>
  );
}

export default DataBackup;