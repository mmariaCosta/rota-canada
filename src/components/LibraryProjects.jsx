import { useEffect, useMemo, useState } from "react";

const LIBRARY_STORAGE_KEY = "rota-canada-library-v1";
const PROJECTS_STORAGE_KEY = "rota-canada-projects-v1";

const libraryInitialForm = {
  title: "",
  type: "Curso",
  provider: "",
  category: "Segurança Cibernética",
  description: "",
  url: "",
  language: "Português",
  level: "Iniciante",
  priority: "Média",
  status: "Planejado",
  estimatedHours: "",
  cost: "",
  tags: "",
  relatedTracks: "",
  notes: "",
};

const projectInitialForm = {
  title: "",
  description: "",
  objective: "",
  track: "Segurança Cibernética",
  secondaryTracks: "",
  level: "Iniciante",
  status: "Ideia",
  priority: "Média",
  startDate: "",
  targetDate: "",
  estimatedHours: "",
  budget: "",
  technologies: "",
  repositoryUrl: "",
  demoUrl: "",
  documentationUrl: "",
  problem: "",
  deliverables: "",
  stages: "",
  notes: "",
};

const libraryTypes = [
  "Curso",
  "Livro",
  "Artigo",
  "Documentação",
  "Laboratório",
  "Vídeo",
  "Podcast",
  "Simulado",
  "Ferramenta",
  "Repositório",
  "Certificação",
];

const projectTracks = [
  "Segurança Cibernética",
  "Cloud e AWS",
  "Arquitetura de Software",
  "Integrações e APIs",
  "Programação",
  "Banco de Dados",
  "Redes",
  "Inglês",
  "Francês",
  "Carreira",
  "Portfólio",
];

const levels = ["Iniciante", "Intermediário", "Avançado"];

const priorities = ["Baixa", "Média", "Alta", "Estratégica"];

const libraryStatuses = [
  "Não iniciado",
  "Planejado",
  "Em andamento",
  "Pausado",
  "Concluído",
  "Para revisar",
  "Abandonado",
];

const projectStatuses = [
  "Ideia",
  "Planejado",
  "Em andamento",
  "Pausado",
  "Concluído",
  "Arquivado",
];

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function splitLines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitCommaSeparated(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join("\n");
}

function joinCommaSeparated(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.join(", ");
}

function formatCurrency(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "R$ 0,00";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) {
    return "Sem data";
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

function getStatusClass(status) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function EmptyState({ children }) {
  return (
    <div className="rp-empty-state">
      <span className="rp-empty-icon">✦</span>
      <p>{children}</p>
    </div>
  );
}

function Field({ label, required = false, children, hint }) {
  return (
    <label className="rp-field">
      <span>
        {label}
        {required ? <b className="rp-required"> *</b> : null}
      </span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function LibraryForm({ editingItem, onSave, onCancel }) {
  const [form, setForm] = useState(libraryInitialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editingItem) {
      setForm(libraryInitialForm);
      return;
    }

    setForm({
      ...libraryInitialForm,
      ...editingItem,
      tags: joinCommaSeparated(editingItem.tags),
      relatedTracks: joinCommaSeparated(editingItem.relatedTracks),
    });
  }, [editingItem]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Informe o título do recurso.");
      return;
    }

    if (!form.description.trim()) {
      setError("Informe uma descrição para o recurso.");
      return;
    }

    const item = {
      id: editingItem?.id || createId("library"),
      title: form.title.trim(),
      type: form.type,
      provider: form.provider.trim(),
      category: form.category,
      description: form.description.trim(),
      url: form.url.trim(),
      language: form.language.trim(),
      level: form.level,
      priority: form.priority,
      status: form.status,
      estimatedHours: Number(form.estimatedHours) || 0,
      cost: Number(form.cost) || 0,
      tags: splitCommaSeparated(form.tags),
      relatedTracks: splitCommaSeparated(form.relatedTracks),
      notes: form.notes.trim(),
      createdAt: editingItem?.createdAt || getToday(),
      updatedAt: getToday(),
    };

    onSave(item);
    setError("");
  }

  return (
    <form className="rp-form" onSubmit={handleSubmit}>
      <div className="rp-form-heading">
        <div>
          <span className="rp-eyebrow">Biblioteca</span>
          <h3>{editingItem ? "Editar recurso" : "Adicionar recurso"}</h3>
        </div>

        <button
          type="button"
          className="rp-close-button"
          onClick={onCancel}
          aria-label="Fechar formulário"
        >
          ×
        </button>
      </div>

      {error ? <div className="rp-form-error">{error}</div> : null}

      <div className="rp-form-grid">
        <Field label="Título" required>
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="Ex.: AWS Well-Architected Framework"
            required
          />
        </Field>

        <Field label="Tipo">
          <select name="type" value={form.type} onChange={updateField}>
            {libraryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Fornecedor ou autor">
          <input
            name="provider"
            value={form.provider}
            onChange={updateField}
            placeholder="Ex.: AWS, Microsoft, Coursera"
          />
        </Field>

        <Field label="Categoria">
          <select name="category" value={form.category} onChange={updateField}>
            {projectTracks.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nível">
          <select name="level" value={form.level} onChange={updateField}>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Idioma">
          <input
            name="language"
            value={form.language}
            onChange={updateField}
            placeholder="Ex.: Português"
          />
        </Field>

        <Field label="Prioridade">
          <select name="priority" value={form.priority} onChange={updateField}>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select name="status" value={form.status} onChange={updateField}>
            {libraryStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Horas estimadas">
          <input
            name="estimatedHours"
            type="number"
            min="0"
            step="0.5"
            value={form.estimatedHours}
            onChange={updateField}
            placeholder="Ex.: 20"
          />
        </Field>

        <Field label="Custo">
          <input
            name="cost"
            type="number"
            min="0"
            step="0.01"
            value={form.cost}
            onChange={updateField}
            placeholder="Ex.: 49.90"
          />
        </Field>

        <Field label="Link">
          <input
            name="url"
            type="url"
            value={form.url}
            onChange={updateField}
            placeholder="https://..."
          />
        </Field>

        <Field label="Tags" hint="Separe as tags por vírgula.">
          <input
            name="tags"
            value={form.tags}
            onChange={updateField}
            placeholder="AWS, cloud, arquitetura"
          />
        </Field>
      </div>

      <Field label="Descrição" required>
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Explique o que é este recurso e por que ele é importante."
          required
        />
      </Field>

      <Field label="Trilhas relacionadas" hint="Separe por vírgulas.">
        <input
          name="relatedTracks"
          value={form.relatedTracks}
          onChange={updateField}
          placeholder="Cloud e AWS, Arquitetura de Software"
        />
      </Field>

      <Field label="Observações">
        <textarea
          name="notes"
          value={form.notes}
          onChange={updateField}
          placeholder="Registre observações, próximos passos ou anotações."
        />
      </Field>

      <div className="rp-form-actions">
        <button type="button" className="rp-secondary-button" onClick={onCancel}>
          Cancelar
        </button>

        <button type="submit" className="rp-primary-button">
          {editingItem ? "Salvar alterações" : "Adicionar à biblioteca"}
        </button>
      </div>
    </form>
  );
}

function ProjectForm({ editingItem, onSave, onCancel }) {
  const [form, setForm] = useState(projectInitialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editingItem) {
      setForm(projectInitialForm);
      return;
    }

    setForm({
      ...projectInitialForm,
      ...editingItem,
      secondaryTracks: joinCommaSeparated(editingItem.secondaryTracks),
      technologies: joinCommaSeparated(editingItem.technologies),
      deliverables: joinLines(editingItem.deliverables),
      stages: joinLines(
        Array.isArray(editingItem.stages)
          ? editingItem.stages.map((stage) => stage.title)
          : []
      ),
    });
  }, [editingItem]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Informe o nome do projeto.");
      return;
    }

    if (!form.description.trim()) {
      setError("Informe uma descrição para o projeto.");
      return;
    }

    if (!form.objective.trim()) {
      setError("Informe o objetivo do projeto.");
      return;
    }

    const stageTitles = splitLines(form.stages);

    const stages = stageTitles.map((title, index) => {
      const oldStage = editingItem?.stages?.[index];

      return {
        id: oldStage?.id || createId("stage"),
        title,
        status: oldStage?.status || "Pendente",
        estimatedHours: oldStage?.estimatedHours || 0,
        completedAt: oldStage?.completedAt || null,
      };
    });

    const project = {
      id: editingItem?.id || createId("project"),
      title: form.title.trim(),
      description: form.description.trim(),
      objective: form.objective.trim(),
      track: form.track,
      secondaryTracks: splitCommaSeparated(form.secondaryTracks),
      level: form.level,
      status: form.status,
      priority: form.priority,
      startDate: form.startDate,
      targetDate: form.targetDate,
      estimatedHours: Number(form.estimatedHours) || 0,
      budget: Number(form.budget) || 0,
      technologies: splitCommaSeparated(form.technologies),
      repositoryUrl: form.repositoryUrl.trim(),
      demoUrl: form.demoUrl.trim(),
      documentationUrl: form.documentationUrl.trim(),
      problem: form.problem.trim(),
      deliverables: splitLines(form.deliverables),
      stages,
      evidence: editingItem?.evidence || [],
      notes: form.notes.trim(),
      createdAt: editingItem?.createdAt || getToday(),
      updatedAt: getToday(),
    };

    onSave(project);
    setError("");
  }

  return (
    <form className="rp-form" onSubmit={handleSubmit}>
      <div className="rp-form-heading">
        <div>
          <span className="rp-eyebrow">Projetos</span>
          <h3>{editingItem ? "Editar projeto" : "Adicionar projeto"}</h3>
        </div>

        <button
          type="button"
          className="rp-close-button"
          onClick={onCancel}
          aria-label="Fechar formulário"
        >
          ×
        </button>
      </div>

      {error ? <div className="rp-form-error">{error}</div> : null}

      <div className="rp-form-grid">
        <Field label="Nome do projeto" required>
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="Ex.: API de monitoramento de segurança"
            required
          />
        </Field>

        <Field label="Trilha principal">
          <select name="track" value={form.track} onChange={updateField}>
            {projectTracks.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nível">
          <select name="level" value={form.level} onChange={updateField}>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select name="status" value={form.status} onChange={updateField}>
            {projectStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Prioridade">
          <select name="priority" value={form.priority} onChange={updateField}>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Horas estimadas">
          <input
            name="estimatedHours"
            type="number"
            min="0"
            step="0.5"
            value={form.estimatedHours}
            onChange={updateField}
            placeholder="Ex.: 45"
          />
        </Field>

        <Field label="Orçamento estimado">
          <input
            name="budget"
            type="number"
            min="0"
            step="0.01"
            value={form.budget}
            onChange={updateField}
            placeholder="Ex.: 100"
          />
        </Field>

        <Field label="Data inicial">
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={updateField}
          />
        </Field>

        <Field label="Data-alvo">
          <input
            name="targetDate"
            type="date"
            value={form.targetDate}
            onChange={updateField}
          />
        </Field>

        <Field label="Tecnologias" hint="Separe por vírgulas.">
          <input
            name="technologies"
            value={form.technologies}
            onChange={updateField}
            placeholder="React, Node.js, SQL Server"
          />
        </Field>

        <Field label="Trilhas secundárias" hint="Separe por vírgulas.">
          <input
            name="secondaryTracks"
            value={form.secondaryTracks}
            onChange={updateField}
            placeholder="APIs, Banco de Dados"
          />
        </Field>
      </div>

      <Field label="Descrição" required>
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Descreva o que será construído."
          required
        />
      </Field>

      <Field label="Objetivo de aprendizagem" required>
        <textarea
          name="objective"
          value={form.objective}
          onChange={updateField}
          placeholder="Explique quais competências serão desenvolvidas."
          required
        />
      </Field>

      <Field label="Problema que o projeto resolve">
        <textarea
          name="problem"
          value={form.problem}
          onChange={updateField}
          placeholder="Qual problema prático este projeto pretende resolver?"
        />
      </Field>

      <Field
        label="Entregáveis"
        hint="Informe um entregável por linha."
      >
        <textarea
          name="deliverables"
          value={form.deliverables}
          onChange={updateField}
          placeholder={`Repositório organizado
README completo
Diagrama da arquitetura
Aplicação funcionando`}
        />
      </Field>

      <Field
        label="Etapas do projeto"
        hint="Informe uma etapa por linha."
      >
        <textarea
          name="stages"
          value={form.stages}
          onChange={updateField}
          placeholder={`Definir requisitos
Modelar banco de dados
Criar API
Criar interface
Testar aplicação
Documentar projeto`}
        />
      </Field>

      <div className="rp-form-grid">
        <Field label="Repositório">
          <input
            name="repositoryUrl"
            type="url"
            value={form.repositoryUrl}
            onChange={updateField}
            placeholder="https://github.com/..."
          />
        </Field>

        <Field label="Demonstração">
          <input
            name="demoUrl"
            type="url"
            value={form.demoUrl}
            onChange={updateField}
            placeholder="https://..."
          />
        </Field>

        <Field label="Documentação">
          <input
            name="documentationUrl"
            type="url"
            value={form.documentationUrl}
            onChange={updateField}
            placeholder="https://..."
          />
        </Field>
      </div>

      <Field label="Observações">
        <textarea
          name="notes"
          value={form.notes}
          onChange={updateField}
          placeholder="Registre decisões, dificuldades e próximos passos."
        />
      </Field>

      <div className="rp-form-actions">
        <button type="button" className="rp-secondary-button" onClick={onCancel}>
          Cancelar
        </button>

        <button type="submit" className="rp-primary-button">
          {editingItem ? "Salvar alterações" : "Adicionar projeto"}
        </button>
      </div>
    </form>
  );
}

function LibraryCard({ item, onEdit, onDelete }) {
  return (
    <article className="rp-item-card">
      <div className="rp-item-card-top">
        <span className="rp-item-type">{item.type}</span>
        <span className={`rp-status ${getStatusClass(item.status)}`}>
          {item.status}
        </span>
      </div>

      <h3>{item.title}</h3>

      {item.provider ? (
        <p className="rp-item-provider">{item.provider}</p>
      ) : null}

      <p className="rp-item-description">{item.description}</p>

      <div className="rp-item-details">
        <span>Trilha: {item.category}</span>
        <span>Nível: {item.level}</span>
        <span>Tempo: {item.estimatedHours}h</span>
        <span>Custo: {formatCurrency(item.cost)}</span>
      </div>

      {item.tags?.length > 0 ? (
        <div className="rp-tags">
          {item.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}

      <div className="rp-card-actions">
        {item.url ? (
          <a
            className="rp-link-button"
            href={item.url}
            target="_blank"
            rel="noreferrer"
          >
            Abrir recurso
          </a>
        ) : null}

        <button
          type="button"
          className="rp-ghost-button"
          onClick={() => onEdit(item)}
        >
          Editar
        </button>

        <button
          type="button"
          className="rp-danger-button"
          onClick={() => onDelete(item.id)}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

function ProjectCard({ item, onEdit, onDelete, onToggleStage }) {
  const completedStages =
    item.stages?.filter((stage) => stage.status === "Concluída").length || 0;

  const totalStages = item.stages?.length || 0;

  const progress =
    totalStages > 0
      ? Math.round((completedStages / totalStages) * 100)
      : item.status === "Concluído"
        ? 100
        : 0;

  return (
    <article className="rp-item-card rp-project-card">
      <div className="rp-item-card-top">
        <span className="rp-item-type">{item.track}</span>
        <span className={`rp-status ${getStatusClass(item.status)}`}>
          {item.status}
        </span>
      </div>

      <h3>{item.title}</h3>

      <p className="rp-item-description">{item.description}</p>

      <div className="rp-project-summary">
        <div>
          <small>Progresso</small>
          <strong>{progress}%</strong>
        </div>

        <div>
          <small>Horas</small>
          <strong>{item.estimatedHours}h</strong>
        </div>

        <div>
          <small>Orçamento</small>
          <strong>{formatCurrency(item.budget)}</strong>
        </div>
      </div>

      <div className="rp-progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="rp-project-dates">
        <span>Início: {formatDate(item.startDate)}</span>
        <span>Data-alvo: {formatDate(item.targetDate)}</span>
      </div>

      {item.technologies?.length > 0 ? (
        <div className="rp-tags">
          {item.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      ) : null}

      {item.stages?.length > 0 ? (
        <div className="rp-stages">
          <strong>Etapas</strong>

          {item.stages.map((stage) => (
            <label className="rp-stage" key={stage.id}>
              <input
                type="checkbox"
                checked={stage.status === "Concluída"}
                onChange={() => onToggleStage(item.id, stage.id)}
              />

              <span className={stage.status === "Concluída" ? "done" : ""}>
                {stage.title}
              </span>
            </label>
          ))}
        </div>
      ) : null}

      <div className="rp-card-actions">
        {item.repositoryUrl ? (
          <a
            className="rp-link-button"
            href={item.repositoryUrl}
            target="_blank"
            rel="noreferrer"
          >
            Repositório
          </a>
        ) : null}

        {item.demoUrl ? (
          <a
            className="rp-link-button"
            href={item.demoUrl}
            target="_blank"
            rel="noreferrer"
          >
            Demonstração
          </a>
        ) : null}

        <button
          type="button"
          className="rp-ghost-button"
          onClick={() => onEdit(item)}
        >
          Editar
        </button>

        <button
          type="button"
          className="rp-danger-button"
          onClick={() => onDelete(item.id)}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

const suggestedLibraryItems = [
  {
    id: "suggested-mdn",
    title: "MDN Web Docs",
    type: "Documentação",
    provider: "Mozilla",
    category: "Programação",
    description:
      "Documentação de referência para HTML, CSS, JavaScript e desenvolvimento web.",
    url: "https://developer.mozilla.org/",
    language: "Inglês",
    level: "Iniciante",
    priority: "Alta",
    status: "Planejado",
    estimatedHours: 20,
    cost: 0,
    tags: ["HTML", "CSS", "JavaScript", "Web"],
    relatedTracks: ["Programação", "Arquitetura de Software"],
    notes: "Usar como referência durante a construção dos projetos.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  },
  {
    id: "suggested-react",
    title: "React Documentation",
    type: "Documentação",
    provider: "React",
    category: "Programação",
    description:
      "Documentação oficial para componentes, estado, propriedades, efeitos e boas práticas em React.",
    url: "https://react.dev/",
    language: "Inglês",
    level: "Intermediário",
    priority: "Alta",
    status: "Planejado",
    estimatedHours: 18,
    cost: 0,
    tags: ["React", "Frontend", "JavaScript"],
    relatedTracks: ["Programação", "Arquitetura de Software"],
    notes: "Relacionar os estudos à evolução do painel da Rota para o Canadá.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  },
  {
    id: "suggested-aws",
    title: "AWS Skill Builder",
    type: "Curso",
    provider: "Amazon Web Services",
    category: "Cloud e AWS",
    description:
      "Cursos oficiais para aprender fundamentos de cloud, serviços AWS, segurança e arquitetura.",
    url: "https://skillbuilder.aws/",
    language: "Inglês",
    level: "Iniciante",
    priority: "Alta",
    status: "Planejado",
    estimatedHours: 30,
    cost: 0,
    tags: ["AWS", "Cloud", "Certificação"],
    relatedTracks: ["Cloud e AWS", "Arquitetura de Software"],
    notes: "Explorar antes de decidir sobre a certificação Cloud Practitioner.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  },
  {
    id: "suggested-owasp",
    title: "OWASP Top 10",
    type: "Documentação",
    provider: "OWASP",
    category: "Segurança Cibernética",
    description:
      "Referência para compreender os principais riscos de segurança em aplicações web.",
    url: "https://owasp.org/www-project-top-ten/",
    language: "Inglês",
    level: "Iniciante",
    priority: "Alta",
    status: "Planejado",
    estimatedHours: 12,
    cost: 0,
    tags: ["OWASP", "Segurança Web", "Vulnerabilidades"],
    relatedTracks: ["Segurança Cibernética", "Programação"],
    notes: "Usar como base para o projeto de aplicação segura.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  },
  {
    id: "suggested-portswigger",
    title: "PortSwigger Web Security Academy",
    type: "Laboratório",
    provider: "PortSwigger",
    category: "Segurança Cibernética",
    description:
      "Laboratórios práticos para estudar segurança de aplicações web em ambiente educacional.",
    url: "https://portswigger.net/web-security",
    language: "Inglês",
    level: "Intermediário",
    priority: "Alta",
    status: "Planejado",
    estimatedHours: 25,
    cost: 0,
    tags: ["Web Security", "Laboratório", "OWASP"],
    relatedTracks: ["Segurança Cibernética", "Programação"],
    notes: "Praticar somente nos laboratórios autorizados da plataforma.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  },
  {
    id: "suggested-bbc",
    title: "BBC Learning English",
    type: "Curso",
    provider: "BBC",
    category: "Inglês",
    description:
      "Conteúdos gratuitos para desenvolver vocabulário, compreensão auditiva, gramática e pronúncia.",
    url: "https://www.bbc.co.uk/learningenglish",
    language: "Inglês",
    level: "Iniciante",
    priority: "Alta",
    status: "Planejado",
    estimatedHours: 20,
    cost: 0,
    tags: ["Inglês", "Listening", "Vocabulário"],
    relatedTracks: ["Inglês"],
    notes: "Priorizar constância e sessões curtas durante a semana.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  }
];

const suggestedProjects = [
  {
    id: "suggested-route-dashboard",
    title: "Evolução do painel da Rota para o Canadá",
    description:
      "Transformar o painel pessoal em uma aplicação organizada para acompanhar estudos, projetos, biblioteca e progresso.",
    objective:
      "Praticar React, componentes, estado, persistência local, UX e documentação.",
    track: "Programação",
    secondaryTracks: [
      "Arquitetura de Software",
      "Portfólio"
    ],
    level: "Intermediário",
    status: "Em andamento",
    priority: "Alta",
    startDate: "2026-11-24",
    targetDate: "2027-03-31",
    estimatedHours: 45,
    budget: 0,
    technologies: [
      "React",
      "Vite",
      "JavaScript",
      "CSS",
      "localStorage"
    ],
    repositoryUrl: "",
    demoUrl: "",
    documentationUrl: "",
    problem:
      "Centralizar o planejamento de formação, carreira, estudos e projetos em uma única aplicação.",
    deliverables: [
      "Painel funcional",
      "Biblioteca com cadastro",
      "Projetos com etapas",
      "Exportação e importação de dados",
      "README documentado"
    ],
    stages: [
      {
        id: "route-dashboard-structure",
        title: "Organizar a estrutura de dados",
        status: "Pendente",
        estimatedHours: 6,
        completedAt: null
      },
      {
        id: "route-dashboard-library",
        title: "Implementar cadastro da biblioteca",
        status: "Pendente",
        estimatedHours: 10,
        completedAt: null
      },
      {
        id: "route-dashboard-projects",
        title: "Implementar cadastro de projetos",
        status: "Pendente",
        estimatedHours: 10,
        completedAt: null
      },
      {
        id: "route-dashboard-backup",
        title: "Integrar backup dos dados",
        status: "Pendente",
        estimatedHours: 8,
        completedAt: null
      },
      {
        id: "route-dashboard-readme",
        title: "Documentar o projeto",
        status: "Pendente",
        estimatedHours: 6,
        completedAt: null
      }
    ],
    evidence: [],
    notes: "Projeto principal para consolidar os aprendizados.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  },
  {
    id: "suggested-security-api",
    title: "API de biblioteca pessoal",
    description:
      "Criar uma API para cadastrar cursos, livros, documentações e materiais de estudo.",
    objective:
      "Praticar backend, APIs REST, banco de dados, validação e documentação.",
    track: "Integrações e APIs",
    secondaryTracks: [
      "Banco de Dados",
      "Programação",
      "Segurança Cibernética"
    ],
    level: "Intermediário",
    status: "Ideia",
    priority: "Alta",
    startDate: "",
    targetDate: "",
    estimatedHours: 50,
    budget: 0,
    technologies: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Swagger"
    ],
    repositoryUrl: "",
    demoUrl: "",
    documentationUrl: "",
    problem:
      "Organizar recursos de aprendizagem de forma estruturada e consultável.",
    deliverables: [
      "API REST",
      "Modelo de banco de dados",
      "Validação dos dados",
      "Documentação Swagger",
      "Testes básicos"
    ],
    stages: [
      {
        id: "library-api-requirements",
        title: "Definir requisitos da API",
        status: "Pendente",
        estimatedHours: 5,
        completedAt: null
      },
      {
        id: "library-api-database",
        title: "Modelar o banco de dados",
        status: "Pendente",
        estimatedHours: 8,
        completedAt: null
      },
      {
        id: "library-api-endpoints",
        title: "Criar os endpoints",
        status: "Pendente",
        estimatedHours: 18,
        completedAt: null
      },
      {
        id: "library-api-validation",
        title: "Adicionar validação e tratamento de erros",
        status: "Pendente",
        estimatedHours: 8,
        completedAt: null
      },
      {
        id: "library-api-documentation",
        title: "Documentar e testar a API",
        status: "Pendente",
        estimatedHours: 11,
        completedAt: null
      }
    ],
    evidence: [],
    notes: "Projeto para a etapa posterior de backend.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  },
  {
    id: "suggested-secure-login",
    title: "Aplicação segura de login",
    description:
      "Criar uma aplicação de autenticação com cadastro, login, sessão, perfis e registro de eventos.",
    objective:
      "Estudar autenticação, autorização, hash de senhas, validação e proteção de dados.",
    track: "Segurança Cibernética",
    secondaryTracks: [
      "Programação",
      "Integrações e APIs"
    ],
    level: "Intermediário",
    status: "Ideia",
    priority: "Estratégica",
    startDate: "",
    targetDate: "",
    estimatedHours: 60,
    budget: 0,
    technologies: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "JWT"
    ],
    repositoryUrl: "",
    demoUrl: "",
    documentationUrl: "",
    problem:
      "Demonstrar, em um ambiente próprio e controlado, conceitos fundamentais de segurança de aplicações.",
    deliverables: [
      "Cadastro de usuário",
      "Login e logout",
      "Controle de sessão",
      "Perfis de acesso",
      "Logs de autenticação",
      "Documentação de segurança"
    ],
    stages: [
      {
        id: "secure-login-model",
        title: "Definir modelo de ameaças",
        status: "Pendente",
        estimatedHours: 8,
        completedAt: null
      },
      {
        id: "secure-login-backend",
        title: "Criar autenticação no backend",
        status: "Pendente",
        estimatedHours: 18,
        completedAt: null
      },
      {
        id: "secure-login-frontend",
        title: "Criar telas de acesso",
        status: "Pendente",
        estimatedHours: 12,
        completedAt: null
      },
      {
        id: "secure-login-controls",
        title: "Adicionar autorização e validações",
        status: "Pendente",
        estimatedHours: 12,
        completedAt: null
      },
      {
        id: "secure-login-documentation",
        title: "Documentar os controles de segurança",
        status: "Pendente",
        estimatedHours: 10,
        completedAt: null
      }
    ],
    evidence: [],
    notes: "Utilizar somente dados fictícios durante o desenvolvimento.",
    createdAt: "2026-11-24",
    updatedAt: "2026-11-24"
  }
];

export default function LibraryProjects() {
  const [activeTab, setActiveTab] = useState("library");
  const [libraryItems, setLibraryItems] = useState([]);
  const [projects, setProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingLibraryItem, setEditingLibraryItem] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

    useEffect(() => {
    const savedLibrary = loadFromStorage(
        LIBRARY_STORAGE_KEY,
        []
    );

    const savedProjects = loadFromStorage(
        PROJECTS_STORAGE_KEY,
        []
    );

    setLibraryItems(
        savedLibrary.length > 0
        ? savedLibrary
        : suggestedLibraryItems
    );

    setProjects(
        savedProjects.length > 0
        ? savedProjects
        : suggestedProjects
    );
    }, []);

  useEffect(() => {
    saveToStorage(LIBRARY_STORAGE_KEY, libraryItems);
  }, [libraryItems]);

  useEffect(() => {
    saveToStorage(PROJECTS_STORAGE_KEY, projects);
  }, [projects]);

  const filteredLibraryItems = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return libraryItems.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          item.title,
          item.provider,
          item.description,
          item.category,
          ...(item.tags || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [libraryItems, search, statusFilter]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return projects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          project.title,
          project.description,
          project.objective,
          project.track,
          ...(project.technologies || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  function openNewForm() {
    setEditingLibraryItem(null);
    setEditingProject(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingLibraryItem(null);
    setEditingProject(null);
  }

  function saveLibraryItem(item) {
    setLibraryItems((current) => {
      const exists = current.some((existing) => existing.id === item.id);

      if (exists) {
        return current.map((existing) =>
          existing.id === item.id ? item : existing
        );
      }

      return [item, ...current];
    });

    closeForm();
  }

  function saveProject(project) {
    setProjects((current) => {
      const exists = current.some((existing) => existing.id === project.id);

      if (exists) {
        return current.map((existing) =>
          existing.id === project.id ? project : existing
        );
      }

      return [project, ...current];
    });

    closeForm();
  }

  function deleteLibraryItem(id) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir este recurso da biblioteca?"
    );

    if (!confirmed) {
      return;
    }

    setLibraryItems((current) => current.filter((item) => item.id !== id));
  }

  function deleteProject(id) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir este projeto?"
    );

    if (!confirmed) {
      return;
    }

    setProjects((current) => current.filter((project) => project.id !== id));
  }

  function editLibraryItem(item) {
    setActiveTab("library");
    setEditingLibraryItem(item);
    setEditingProject(null);
    setShowForm(true);
  }

  function editProject(project) {
    setActiveTab("projects");
    setEditingProject(project);
    setEditingLibraryItem(null);
    setShowForm(true);
  }

  function toggleProjectStage(projectId, stageId) {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedStages = project.stages.map((stage) => {
          if (stage.id !== stageId) {
            return stage;
          }

          const isCompleted = stage.status === "Concluída";

          return {
            ...stage,
            status: isCompleted ? "Pendente" : "Concluída",
            completedAt: isCompleted ? null : getToday(),
          };
        });

        const allCompleted =
          updatedStages.length > 0 &&
          updatedStages.every((stage) => stage.status === "Concluída");

        return {
          ...project,
          stages: updatedStages,
          status: allCompleted ? "Concluído" : project.status,
          updatedAt: getToday(),
        };
      })
    );
  }

  function changeTab(tab) {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("Todos");
  }

  const currentStatusOptions =
    activeTab === "library"
      ? ["Todos", ...libraryStatuses]
      : ["Todos", ...projectStatuses];

  return (
    <section className="rp-page">
      <header className="rp-page-header">
        <div>
          <span className="rp-eyebrow">Organização da jornada</span>
          <h1>Biblioteca e projetos</h1>
          <p>
            Organize seus materiais de estudo, projetos práticos, tecnologias,
            entregáveis e evidências de evolução.
          </p>
        </div>

        <button type="button" className="rp-primary-button" onClick={openNewForm}>
          + {activeTab === "library" ? "Adicionar recurso" : "Adicionar projeto"}
        </button>
      </header>

      <div className="rp-tabs" role="tablist">
        <button
          type="button"
          className={activeTab === "library" ? "active" : ""}
          onClick={() => changeTab("library")}
          role="tab"
          aria-selected={activeTab === "library"}
        >
          Biblioteca
          <span>{libraryItems.length}</span>
        </button>

        <button
          type="button"
          className={activeTab === "projects" ? "active" : ""}
          onClick={() => changeTab("projects")}
          role="tab"
          aria-selected={activeTab === "projects"}
        >
          Projetos
          <span>{projects.length}</span>
        </button>
      </div>

      <div className="rp-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={
            activeTab === "library"
              ? "Buscar recursos, autores ou trilhas..."
              : "Buscar projetos, tecnologias ou objetivos..."
          }
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          {currentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {activeTab === "library" ? (
        filteredLibraryItems.length > 0 ? (
          <div className="rp-card-grid">
            {filteredLibraryItems.map((item) => (
              <LibraryCard
                key={item.id}
                item={item}
                onEdit={editLibraryItem}
                onDelete={deleteLibraryItem}
              />
            ))}
          </div>
        ) : (
          <EmptyState>
            Nenhum recurso foi encontrado. Clique em “Adicionar recurso” para
            cadastrar seu primeiro material.
          </EmptyState>
        )
      ) : filteredProjects.length > 0 ? (
        <div className="rp-card-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              item={project}
              onEdit={editProject}
              onDelete={deleteProject}
              onToggleStage={toggleProjectStage}
            />
          ))}
        </div>
      ) : (
        <EmptyState>
          Nenhum projeto foi encontrado. Clique em “Adicionar projeto” para
          cadastrar seu primeiro projeto.
        </EmptyState>
      )}

      {showForm ? (
        <div className="rp-modal-backdrop" role="presentation">
          <div
            className="rp-modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              activeTab === "library"
                ? "Formulário da biblioteca"
                : "Formulário de projeto"
            }
          >
            {activeTab === "library" ? (
              <LibraryForm
                editingItem={editingLibraryItem}
                onSave={saveLibraryItem}
                onCancel={closeForm}
              />
            ) : (
              <ProjectForm
                editingItem={editingProject}
                onSave={saveProject}
                onCancel={closeForm}
              />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}