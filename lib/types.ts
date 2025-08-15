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
  dateOfBirth: string; // ISO date string
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
    _id: string;
    fullName: any;
    relationship: any;
    phoneNumber: any;
  }[];
  medicalCondition: string;
  allergies: string;
  currentMedications: string;
  additionalNotes: string;
  dietaryRequirements: string[];
  supportServices: string[];
  priorityLevel: string;
  documents: {
    _id: string;
    type: string;
    url: string;
  }[];
  branch: {
    _id: string;
    companyId: {
      _id: string;
      name: string;
    };
    name: string;
    address: string;
  };
  roomTypePreference: string;
  assignedRoom: {
    _id: string;
    roomNumber: string;
    type: string;
  };
  checkInDate: string; // ISO date string
  consentAccuracy: boolean;
  consentDataProcessing: boolean;
  consentDataRetention: boolean;
  signature: string;
  removal: {
    transfer: {
      requestedBy: string | null;
      approvedBy: string | null;
      approvalStatus: string | null;
      approvalNotes: string | null;
      targetCompanyId: string | null;
      targetBranchId: string | null;
      targetLocationId: string | null;
      targetRoomId: string | null;
    };
    status: string;
    scheduledAt: string | null;
    scheduledBy: string | null;
    notes: string | null;
    executedAt: string | null;
    executedBy: string | null;
    lastError: string | null;
  };
  createdAt: string;
  updatedAt: string;
}
