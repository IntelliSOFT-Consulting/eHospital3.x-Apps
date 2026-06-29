import * as Yup from 'yup';
import mapValues from 'lodash/mapValues';
import { type FormValues } from '../patient-registration.types';
import { type RegistrationConfig } from '../../config-schema';

export function getValidationSchema(config: RegistrationConfig) {
  return Yup.object({
    givenName: Yup.string().required('givenNameRequired'),
    familyName: Yup.string().required('familyNameRequired'),
    additionalGivenName: Yup.string().when('addNameInLocalLanguage', {
      is: true,
      then: (schema) => schema.required('givenNameRequired'),
      otherwise: (schema) => schema.notRequired(),
    }),
    additionalFamilyName: Yup.string().when('addNameInLocalLanguage', {
      is: true,
      then: (schema) => schema.required('familyNameRequired'),
      otherwise: (schema) => schema.notRequired(),
    }),
    gender: Yup.string()
      .oneOf(
        config.fieldConfigurations.gender.map((g) => g.value),
        'genderUnspecified',
      )
      .required('genderRequired'),
    birthdate: Yup.date()
      .nullable()
      .when('birthdateEstimated', {
        is: false,
        then: (schema) => schema.required('birthdayRequired').max(new Date(), 'birthdayNotInTheFuture'),
        otherwise: (schema) => schema.nullable(),
      }),
    yearsEstimated: Yup.number().when('birthdateEstimated', {
      is: true,
      then: (schema) => schema.required('yearsEstimateRequired').min(0, 'negativeYears'),
      otherwise: (schema) => schema.nullable(),
    }),
    monthsEstimated: Yup.number().min(0, 'negativeMonths'),
    deathDate: Yup.date().nullable().max(new Date(), 'deathdayNotInTheFuture'),
    email: Yup.string().optional().email('invalidEmail'),
    identifiers: Yup.lazy((obj: FormValues['identifiers']) =>
      Yup.object(
        mapValues(obj, () =>
          Yup.object({
            required: Yup.bool(),
            identifierValue: Yup.string().when('required', {
              is: true,
              then: (schema) => schema.required('identifierValueRequired'),
              otherwise: (schema) => schema.notRequired(),
            }),
          }),
        ),
      ),
    ),
    relationships: Yup.array().of(
      Yup.object().shape({
        relatedPersonUuid: Yup.string().required(),
        relationshipType: Yup.string().required(),
      }),
    ),
  });
}
