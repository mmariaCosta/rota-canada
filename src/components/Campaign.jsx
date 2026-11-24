import { useState } from "react";

const monthNames = [
  {
    pt: "Janeiro",
    en: "January"
  },
  {
    pt: "Fevereiro",
    en: "February"
  },
  {
    pt: "Março",
    en: "March"
  },
  {
    pt: "Abril",
    en: "April"
  },
  {
    pt: "Maio",
    en: "May"
  },
  {
    pt: "Junho",
    en: "June"
  },
  {
    pt: "Julho",
    en: "July"
  },
  {
    pt: "Agosto",
    en: "August"
  },
  {
    pt: "Setembro",
    en: "September"
  },
  {
    pt: "Outubro",
    en: "October"
  },
  {
    pt: "Novembro",
    en: "November"
  },
  {
    pt: "Dezembro",
    en: "December"
  }
];

const trackNames = {
  english: {
    pt: "Inglês profissional",
    en: "Professional English"
  },
  french: {
    pt: "Francês",
    en: "French"
  },
  technical: {
    pt: "Fundamentos técnicos",
    en: "Technical fundamentals"
  },
  security: {
    pt: "Cibersegurança",
    en: "Cybersecurity"
  },
  cloud: {
    pt: "Cloud / AWS",
    en: "Cloud / AWS"
  },
  software: {
    pt: "Arquitetura de software",
    en: "Software architecture"
  },
  integration: {
    pt: "Integração",
    en: "Integration"
  },
  career: {
    pt: "Carreira",
    en: "Career"
  },
  immigration: {
    pt: "Imigração informativa",
    en: "Immigration research"
  }
};

const phaseDefinitions = [
  {
    id: 1,
    startYear: 2027,
    endYear: 2028,
    years: "2027–2028",
    title: {
      pt: "Fundação",
      en: "Foundation"
    },
    description: {
      pt: "Construir fundamentos técnicos, concluir o tecnólogo, desenvolver inglês e iniciar projetos demonstráveis.",
      en: "Build technical foundations, complete the degree, develop English and start demonstrable projects."
    },
    active: true,
    milestoneTemplates: [
      {
        pt: "Estabelecer uma base consistente de estudo e registrar evidências pequenas.",
        en: "Establish a consistent study foundation and record small evidence."
      },
      {
        pt: "Transformar conteúdos estudados em práticas e registros consultáveis.",
        en: "Turn studied subjects into practical work and traceable records."
      },
      {
        pt: "Conectar teoria, estágio e pequenos projetos demonstráveis.",
        en: "Connect theory, internship experience and small demonstrable projects."
      },
      {
        pt: "Revisar o progresso e ajustar a carga sem tratar atrasos como fracasso.",
        en: "Review progress and adjust the workload without treating delays as failure."
      }
    ]
  },
  {
    id: 2,
    startYear: 2029,
    endYear: 2030,
    years: "2029–2030",
    title: {
      pt: "Experiência e especialização inicial",
      en: "Experience and initial specialization"
    },
    description: {
      pt: "Aproveitar a formação e observar oportunidades em software, cloud, segurança e integração.",
      en: "Use your education and observe opportunities in software, cloud, security and integration."
    },
    active: false,
    milestoneTemplates: [
      {
        pt: "Consolidar a formação e transformar experiências em evidências profissionais.",
        en: "Consolidate the degree and turn experience into professional evidence."
      },
      {
        pt: "Aprofundar desenvolvimento, integração e cloud por meio de projetos.",
        en: "Deepen development, integration and cloud through projects."
      },
      {
        pt: "Comparar oportunidades profissionais com base em aprendizado, estabilidade e crescimento.",
        en: "Compare professional opportunities based on learning, stability and growth."
      },
      {
        pt: "Revisar a especialização inicial sem fechar prematuramente outras possibilidades.",
        en: "Review the initial specialization without prematurely closing other possibilities."
      }
    ]
  },
  {
    id: 3,
    startYear: 2031,
    endYear: 2033,
    years: "2031–2033",
    title: {
      pt: "Preparação para mobilidade",
      en: "Mobility preparation"
    },
    description: {
      pt: "Revisar idioma, experiência, documentos, custos, oportunidades e regras migratórias.",
      en: "Review language, experience, documents, costs, opportunities and immigration rules."
    },
    active: false,
    milestoneTemplates: [
      {
        pt: "Medir o nível profissional atual e identificar lacunas relevantes.",
        en: "Measure the current professional level and identify relevant gaps."
      },
      {
        pt: "Organizar documentação, currículo e evidências profissionais.",
        en: "Organize documents, résumé and professional evidence."
      },
      {
        pt: "Pesquisar oportunidades e regras somente em fontes confiáveis e atuais.",
        en: "Research opportunities and rules only through reliable and current sources."
      },
      {
        pt: "Revisar custos, riscos e alternativas antes de tomar decisões importantes.",
        en: "Review costs, risks and alternatives before making important decisions."
      }
    ]
  },
  {
    id: 4,
    startYear: 2034,
    endYear: 2037,
    years: "2034–2037",
    title: {
      pt: "Consolidação profissional",
      en: "Professional consolidation"
    },
    description: {
      pt: "Ampliar experiência em sistemas reais e participar de decisões técnicas.",
      en: "Expand experience with real systems and participate in technical decisions."
    },
    active: false,
    milestoneTemplates: [
      {
        pt: "Assumir responsabilidades técnicas progressivamente maiores.",
        en: "Take on progressively greater technical responsibilities."
      },
      {
        pt: "Participar de decisões envolvendo segurança, custo e sustentabilidade.",
        en: "Participate in decisions involving security, cost and sustainability."
      },
      {
        pt: "Praticar comunicação técnica, documentação e alinhamento com diferentes áreas.",
        en: "Practice technical communication, documentation and cross-team alignment."
      },
      {
        pt: "Avaliar especialização, liderança técnica e qualidade de vida profissional.",
        en: "Evaluate specialization, technical leadership and professional quality of life."
      }
    ]
  },
  {
    id: 5,
    startYear: 2038,
    endYear: 2041,
    years: "2038–2041",
    title: {
      pt: "Arquitetura de soluções",
      en: "Solutions architecture"
    },
    description: {
      pt: "Desenvolver capacidade de desenhar soluções completas, seguras e sustentáveis.",
      en: "Develop the ability to design complete, secure and sustainable solutions."
    },
    active: false,
    milestoneTemplates: [
      {
        pt: "Desenhar soluções considerando requisitos, restrições e riscos.",
        en: "Design solutions considering requirements, constraints and risks."
      },
      {
        pt: "Documentar decisões arquiteturais de forma clara e revisável.",
        en: "Document architectural decisions clearly and in a reviewable way."
      },
      {
        pt: "Conectar arquitetura, governança, segurança, custo e operação.",
        en: "Connect architecture, governance, security, cost and operations."
      },
      {
        pt: "Avaliar liderança, consultoria, mentoria ou empreendedorismo como caminhos possíveis.",
        en: "Evaluate leadership, consulting, mentoring or entrepreneurship as possible paths."
      }
    ]
  }
];

const missionTemplates = {
  foundation: [
    {
      trackId: "english",
      pt: "Praticar inglês profissional relacionado ao tema estudado no mês",
      en: "Practice professional English related to the month's subject"
    },
    {
      trackId: "technical",
      pt: "Estudar e praticar um fundamento técnico",
      en: "Study and practice one technical foundation"
    },
    {
      trackId: "career",
      pt: "Registrar uma evidência do desenvolvimento profissional",
      en: "Record evidence of professional development"
    },
    {
      trackId: "technical",
      pt: "Documentar uma dúvida, diagnóstico ou solução encontrada",
      en: "Document a question, diagnosis or solution found"
    }
  ],

  experience: [
    {
      trackId: "technical",
      pt: "Transformar uma atividade profissional em estudo de caso",
      en: "Turn a professional activity into a case study"
    },
    {
      trackId: "software",
      pt: "Praticar desenho de uma aplicação ou serviço",
      en: "Practice designing an application or service"
    },
    {
      trackId: "integration",
      pt: "Construir ou documentar uma integração entre sistemas",
      en: "Build or document an integration between systems"
    },
    {
      trackId: "cloud",
      pt: "Estudar uma solução de cloud e registrar decisões de custo e segurança",
      en: "Study a cloud solution and record cost and security decisions"
    },
    {
      trackId: "career",
      pt: "Atualizar uma evidência profissional no portfólio",
      en: "Update a professional evidence item in the portfolio"
    }
  ],

  mobility: [
    {
      trackId: "english",
      pt: "Praticar comunicação profissional em inglês",
      en: "Practice professional communication in English"
    },
    {
      trackId: "career",
      pt: "Revisar currículo, portfólio ou perfil profissional",
      en: "Review résumé, portfolio or professional profile"
    },
    {
      trackId: "immigration",
      pt: "Consultar uma fonte oficial sobre imigração ou trabalho",
      en: "Consult an official source about immigration or work"
    },
    {
      trackId: "career",
      pt: "Pesquisar uma oportunidade profissional compatível",
      en: "Research a compatible professional opportunity"
    },
    {
      trackId: "immigration",
      pt: "Atualizar estimativa de custos, documentos e alternativas",
      en: "Update the estimate of costs, documents and alternatives"
    }
  ],

  consolidation: [
    {
      trackId: "software",
      pt: "Analisar uma decisão de arquitetura em sistema real",
      en: "Analyze an architecture decision in a real system"
    },
    {
      trackId: "security",
      pt: "Avaliar riscos de segurança de uma solução",
      en: "Assess security risks in a solution"
    },
    {
      trackId: "cloud",
      pt: "Avaliar disponibilidade, escalabilidade e custo de uma arquitetura",
      en: "Assess availability, scalability and cost of an architecture"
    },
    {
      trackId: "integration",
      pt: "Documentar dependências e contratos entre sistemas",
      en: "Document dependencies and contracts between systems"
    },
    {
      trackId: "career",
      pt: "Registrar uma decisão técnica ou uma situação de liderança",
      en: "Record a technical decision or leadership situation"
    }
  ],

  architecture: [
    {
      trackId: "software",
      pt: "Desenhar uma solução completa a partir de requisitos",
      en: "Design a complete solution from requirements"
    },
    {
      trackId: "security",
      pt: "Criar uma análise de ameaças e controles de segurança",
      en: "Create a threat analysis and security controls"
    },
    {
      trackId: "cloud",
      pt: "Comparar alternativas de infraestrutura, custo e operação",
      en: "Compare infrastructure, cost and operational alternatives"
    },
    {
      trackId: "integration",
      pt: "Definir uma estratégia de integração entre sistemas",
      en: "Define an integration strategy between systems"
    },
    {
      trackId: "career",
      pt: "Registrar uma reflexão sobre liderança, mentoria ou especialização",
      en: "Record a reflection on leadership, mentoring or specialization"
    }
  ]
};

function getPhaseCategory(phaseId) {
  if (phaseId === 1) {
    return "foundation";
  }

  if (phaseId === 2) {
    return "experience";
  }

  if (phaseId === 3) {
    return "mobility";
  }

  if (phaseId === 4) {
    return "consolidation";
  }

  return "architecture";
}

function getMissionCount(phaseId) {
  if (phaseId === 1) {
    return 4;
  }

  return 5;
}

function createMonthsForPhase(phase) {
  const months = [];

  for (
    let year = phase.startYear;
    year <= phase.endYear;
    year += 1
  ) {
    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const month = monthNames[monthIndex];
      const monthPosition =
        (year - phase.startYear) * 12 + monthIndex;

      const milestoneTemplate =
        phase.milestoneTemplates[monthPosition % 4];

      const category = getPhaseCategory(phase.id);
      const templates = missionTemplates[category];
      const missionCount = getMissionCount(phase.id);

      const missions = templates
        .slice(0, missionCount)
        .map((template, templateIndex) => {
          const missionNumber = String(
            templateIndex + 1
          ).padStart(2, "0");

          return {
            id: `phase-${phase.id}-${year}-${String(
              monthIndex + 1
            ).padStart(2, "0")}-${template.trackId}-${templateIndex}`,
            trackId: template.trackId,
            title: {
              pt: `${template.pt} — ${month.pt}`,
              en: `${template.en} — ${month.en}`
            },
            monthIndex,
            monthPosition,
            missionNumber
          };
        });

      months.push({
        year,
        month,
        monthIndex,
        milestone: milestoneTemplate,
        missions
      });
    }
  }

  return months;
}

const campaignPhases = phaseDefinitions.map((phase) => ({
  ...phase,
  months: createMonthsForPhase(phase)
}));

function createMissionDetails({ mission, month }) {
  const track =
    trackNames[mission.trackId] || trackNames.technical;

  const isLanguageMission =
    mission.trackId === "english" ||
    mission.trackId === "french";

  const isResearchMission =
    mission.trackId === "immigration" ||
    mission.trackId === "career";

  const time = isLanguageMission
    ? "30–50 min"
    : isResearchMission
      ? "30–60 min"
      : "45–90 min";

  const cost = isResearchMission
    ? {
        pt: "Gratuito — confirmar fonte e disponibilidade",
        en: "Free — confirm source and availability"
      }
    : {
        pt: "Preferencialmente gratuito",
        en: "Preferably free"
      };

  return {
    id: mission.id,
    trackId: mission.trackId,
    track,

    title: mission.title,

    month: {
      pt: `${month.month.pt} de ${month.year}`,
      en: `${month.month.en} ${month.year}`
    },

    objective: {
      pt: `Concluir a missão "${mission.title.pt}" e produzir uma evidência simples que possa ser revisada posteriormente.`,
      en: `Complete "${mission.title.en}" and produce simple evidence that can be reviewed later.`
    },

    relevance: {
      pt: `Esta missão desenvolve a trilha de ${track.pt.toLowerCase()} e transforma uma intenção ampla em uma prática observável.`,
      en: `This mission develops the ${track.en.toLowerCase()} track and turns a broad intention into observable practice.`
    },

    prerequisites: {
      pt: [
        "Verificar quanto tempo está disponível na semana.",
        "Escolher uma fonte confiável ou um ambiente seguro de prática.",
        "Definir o que será considerado uma entrega mínima.",
        "Evitar transformar a missão em uma tarefa maior do que o necessário."
      ],
      en: [
        "Check how much time is available during the week.",
        "Choose a reliable source or a safe practice environment.",
        "Define what will count as a minimum deliverable.",
        "Avoid turning the mission into a larger task than necessary."
      ]
    },

    steps: {
      pt: [
        `Ler novamente o objetivo da missão de ${month.month.pt} de ${month.year}.`,
        "Separar a atividade em partes pequenas.",
        "Executar a prática principal.",
        "Registrar decisões, dúvidas e descobertas.",
        "Guardar uma evidência em local organizado.",
        "Definir o próximo passo sem criar uma cobrança excessiva."
      ],
      en: [
        `Read the objective for ${month.month.en} ${month.year} again.`,
        "Break the activity into small parts.",
        "Complete the main practice.",
        "Record decisions, questions and discoveries.",
        "Store evidence in an organized place.",
        "Define the next step without creating excessive pressure."
      ]
    },

    time,

    cost,

    evidence: {
      pt: [
        "Registro do que foi realizado.",
        "Explicação com suas próprias palavras.",
        "Dúvidas, limitações ou problemas encontrados.",
        "Link, arquivo, captura ou anotação, quando aplicável.",
        "Próximo passo definido."
      ],
      en: [
        "Record of what was completed.",
        "Explanation in your own words.",
        "Questions, limitations or problems found.",
        "Link, file, screenshot or note, when applicable.",
        "Next step defined."
      ]
    },

    success: {
      pt: "Conseguir explicar o que foi feito, qual competência foi praticada e qual evidência demonstra o trabalho.",
      en: "Explain what was done, which competency was practiced and what evidence demonstrates the work."
    },

    nextStep: {
      pt: "Revisar a evidência em outro momento e escolher uma evolução pequena ou uma correção necessária.",
      en: "Review the evidence later and choose a small improvement or necessary correction."
    },

    difficultAlternative: {
      pt: "Dedicar 10–15 minutos para ler uma fonte confiável, registrar uma descoberta e definir o menor próximo passo possível.",
      en: "Spend 10–15 minutes reading a reliable source, recording one discovery and defining the smallest possible next step."
    }
  };
}

function Campaign({ data, t, onOpenMission }) {
  const [selectedPhaseId, setSelectedPhaseId] =
    useState(1);

  const [selectedMonthIndex, setSelectedMonthIndex] =
    useState(0);

  const selectedPhase = campaignPhases.find(
    (phase) => phase.id === selectedPhaseId
  );

  const selectedMonth =
    selectedPhase?.months?.[selectedMonthIndex];

  function handlePhaseChange(phaseId) {
    setSelectedPhaseId(phaseId);
    setSelectedMonthIndex(0);
  }

  function handleMonthChange(monthIndex) {
    setSelectedMonthIndex(monthIndex);
  }

  function handleMissionClick(mission, month) {
    const completeMission = createMissionDetails({
      mission,
      month
    });

    onOpenMission(completeMission);
  }

  return (
    <section className="campaign-page">
      <div className="campaign-header">
        <span className="eyebrow">
          {t.campaignMap}
        </span>

        <h2>
          {data.language === "pt"
            ? "Uma rota ajustável"
            : "An adjustable route"}
        </h2>

        <p>
          {data.language === "pt"
            ? "Transforme objetivos grandes em competências demonstráveis e próximos passos concretos."
            : "Transform large goals into demonstrable competencies and concrete next steps."}
        </p>
      </div>

      <div className="campaign-notice">
        <strong>{t.aspiration}</strong>

        <span>
          {data.language === "pt"
            ? "Avaliar a possibilidade de residir no Canadá até 2033, conforme formação, experiência, idioma, recursos, oportunidades e regras vigentes."
            : "Assess the possibility of living in Canada by 2033 according to education, experience, language, resources, opportunities and current rules."}
        </span>
      </div>

      <div className="phase-list">
        {campaignPhases.map((phase) => {
          const isSelected =
            selectedPhaseId === phase.id;

          const completedInPhase =
            phase.months
              ?.flatMap((month) => month.missions)
              .filter((mission) =>
                data.completedMissions?.includes(
                  mission.id
                )
              ).length || 0;

          const totalInPhase =
            phase.months?.flatMap(
              (month) => month.missions
            ).length || 0;

          return (
            <button
              key={phase.id}
              className={`phase-card ${
                isSelected ? "selected" : ""
              }`}
              onClick={() =>
                handlePhaseChange(phase.id)
              }
              type="button"
            >
              <span className="phase-number">
                {String(phase.id).padStart(2, "0")}
              </span>

              <div>
                <span className="phase-years">
                  {phase.years}
                </span>

                <h2>
                  {phase.title[data.language]}
                </h2>

                <p>
                  {phase.description[data.language]}
                </p>

                <small>
                  {completedInPhase} / {totalInPhase}{" "}
                  {data.language === "pt"
                    ? "missões concluídas"
                    : "missions completed"}
                </small>
              </div>

              <span className="phase-status">
                {phase.active
                  ? t.inProgress
                  : t.reviewable}
              </span>
            </button>
          );
        })}
      </div>

      {selectedPhase?.months ? (
        <div className="monthly-planner">
          <div className="month-tabs">
            {selectedPhase.months.map(
              (month, index) => {
                const isSelected =
                  selectedMonthIndex === index;

                const completedCount =
                  month.missions.filter((mission) =>
                    data.completedMissions?.includes(
                      mission.id
                    )
                  ).length;

                return (
                  <button
                    key={`${month.month.pt}-${month.year}`}
                    className={
                      isSelected ? "active" : ""
                    }
                    onClick={() =>
                      handleMonthChange(index)
                    }
                    type="button"
                    aria-current={
                      isSelected ? "page" : undefined
                    }
                  >
                    <span>
                      {month.month[data.language]}
                    </span>

                    <small>
                      {completedCount}/
                      {month.missions.length}
                    </small>
                  </button>
                );
              }
            )}
          </div>

          {selectedMonth && (
            <article className="month-detail">
              <div className="month-heading">
                <div>
                  <span className="eyebrow">
                    {selectedMonth.year}
                  </span>

                  <h2>
                    {
                      selectedMonth.month[
                        data.language
                      ]
                    }
                  </h2>
                </div>

                <span className="month-status">
                  {t.reviewable}
                </span>
              </div>

              <div className="mission-list">
                {selectedMonth.missions.map(
                  (mission, index) => {
                    const isCompleted =
                      data.completedMissions?.includes(
                        mission.id
                      );

                    return (
                      <button
                        key={mission.id}
                        className={`campaign-mission ${
                          isCompleted
                            ? "completed"
                            : ""
                        }`}
                        onClick={() =>
                          handleMissionClick(
                            mission,
                            selectedMonth
                          )
                        }
                        type="button"
                      >
                        <span>
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <strong>
                          {isCompleted && "✓ "}
                          {mission.title[
                            data.language
                          ]}
                        </strong>

                        <b aria-hidden="true">→</b>
                      </button>
                    );
                  }
                )}
              </div>

              <div className="month-milestone">
                <span className="eyebrow">
                  {data.language === "pt"
                    ? "MARCO DO MÊS"
                    : "MONTHLY MILESTONE"}
                </span>

                <p>
                  {
                    selectedMonth.milestone[
                      data.language
                    ]
                  }
                </p>
              </div>
            </article>
          )}
        </div>
      ) : (
        <div className="future-phase">
          <span className="eyebrow">
            {t.futurePhase}
          </span>

          <h2>
            {data.language === "pt"
              ? "Esta fase será revisada conforme novas informações."
              : "This phase will be reviewed as new information becomes available."}
          </h2>

          <p>
            {data.language === "pt"
              ? "As missões são orientadoras. Elas podem ser adaptadas conforme formação, experiência, finanças, idioma, oportunidades e regras vigentes."
              : "The missions are guidance. They can be adapted according to education, experience, finances, language, opportunities and current rules."}
          </p>
        </div>
      )}
    </section>
  );
}

export { campaignPhases };
export default Campaign;