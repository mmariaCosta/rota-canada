import { useState } from "react";

const campaignPhases = [
  {
    id: 1,
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
    months: [
      {
        year: 2027,
        month: {
          pt: "Janeiro",
          en: "January"
        },
        milestone: {
          pt: "Começar a rota com informações reais, sem tentar resolver toda a carreira de uma vez.",
          en: "Start the route with real information, without trying to solve your entire career at once."
        },
        missions: [
          {
            id: "english-baseline-2027-01",
            trackId: "english",
            title: {
              pt: "Fazer avaliação inicial de inglês",
              en: "Take an initial English assessment"
            }
          },
          {
            id: "degree-start-2027-01",
            trackId: "technical",
            title: {
              pt: "Iniciar o tecnólogo de Segurança Cibernética",
              en: "Start the Cybersecurity degree"
            }
          },
          {
            id: "networks-2027-01",
            trackId: "technical",
            title: {
              pt: "Revisar redes e sistemas operacionais",
              en: "Review networks and operating systems"
            }
          },
          {
            id: "github-2027-01",
            trackId: "technical",
            title: {
              pt: "Organizar ou criar conta no GitHub",
              en: "Set up or organize your GitHub account"
            }
          },
          {
            id: "immigration-2027-01",
            trackId: "immigration",
            title: {
              pt: "Ler informações introdutórias sobre imigração em fonte oficial",
              en: "Read introductory immigration information from an official source"
            }
          }
        ]
      },
      {
        year: 2027,
        month: {
          pt: "Fevereiro",
          en: "February"
        },
        milestone: {
          pt: "Criar consistência inicial sem depender de motivação perfeita.",
          en: "Build initial consistency without depending on perfect motivation."
        },
        missions: [
          {
            id: "anki-2027-02",
            trackId: "english",
            title: {
              pt: "Criar um baralho de inglês técnico",
              en: "Create a technical English flashcard deck"
            }
          },
          {
            id: "terminal-2027-02",
            trackId: "technical",
            title: {
              pt: "Praticar comandos básicos de terminal",
              en: "Practice basic terminal commands"
            }
          },
          {
            id: "git-2027-02",
            trackId: "technical",
            title: {
              pt: "Aprender o fluxo básico de Git",
              en: "Learn the basic Git workflow"
            }
          },
          {
            id: "bug-2027-02",
            trackId: "technical",
            title: {
              pt: "Registrar uma dúvida técnica resolvida",
              en: "Record a solved technical question"
            }
          }
        ]
      },
      {
        year: 2027,
        month: {
          pt: "Março",
          en: "March"
        },
        milestone: {
          pt: "Ter pelo menos uma evidência documentada de aprendizagem.",
          en: "Have at least one documented learning evidence."
        },
        missions: [
          {
            id: "frontend-2027-03",
            trackId: "technical",
            title: {
              pt: "Concluir uma atividade pequena de HTML, CSS ou JavaScript",
              en: "Complete a small HTML, CSS or JavaScript activity"
            }
          },
          {
            id: "cloud-2027-03",
            trackId: "cloud",
            title: {
              pt: "Estudar fundamentos de cloud",
              en: "Study cloud fundamentals"
            }
          },
          {
            id: "diagnosis-2027-03",
            trackId: "technical",
            title: {
              pt: "Documentar um diagnóstico de erro",
              en: "Document an error diagnosis"
            }
          },
          {
            id: "review-2027-03",
            trackId: "career",
            title: {
              pt: "Fazer a primeira revisão trimestral",
              en: "Complete the first quarterly review"
            }
          }
        ]
      }
    ]
  },
  {
    id: 2,
    years: "2029–2030",
    title: {
      pt: "Experiência e especialização inicial",
      en: "Experience and initial specialization"
    },
    description: {
      pt: "Aproveitar a formação e observar oportunidades em software, cloud, segurança e integração.",
      en: "Use your education and observe opportunities in software, cloud, security and integration."
    },
    active: false
  },
  {
    id: 3,
    years: "2031–2033",
    title: {
      pt: "Preparação para mobilidade",
      en: "Mobility preparation"
    },
    description: {
      pt: "Revisar idioma, experiência, documentos, custos, oportunidades e regras migratórias.",
      en: "Review language, experience, documents, costs, opportunities and immigration rules."
    },
    active: false
  },
  {
    id: 4,
    years: "2034–2037",
    title: {
      pt: "Consolidação profissional",
      en: "Professional consolidation"
    },
    description: {
      pt: "Ampliar experiência em sistemas reais e participar de decisões técnicas.",
      en: "Expand experience with real systems and participate in technical decisions."
    },
    active: false
  },
  {
    id: 5,
    years: "2038–2041",
    title: {
      pt: "Arquitetura de soluções",
      en: "Solutions architecture"
    },
    description: {
      pt: "Desenvolver capacidade de desenhar soluções completas, seguras e sustentáveis.",
      en: "Develop the ability to design complete, secure and sustainable solutions."
    },
    active: false
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

function Campaign({ data, t, onOpenMission }) {
  const [selectedPhaseId, setSelectedPhaseId] = useState(1);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  const selectedPhase = campaignPhases.find(
    (phase) => phase.id === selectedPhaseId
  );

  const selectedMonth = selectedPhase?.months?.[selectedMonthIndex];

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
      month,
      language: data.language
    });

    onOpenMission(completeMission);
  }

  return (
    <section className="campaign-page">
      <div className="campaign-header">
        <span className="eyebrow">{t.campaignMap}</span>

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
          const isSelected = selectedPhaseId === phase.id;

          return (
            <button
              key={phase.id}
              className={`phase-card ${isSelected ? "selected" : ""}`}
              onClick={() => handlePhaseChange(phase.id)}
              type="button"
            >
              <span className="phase-number">
                {String(phase.id).padStart(2, "0")}
              </span>

              <div>
                <span className="phase-years">{phase.years}</span>

                <h2>{phase.title[data.language]}</h2>

                <p>{phase.description[data.language]}</p>
              </div>

              <span className="phase-status">
                {phase.active ? t.inProgress : t.reviewable}
              </span>
            </button>
          );
        })}
      </div>

      {selectedPhase?.months ? (
        <div className="monthly-planner">
          <div className="month-tabs">
            {selectedPhase.months.map((month, index) => {
              const isSelected = selectedMonthIndex === index;

              return (
                <button
                  key={`${month.month.pt}-${month.year}`}
                  className={isSelected ? "active" : ""}
                  onClick={() => handleMonthChange(index)}
                  type="button"
                  aria-current={isSelected ? "page" : undefined}
                >
                  {month.month[data.language]}
                </button>
              );
            })}
          </div>

          {selectedMonth && (
            <article className="month-detail">
              <div className="month-heading">
                <div>
                  <span className="eyebrow">{selectedMonth.year}</span>

                  <h2>{selectedMonth.month[data.language]}</h2>
                </div>

                <span className="month-status">
                  {t.reviewable}
                </span>
              </div>

              <div className="mission-list">
                {selectedMonth.missions.map((mission, index) => {
                const isCompleted =
                    data.completedMissions?.includes(mission.id);

                  const missionDetails = createMissionDetails({
                    mission,
                    month: selectedMonth,
                    language: data.language
                  });

                  return (
                    <button
                      key={mission.id}
                      className={`campaign-mission ${
                        isCompleted ? "completed" : ""
                      }`}
                      onClick={() =>
                        handleMissionClick(mission, selectedMonth)
                      }
                      type="button"
                    >
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <strong>
                        {isCompleted && "✓ "}
                        {mission.title[data.language]}
                      </strong>

                      <b>→</b>
                    </button>
                  );
                })}
              </div>

              <div className="month-milestone">
                <span className="eyebrow">
                  {data.language === "pt"
                    ? "MARCO DO MÊS"
                    : "MONTHLY MILESTONE"}
                </span>

                <p>{selectedMonth.milestone[data.language]}</p>
              </div>
            </article>
          )}
        </div>
      ) : (
        <div className="future-phase">
          <span className="eyebrow">{t.futurePhase}</span>

          <h2>
            {data.language === "pt"
              ? "Esta fase ainda não possui missões rígidas."
              : "This phase does not have rigid missions yet."}
          </h2>

          <p>
            {data.language === "pt"
              ? "Quando chegar mais perto deste período, crie marcos com base nas informações disponíveis naquele momento."
              : "As this period gets closer, create milestones based on information available at that time."}
          </p>
        </div>
      )}
    </section>
  );
}

function createMissionDetails({ mission, month }) {
  const track = trackNames[mission.trackId] || trackNames.technical;

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
      pt: `Realizar a missão: ${mission.title.pt}.`,
      en: `Complete the mission: ${mission.title.en}.`
    },

    relevance: {
      pt: "Esta missão transforma uma intenção ampla em uma evidência concreta de aprendizagem.",
      en: "This mission transforms a broad intention into concrete learning evidence."
    },

    prerequisites: {
      pt: [
        "Separar um período compatível com sua semana.",
        "Usar recursos legais e autorizados.",
        "Registrar dúvidas e descobertas."
      ],
      en: [
        "Set aside a period compatible with your week.",
        "Use legal and authorized resources.",
        "Record questions and discoveries."
      ]
    },

    steps: {
      pt: [
        "Ler o objetivo da missão.",
        "Dividir a tarefa em passos pequenos.",
        "Executar a prática principal.",
        "Registrar o que foi aprendido.",
        "Definir o próximo passo."
      ],
      en: [
        "Read the mission objective.",
        "Divide the task into small steps.",
        "Complete the main practice.",
        "Record what was learned.",
        "Define the next step."
      ]
    },

    time: "30–60 min",

    cost: {
      pt: "Gratuito — confirmar disponibilidade",
      en: "Free — confirm availability"
    },

    evidence: {
      pt: [
        "Registro da atividade realizada.",
        "Explicação com suas próprias palavras.",
        "Dúvidas, hipóteses ou problemas encontrados.",
        "Próximo passo definido."
      ],
      en: [
        "Record of the completed activity.",
        "Explanation in your own words.",
        "Questions, hypotheses or problems found.",
        "Next step defined."
      ]
    },

    success: {
      pt: "Conseguir explicar o que foi feito, o que foi aprendido e o que ainda precisa ser investigado.",
      en: "Explain what was done, learned and what still needs investigation."
    },

    nextStep: {
      pt: "Registrar a evidência e escolher uma pequena evolução para a próxima sessão.",
      en: "Record the evidence and choose a small improvement for the next session."
    },

    difficultAlternative: {
      pt: "Dedicar 10–15 minutos para ler sobre o tema e registrar uma única descoberta.",
      en: "Spend 10–15 minutes reading about the topic and record one discovery."
    }
  };
}

export default Campaign;