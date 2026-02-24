// src/lib/landing-pages/index.ts
// Landing pages library - exports

// Types
export type {
  LandingPageStatus,
  SectionType,
  BaseSection,
  HeroSection,
  FeaturesSection,
  FeatureItem,
  TestimonialsSection,
  TestimonialItem,
  CTASection,
  FormSection,
  FormField,
  CustomHTMLSection,
  TextSection,
  ImageSection,
  VideoSection,
  DividerSection,
  LandingPageSection,
  ConversionGoal,
  LandingPage,
  LandingPageLead,
  LandingPageListItem,
  FormSubmissionData,
  GetLandingPagesOptions,
  CreateLandingPageDTO,
  UpdateLandingPageDTO,
} from './types'

// Queries
export {
  // Landing Pages CRUD
  getLandingPages,
  getLandingPageById,
  getLandingPageBySlug,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  duplicateLandingPage,
  publishLandingPage,
  unpublishLandingPage,
  // Leads
  getLandingPageLeads,
  submitForm,
  getLandingPageLeadCount,
  // Slug helpers
  generateUniqueSlug,
  isSlugAvailable,
} from './queries'

// Sections
export {
  // Type guards
  isHeroSection,
  isFeaturesSection,
  isTestimonialsSection,
  isCTASection,
  isFormSection,
  isCustomHTMLSection,
  isTextSection,
  isImageSection,
  isVideoSection,
  isDividerSection,
  // ID generation
  generateSectionId,
  generateFeatureId,
  generateTestimonialId,
  generateFieldId,
  // Default section factories
  createDefaultHeroSection,
  createDefaultFeaturesSection,
  createDefaultTestimonialsSection,
  createDefaultCTASection,
  createDefaultFormSection,
  createDefaultCustomHTMLSection,
  createDefaultTextSection,
  createDefaultImageSection,
  createDefaultVideoSection,
  createDefaultDividerSection,
  createDefaultSection,
  // Section metadata
  sectionMetadata,
  getSectionTypesByCategory,
  type SectionMetadata,
  // Section helpers
  sortSections,
  reorderSections,
  insertSection,
  removeSection,
  moveSection,
  updateSection,
  duplicateSection,
  getVisibleSections,
  // Feature helpers
  addFeature,
  removeFeature,
  updateFeature,
  // Testimonial helpers
  addTestimonial,
  removeTestimonial,
  updateTestimonial,
  // Form field helpers
  addField,
  removeField,
  updateField,
} from './sections'
