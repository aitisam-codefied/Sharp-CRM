// src/hooks/useInTransitUsers.ts
"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Guest {
  _id: string;
  userId: {
    _id: string;
    portNumber: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
  };
  familyId: string;
  isPrimaryGuest: boolean;
  primaryGuestId: null | string;
  familyRooms: Array<{
    roomId: {
      _id: string;
      locationId: string;
      roomNumber: string;
    };
    locationId: string;
    branchId: string;
    _id: string;
  }>;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  language: string;
  numberOfDependents: number;
  medic: string;
  address: string;
  emergencyContacts: Array<{
    fullName: string;
    relationship: string;
    phoneNumber: string;
    _id: string;
  }>;
  medicalCondition: string;
  allergies: string;
  currentMedications: string;
  additionalNotes: string;
  dietaryRequirements: string[];
  caseWorker: string;
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
    transfer: any | null;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  portNumber: string;
  dependants: any[];
}

export interface InTransitUser {
  id: string;
  name: string;
  email: string;
  age: number;
  nationality: string;
  gender: string;
  expectedArrival: string;
  expectedTime: string;
  destinationBranch: string;
  dateOfBirth: any;
  language: string;
  assignedRoom: string;
  assignedLocation: string;
  transportMethod: string;
  referringAgency: string;
  caseWorker: string;
  contactNumber: string;
  emergencyContact: any;
  specialRequirements: string[];
  medicalCondition: string;
  allergies: string;
  currentMedications: string;
  status: string;
  estimatedDuration: string;
  lastUpdate: string;
  documents: string[];
  avatar: string;
}

export const useInTransitUsers = () => {
  return useQuery<Guest[]>({
    queryKey: ["inTransitUsers"],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: Guest[];
      }>("/su-removal/intransit");
      return response.data.data;
    },
  });
};
