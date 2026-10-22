import '@testing-library/jest-dom/vitest'

// jsdom does not implement scrollIntoView; NewPatient / PatientDetails / Odontogram call it
Element.prototype.scrollIntoView = () => {}
