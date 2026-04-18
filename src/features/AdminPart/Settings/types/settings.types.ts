/**
 * Settings types.
 *
 * Backend sources:
 *   About & Terms
 *     - GET  /aboutAndTerm/about          → aboutAndTermController.getAbout
 *     - GET  /aboutAndTerm/terms          → aboutAndTermController.getTerms
 *     - POST /aboutAndTerm/create         → aboutAndTermController.createAboutAndTerm
 *     - PUT  /aboutAndTerm/update/:id     → aboutAndTermController.updateAboutAndTerm
 *
 *   Features & FAQ
 *     - GET  /featuresAndQuestions/AppFeatures   → featuresAndQuestionsController.getAppFeatures
 *     - GET  /featuresAndQuestions/FAQquestions  → featuresAndQuestionsController.getFAQquestions
 *     - POST /featuresAndQuestions/create        → featuresAndQuestionsController.crateFeaturesAndQuestions
 *     - PUT  /featuresAndQuestions/update/:id    → featuresAndQuestionsController.updateFeaturesAndQuestions
 */

export type AboutOrTermDocType = "about" | "terms";

export type AboutOrTermDoc = {
  _id: string;
  docType: AboutOrTermDocType;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AboutOrTermResponse = {
  success: boolean;
  message: string;
  data: AboutOrTermDoc[] | AboutOrTermDoc;
};

export type CreateAboutOrTermPayload = {
  docType: AboutOrTermDocType;
  description: string;
};

export type UpdateAboutOrTermPayload = Partial<CreateAboutOrTermPayload>;

export type FeatureQuestionDocType = "AppFeatures" | "FAQquestions";

export type FeatureQuestionDoc = {
  _id: string;
  docType: FeatureQuestionDocType;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FeatureQuestionResponse = {
  success: boolean;
  message: string;
  data: FeatureQuestionDoc[] | FeatureQuestionDoc;
};

export type CreateFeatureQuestionPayload = {
  docType: FeatureQuestionDocType;
  question: string;
  answer: string;
};

export type UpdateFeatureQuestionPayload =
  Partial<CreateFeatureQuestionPayload>;
