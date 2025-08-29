// export interface ServiceUser {
//   id: string;
//   name: string;
//   dateOfBirth: string;
//   nationality: string;
//   gender: string;
//   room: string;
//   branch: string;
//   status: string;
//   arrivalDate: string;
//   caseWorker: string;
//   phone: string;
//   email: string;
//   emergencyContact: string;
//   medicalConditions: string[];
//   dietaryRequirements: string[];
//   languages: string[];
//   supportNeeds: string[];
//   documents: string[];
//   lastWelfareCheck: string;
//   avatar: string;
// }

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  amenities: string[];
}

export interface Location {
  _id: string;
  name: string;
  rooms: Room[];
}

export interface Branch {
  _id: string;
  companyId: {
    _id: string;
    name: string;
  };
  name: string;
  address: string;
  locations: Location[];
}

export interface GuestFormData {
  areThereMultipleGuests: boolean;
  users: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    branches: string[];
    locations: string[];
  }[];
  details: {
    dateOfBirth: string;
    gender: string;
    nationality: string;
    language: string;
    numberOfDependents: number;
    dental: {
      name: string;
      phoneNumber: string;
      emailAddress: string;
    };
    address: string;
    emergencyContacts: {
      fullName: string;
      relationship: string;
      phoneNumber: string;
    }[];
    medicalCondition: string;
    allergies: string;
    currentMedications: string;
    additionalNotes: string;
    dietaryRequirements: string[];
    supportServices: string[];
    priorityLevel: string;
    documents: {
      type: string;
      url: string;
    }[];
    roomTypePreference: string;
    assignedRoom: string;
    consentAccuracy: boolean;
    consentDataProcessing: boolean;
    consentDataRetention: boolean;
    signature: string;
  }[];
}

export interface ServiceUser {
  _id: string;
  userId: {
    _id: string;
    portNumber: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    roles: string[];
  };
  familyId: string;
  isPrimaryGuest: boolean;
  primaryGuestId: string | null;
  familyRooms: {
    roomId: {
      _id: string;
      roomNumber: string;
      type: string;
    };
    locationId: string;
    branchId: string;
    _id: string;
  }[];
  dateOfBirth: string;
  gender: string;
  nationality: string;
  language: string;
  numberOfDependents: number;
  medic: string;
  address: string;
  emergencyContacts: {
    fullName: string;
    relationship: string;
    phoneNumber: string;
    _id: string;
  }[];
  medicalCondition: string;
  allergies: string;
  currentMedications: string;
  additionalNotes: string;
  dietaryRequirements: string[];
  caseWorker: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
  };
  occupancyAgreementUrl: string | null;
  signatureUrl: string | null;
  consentAccuracy: boolean;
  consentDataProcessing: boolean;
  removal: {
    status: string;
    reason: string | null;
    scheduledAt: string | null;
    scheduledBy: string | null;
    notes: string | null;
    executedAt: string | null;
    executedBy: string | null;
    lastError: string | null;
    transfer: string | null;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

// types/Document.ts
export interface Document {
  id: string;
  title: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  accessLevel: string;
  isMandatoryReading: boolean;
  branch: string;
  status: string;
  downloadCount: number;
  viewCount: number;
  createdBy: string;
  effectiveDate: string;
  priority: string;
  department: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  fileSize: string;
  fileType: string;
  fileUrl: string;
  mandatory: boolean;
}

export interface ApiClockRecord {
  id: string;
  tenantId: string;
  branch: {
    _id: string;
    name: string;
  };
  locations: {
    _id: string;
    name: string;
  }[];
  staff: {
    _id: string;
    username: string;
    fullName: string;
  };
  clockOut: string | null;
  method: string;
  withinPolicy: boolean;
  deltaMinutes: number;
  createdAt: string;
  updatedAt: string;
  isDisconnected: boolean;
  disconnectionMinutes: number;
  disconnectionReason: string | null;
  sessionType: string;
  totalShiftMinutes: number;
  actualWorkMinutes: number;
  totalDisconnectionMinutes: number;
  efficiencyPercentage: number;
  isLate: boolean;
  isEarly: boolean;
  isOnBreak: boolean;
  isOverTime: boolean;
  isAbsent: boolean;
  isClockedIn: boolean;
  extraSubstituteMinutes: number;
  currentStatus: string;
  shiftStart: string; // ✅ from API
  shiftEnd: string; // ✅ from API
  clockInTime: string; // ✅ actual clock in time
  currentTime: string;
}

export interface ClockRecord {
  id: string;
  tenantId: string;
  branch: {
    _id: string;
    name: string;
  };
  locations: {
    _id: string;
    name: string;
  }[];
  staff: {
    _id: string;
    username: string;
    fullName: string;
  };
  clockIn: string;
  clockOut: string | null;
  totalHours: string;
  status: string;
  date: string;
  location: string;
  overtime: boolean;
  shiftStart: string;
  shiftEnd: string;
  method: string;
  withinPolicy: boolean;
  deltaMinutes: number;
  createdAt: string;
  updatedAt: string;
  isDisconnected: boolean;
  disconnectionMinutes: number;
  disconnectionReason: string | null;
  sessionType: string;
  totalShiftMinutes: number;
  actualWorkMinutes: number;
  totalDisconnectionMinutes: number;
  efficiencyPercentage: number;
  isLate: boolean;
  isEarly: boolean;
  isOnBreak: boolean;
  isOverTime: boolean;
  isAbsent: boolean;
  isClockedIn: boolean;
  extraSubstituteMinutes: number;
  currentStatus: string;
  clockInTime: string;
  currentTime: string;
}

export interface Guest {
  _id: string;
  userId: {
    _id: string;
    portNumber: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    roles: string[];
  };
  familyId: string;
  isPrimaryGuest: boolean;
  primaryGuestId: string | null;
  familyRooms: {
    roomId: {
      _id: string;
      roomNumber: string;
      type: string;
    };
    locationId: string;
    branchId: string;
    _id: string;
  }[];
  dateOfBirth: string;
  gender: string;
  nationality: string;
  language: string;
  numberOfDependents: number;
  medic: string;
  address: string;
  emergencyContacts: {
    fullName: string;
    relationship: string;
    phoneNumber: string;
    _id: string;
  }[];
  medicalCondition: string;
  allergies: string;
  currentMedications: string;
  additionalNotes: string;
  dietaryRequirements: string[];
  caseWorker: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
  };
  occupancyAgreementUrl: string | null;
  signatureUrl: string | null;
  consentAccuracy: boolean;
  consentDataProcessing: boolean;
  removal: {
    status: string;
    reason: string | null;
    scheduledAt: string | null;
    scheduledBy: string | null;
    notes: string | null;
    executedAt: string | null;
    executedBy: string | null;
    lastError: string | null;
    transfer: string | null;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
}

export interface Room {
  _id: string;
  roomNumber: string;
  type: string;
}

export interface Location {
  _id: string;
  name: string;
}
