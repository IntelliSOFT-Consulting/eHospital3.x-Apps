import { showModal } from "@openmrs/esm-framework";
import { FormikProps } from "formik";
import { ClientRegistryPatient, RegistryPatient } from "./verification-types";
import counties from "./assets/counties.json";
import { FormValues } from "../patient-registration/patient-registration.types";

export function handleClientRegistryResponse(
  clientResponse: ClientRegistryPatient,
  props: FormikProps<FormValues>,
  searchTerm: string
) {
  if (clientResponse?.clientExists === false) {
    const nupiIdentifiers = {
      ["nationalId"]: {
        initialValue: searchTerm,
        identifierUuid: undefined,
        selectedSource: { uuid: "", name: "" },
        preferred: false,
        required: false,
        identifierTypeUuid: "49af6cdc-7968-4abb-bf46-de10d7f4859f",
        identifierName: "National ID",
        identifierValue: searchTerm,
      },
    };
    const dispose = showModal("empty-client-registry-modal", {
      onConfirm: () => {
        props.setValues({
          ...props.values,
          identifiers: { ...props.values.identifiers, ...nupiIdentifiers },
        });
        dispose();
      },
      close: () => dispose(),
    });
  }

  if (clientResponse?.clientExists) {
    const {
      client: {
        middleName,
        lastName,
        firstName,
        contact,
        country,
        countyOfBirth,
        residence,
        identifications,
        gender,
        dateOfBirth,
        isAlive,
        clientNumber,
      },
    } = clientResponse;

    const nupiIdentifiers = {
      ["nationalId"]: {
        initialValue:
          identifications !== undefined &&
          identifications[0]?.identificationNumber,
        identifierUuid: undefined,
        selectedSource: { uuid: "", name: "" },
        preferred: false,
        required: false,
        identifierTypeUuid: "49af6cdc-7968-4abb-bf46-de10d7f4859f",
        identifierName: "National ID",
        identifierValue:
          identifications !== undefined &&
          identifications[0]?.identificationNumber,
      },
    };

    const dispose = showModal("confirm-client-registry-modal", {
      onConfirm: () => {
        props.setValues({
          ...props.values,
          familyName: lastName,
          middleName: middleName,
          givenName: firstName,
          gender: gender === "male" ? "Male" : "Female",
          birthdate: new Date(dateOfBirth),
          isDead: !isAlive,
          attributes: {
            "b2c38640-2603-4629-aebd-3b54f33f1e3a": contact?.primaryPhone,
            "94614350-84c8-41e0-ac29-86bc107069be": contact?.secondaryPhone,
          },
          address: {
            address1: residence?.address,
            address2: "",
            address4: residence?.ward,
            cityVillage: residence?.village,
            stateProvince: residence?.subCounty,
            countyDistrict: counties.find(
              (county) => county.code === parseInt(residence?.county)
            )?.name,
            country: "Kenya",
            postalCode: residence?.address,
          },
          identifiers: { ...props.values.identifiers, ...nupiIdentifiers },
        });
        dispose();
      },
      close: () => dispose(),
      patient: clientResponse.client,
    });
  }
}

export function generateNUPIPayload(formValues: FormValues): RegistryPatient {
  let createRegistryPatient: RegistryPatient = {
    firstName: formValues?.givenName,
    middleName: formValues?.middleName,
    lastName: formValues?.familyName,
    gender: formValues?.gender === "Male" ? "male" : "female",
    dateOfBirth: new Date(formValues.birthdate).toISOString(),
    isAlive: !formValues.isDead,
    residence: {
      county: `0${
        counties.find((county) =>
          county.name.includes(formValues.address["countyDistrict"])
        )?.code
      }`,
      subCounty: formValues.address["stateProvince"]?.toLocaleLowerCase(),
      ward: formValues.address["address4"]?.toLocaleLowerCase(),
      village: formValues.address["cityVillage"],
      landmark: formValues.address["address2"],
      address: formValues.address["postalCode"],
    },
    nextOfKins: [],
    contact: {
      primaryPhone:
        formValues.attributes["b2c38640-2603-4629-aebd-3b54f33f1e3a"],
      secondaryPhone:
        formValues.attributes["94614350-84c8-41e0-ac29-86bc107069be"],
    },
    country: "KE",
    countyOfBirth: `0${
      counties.find((county) =>
        county.name.includes(formValues.address["countyDistrict"])
      )?.code
    }`,
    religion: "",
    originFacilityKmflCode: "",
    nascopCCCNumber: "",
    identifications: [
      {
        identificationType: "national-id",
        identificationNumber:
          formValues.identifiers["nationalId"]?.identifierValue,
      },
    ],
  };
  return createRegistryPatient;
}
