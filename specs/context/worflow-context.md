TYPE MAIN OBJECT : 

id: string
slug: string
name: string
description: string

steps: [
  {
    id: string,
    slug: string,
    name: string,
    description: string,
    isCompleted: boolean,
    canProgress : esse vai ser um step importante, algumas ações serão async 
  }
]

# infra exibida dentro do ApplicationHub
# (pode reaproveitar o objeto do database.ts)
infraOnPlat: [
  { ...objeto de database.ts }
]

# workflows em execução exibidos dentro do WorkflowTracker
workflowsOnPlat: [
  {
    id: string,
    slug: string,
    name: string,
    description: string,

    # steps serão os steppers do React Flow
    steps: [
      {
        type: "Inference" | "Computacional",
        name: string,
        slug: string,

        # se type === "Inference", sempre true
        needHumanApproval: boolean,

        # null = usuário ainda não fez nenhuma ação
        isApprovedByHuman: boolean | null
      }
    ],

    currentStep: string
  }
]

METODOS : 

- Tenha métodos de CRUD dos workflows