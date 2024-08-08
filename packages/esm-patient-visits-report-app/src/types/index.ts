export interface ResponseData {
  results: ResultItem[];
  links: LinkItem[];
}

export interface ResultItem {
  uuid: string;
  form: {
    uuid: string;
    encounterType: {
      uuid: string;
    };
  };
  encounterDatetime: string;
  visit: {
    visitType: {
      display: string;
    };
    startDatetime: string;
    stopDatetime: string;
    location: {
      uuid: string;
      display: string;
    };
  };
}

interface LinkItem {
  rel: string;
  uri: string;
  resourceAlias: null | string;
}
