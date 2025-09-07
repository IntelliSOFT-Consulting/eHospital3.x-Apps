import { Type, validators } from "@openmrs/esm-framework";
import vitalsConfigSchema, {
  type VitalsConfigObject,
} from "./current-visit/visit-details/vitals-config-schema";
import biometricsConfigSchema, {
  type BiometricsConfigObject,
} from "./current-visit/visit-details/biometrics-config-schema";

// Not all of the columnDefinitions are used below, but they are defined anyway
// for demonstration purpose. Implementors can copy this JSON as a starting point
// to configure the queue tables
// prettier-ignore
export const defaultTablesConfig: TablesConfig = {
  "columnDefinitions": [
    {
      "id": "patient-name",
      "columnType": "patient-name-column"
    },
    {
      "id": "patient-age",
      "columnType": "patient-age-column"
    },
    {
      "id": "queue-number",
      "columnType": "visit-attribute-queue-number-column"
    },
    {
      "id": "patient-identifier",
      "columnType": "patient-identifier-column",
      "config": {
        "identifierType": "patient-identifier-uuid"
      }
    },
    {
      "id": "priority",
      "columnType": "priority-column",
      "config": {
        "priorities": [
          {
            "conceptUuid": "priority-concept-uuid",
            "tagClassName": "tag",
            "tagType": "red"
          }
        ]
      }
    },
    {
      "id": "status",
      "columnType": "status-column",
      "config": {
        "statuses": [
          {
            "conceptUuid": "status-concept-uuid",
            "iconComponent": "InProgress"
          }
        ]
      }
    },
    {
      "id": "visit-start-time",
      "columnType": "visit-start-time-column"
    },
    {
      "id": "comingFrom",
      "columnType": "queue-coming-from-column"
    },
    {
      "id": "queue",
      "columnType": "current-queue-column"
    },
    {
      "id": "wait-time",
      "columnType": "wait-time-column"
    },
    {
      "id": "actions",
      "columnType": "actions-column"
    },
    {
      "id": "active-visit-actions",
      "columnType": "extension-column"
    }
  ],
  "tableDefinitions": [
    {
      "columns": ["patient-name", "queue-number", "comingFrom", "priority", "status", "queue", "wait-time", "actions"],
      "appliedTo": [{ "queue": null, "status": null }]
    }
  ]
};

export const configSchema = {
  concepts: {
    defaultPriorityConceptUuid: {
      _type: Type.ConceptUuid,
      _description:
        "The UUID of the default priority for the queues eg Not urgent.",
      _default: "f4620bfa-3625-4883-bd3f-84c2cce14470",
    },
    emergencyPriorityConceptUuid: {
      _type: Type.ConceptUuid,
      _description:
        "The UUID of the priority with the highest sort weight for the queues eg Emergency.",
      _default: "04f6f7e0-e3cb-4e13-a133-4479f759574e",
    },
    defaultStatusConceptUuid: {
      _type: Type.ConceptUuid,
      _description: "The UUID of the default status for the queues eg Waiting.",
      _default: "51ae5e4d-b72b-4912-bf31-a17efb690aeb",
    },
    defaultTransitionStatus: {
      _type: Type.ConceptUuid,
      _description:
        "The UUID of the default status for attending a service in the queues eg In Service.",
      _default: "ca7494ae-437f-4fd0-8aae-b88b9a2ba47d",
    },
    systolicBloodPressureUuid: {
      _type: Type.ConceptUuid,
      _default: "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    diastolicBloodPressureUuid: {
      _type: Type.ConceptUuid,
      _default: "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    pulseUuid: {
      _type: Type.ConceptUuid,
      _default: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    temperatureUuid: {
      _type: Type.ConceptUuid,
      _default: "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    oxygenSaturationUuid: {
      _type: Type.ConceptUuid,
      _default: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    heightUuid: {
      _type: Type.ConceptUuid,
      _default: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    weightUuid: {
      _type: Type.ConceptUuid,
      _default: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    respiratoryRateUuid: {
      _type: Type.ConceptUuid,
      _default: "5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    historicalObsConceptUuid: {
      _type: Type.Array,
      _description:
        "The Uuids of the obs that are displayed on the previous visit modal",
      _default: ["161643AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"],
    },
  },
  contactAttributeType: {
    _type: Type.UUID,
    _description:
      "The Uuids of person attribute-type that captures contact information `e.g Next of kin contact details`",
    _default: [],
  },
  visitQueueNumberAttributeUuid: {
    _type: Type.UUID,
    _description:
      "The UUID of the visit attribute that contains the visit queue number.",
    _default: "",
  },
  vitals: vitalsConfigSchema,
  biometrics: biometricsConfigSchema,
  appointmentStatuses: {
    _type: Type.Array,
    _description: "Configurable appointment status (status of appointments)",
    _default: [
      "Requested",
      "Scheduled",
      "CheckedIn",
      "Completed",
      "Cancelled",
      "Missed",
    ],
  },
  defaultIdentifierTypes: {
    _type: Type.Array,
    _element: {
      _type: Type.String,
    },
    _description:
      "The identifier types to be display on all patient search result page",
    _default: [
      "05ee9cf4-7242-4a17-b4d4-00f707265c8a",
      "f85081e2-b4be-4e48-b3a4-7994b69bb101",
    ],
  },
  showRecommendedVisitTypeTab: {
    _type: Type.Boolean,
    _description:
      "Whether start visit form should display recommended visit type tab. Requires `visitTypeResourceUrl`",
    _default: false,
  },
  visitTypeResourceUrl: {
    _type: Type.String,
    _description: "The `visitTypeResourceUrl`",
    _default: null,
  },
  customPatientChartUrl: {
    _type: Type.String,
    _default: "${openmrsSpaBase}/patient/${patientUuid}/chart",
    _description: `Template URL that will be used when clicking on the patient name in the queues table.
      Available arguments: patientUuid, openmrsSpaBase, openBase
      (openmrsSpaBase and openBase are available to any <ConfigurableLink>)`,
    _validators: [validators.isUrlWithTemplateParameters(["patientUuid"])],
  },
  defaultFacilityUrl: {
    _type: Type.String,
    _default: "",
    _description:
      "Custom URL to load default facility if it is not in the session",
  },
  tablesConfig: {
    _type: Type.Object,
    _description: `Configurations of columns to show for the queue table.
      Multiple configurations can be provided, each can be applied generally, or to tables 
      for a particular queue, particular status, or even particular queue+status combination.
      If multiple configs are defined, the first config with matching appliedTo condition
      is used.
      See https://github.com/openmrs/openmrs-esm-patient-management/blob/main/packages/esm-service-queues-app/src/config-schema.ts
      for full schema definition and example.
    `,
    _default: defaultTablesConfig,
  },
  // Consent Configuration
  defaultLlmConsentConceptUuid: {
    _type: Type.ConceptUuid,
    _description: "The UUID of the default LLM Consent for AI",
    _default: "b71c3f8e-68c2-4285-bb94-95b9f86ff51a",
  },
  defaultConsentAnswerConceptUuid: {
    _type: Type.ConceptUuid,
    _description: "The UUID of the default Consent Answers for AI",
    _default: {
      yes: "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      no: "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
  },
  llmMessageConceptEncounterTypeUuid: {
    _type: Type.ConceptUuid,
    _description:
      "The UUID of the Encounter Type to store LLM Messages in the encounter",
    _default: "2080f13b-ee1a-4d57-a1b5-2da4f39df226",
  },
  // Billing Configuration
  patientCategory: {
    _type: Type.Object,
    _description: "Patient Category Custom UUIDs",
    _default: {
      paymentDetails: "fbc0702d-b4c9-4968-be63-af8ad3ad6239",
      paymentMethods: "8553afa0-bdb9-4d3c-8a98-05fa9350aa85",
      policyNumber: "3a988e33-a6c0-4b76-b924-01abb998944b",
      insuranceScheme: "aac48226-d143-4274-80e0-264db4e368ee",
      patientCategory: "3b9dfac8-9e4d-11ee-8c90-0242ac120002",
      formPayloadPending: "919b51c9-8e2e-468f-8354-181bf3e55786",
    },
  },
  catergoryConcepts: {
    _type: Type.Object,
    _description: "Patient Category Concept UUIDs",
    _default: {
      payingDetails: "44b34972-6630-4e5a-a9f6-a6eb0f109650",
      nonPayingDetails: "f3fb2d88-cccd-422c-8766-be101ba7bd2e",
      insuranceDetails: "beac329b-f1dc-4a33-9e7c-d95821a137a6",
    },
  },
  nonPayingPatientCategories: {
    _type: Type.Object,
    _description: "Concept UUIDs for non-paying patient categories",
    _default: {
      childUnder5: "1528AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      student: "159465AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
  },
};

export interface ConfigObject {
  concepts: {
    defaultPriorityConceptUuid: string;
    defaultStatusConceptUuid: string;
    defaultTransitionStatus: string;
    systolicBloodPressureUuid: string;
    diastolicBloodPressureUuid: string;
    pulseUuid: string;
    temperatureUuid: string;
    oxygenSaturationUuid: string;
    heightUuid: string;
    weightUuid: string;
    respiratoryRateUuid: string;
    emergencyPriorityConceptUuid: string;
    historicalObsConceptUuid: Array<string>;
  };
  contactAttributeType: Array<string>;
  visitQueueNumberAttributeUuid: string;
  vitals: VitalsConfigObject;
  biometrics: BiometricsConfigObject;
  appointmentStatuses: Array<string>;
  defaultIdentifierTypes: Array<string>;
  showRecommendedVisitTypeTab: boolean;
  customPatientChartUrl: string;
  visitTypeResourceUrl: string;
  tablesConfig: TablesConfig;
  defaultLlmConsentConceptUuid: string;
  defaultConsentAnswerConceptUuid: {
    yes: string;
    no: string;
  };
  llmMessageConceptEncounterTypeUuid: string;
  patientCategory: Object;
  categoryConcepts: Object;
  nonPayingPatientCategories: Object;
}

interface TablesConfig {
  columnDefinitions: ColumnDefinition[];

  /*
    A list of table definitions. A queue table (whether it is displaying entries from a
    particular queue+status combination, from a particular queue, or from multiple queues)
    will determine what columns to show based on these definitions. If multiple TableDefinitions
    have matching appliedTo criteria, the first one will be used.       
  */
  tableDefinitions: TableDefinitions[];
}

export type ColumnDefinition = {
  id: string;
  header?: string; // optional custom i18n translation key for the column's header; overrides the default one
  headerModule?: string; // optional custom i18n translation module for the column's header. Must be used with the header option
} & (
  | { columnType: "patient-name-column" }
  | {
      columnType: "patient-identifier-column";
      config: PatientIdentifierColumnConfig;
    }
  | { columnType: "visit-attribute-queue-number-column" }
  | { columnType: "patient-age-column" }
  | { columnType: "priority-column"; config?: PriorityColumnConfig }
  | { columnType: "status-column"; config?: StatusColumnConfig }
  | { columnType: "queue-coming-from-column" }
  | { columnType: "current-queue-column" }
  | { columnType: "wait-time-column" }
  | { columnType: "visit-start-time-column" }
  | { columnType: "actions-column" }
  | { columnType: "extension-column"; config?: object }
); // column that contains the extension slot queue-table-extension-column-slot

export interface VisitAttributeQueueNumberColumnConfig {
  visitQueueNumberAttributeUuid: string;
}

export interface PatientIdentifierColumnConfig {
  identifierType: string; // uuid of the identifier type
}
export interface PriorityConfig {
  conceptUuid: string;
  tagType: string;
  tagClassName: "priorityTag" | "tag" | null;
}

export interface PriorityColumnConfig {
  priorities: PriorityConfig[];
}

export interface StatusConfig {
  conceptUuid: string;
  iconComponent: "Group" | "InProgress" | null;
}

export interface StatusColumnConfig {
  statuses: StatusConfig[];
}

export interface ExtensionColumnConfig {
  state: any; // state to pass into the extension
}

export interface TableDefinitions {
  // a list of column ids defined in columnDefinitions
  columns: string[];

  // apply the columns to tables of any of the specified queue and status
  // (if appliedTo is null, apply to all tables, including the one in the service queue app home page)
  appliedTo?: Array<{ queue?: string; status?: string }>;
}
