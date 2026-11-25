export type UserRole = 
  | 'super_admin' 
  | 'hr_manager' 
  | 'finance_manager' 
  | 'sales_manager' 
  | 'project_manager' 
  | 'employee' 
  | 'intern';

export type EmploymentType = 'permanent' | 'intern';
export type AccountStatus = 'active' | 'inactive';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  designation: string;
  department: string;
  employmentType: EmploymentType;
  role: UserRole;
  employeeId: string;
  reportingManager?: string;
  photoUrl?: string;
  assignedClientIds?: string[];
  accountStatus: AccountStatus;
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ClientStatus = 
  | 'lead' 
  | 'negotiation' 
  | 'proposal_sent' 
  | 'closed_won' 
  | 'active' 
  | 'on_hold' 
  | 'completed' 
  | 'archived';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface Client {
  id: string;
  clientId: string; // e.g. DD-CLI-2026-0001
  companyName: string;
  clientName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  businessCategory?: string;

  // Project Info
  projectName: string;
  projectDescription?: string;
  selectedPackageId?: string;
  selectedPackageName?: string;
  selectedServices?: string[];
  customServices?: string[];
  projectStartDate?: string;
  expectedDeliveryDate?: string;
  projectStatus: ClientStatus;
  statusChangedAt: string;

  // Financial Info
  quotedAmount: number;
  agreedAmount: number;
  discount?: number;
  applicableTax?: number;
  advancePayment?: number;
  amountPaid: number;
  outstandingAmount: number;
  paymentSchedule?: string;
  paymentStatus: PaymentStatus;

  // Assignments
  primaryEmployeeId?: string;
  primaryEmployeeName?: string;
  assignedEmployeeIds?: string[];
  salesRepId?: string;
  accountManagerId?: string;
  internalNotes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ClientAssignment {
  id: string;
  clientId: string;
  clientName: string;
  projectName: string;
  primaryEmployeeId: string;
  primaryEmployeeName: string;
  additionalEmployeeIds: string[];
  department: string;
  salesRepId?: string;
  projectManagerId?: string;
  assignmentDate: string;
  assignmentNotes?: string;
  status: 'active' | 'reassigned' | 'completed';
}

export interface PermanentEmployee {
  id: string;
  employeeId: string; // e.g. DD-EMP-001
  userId?: string;
  fullName: string;
  photoUrl?: string;
  email: string;
  phone: string;
  address?: string;
  designation: string;
  department: string;
  reportingManager?: string;
  dateOfJoining: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  workMode: 'on-site' | 'remote' | 'hybrid';
  ctc: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  probationPeriodMonths?: number;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    holderName: string;
  };
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  employmentStatus: 'active' | 'probation' | 'notice_period' | 'resigned' | 'terminated';
  createdAt: string;
  updatedAt: string;
}

export interface InternRecord {
  id: string;
  internId: string; // e.g. DD-INT-001
  userId?: string;
  fullName: string;
  photoUrl?: string;
  email: string;
  phone: string;
  address?: string;
  collegeName: string;
  universityName?: string;
  course: string;
  department: string;
  semester?: string;
  collegeRollNo?: string;
  internshipRole: string;
  assignedSupervisor: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  internshipMode: 'on-site' | 'remote' | 'hybrid';
  monthlyStipend: number;
  workingHours?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  accountStatus: 'active' | 'completed' | 'extended' | 'terminated';
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 
  | 'agreement' 
  | 'welcome' 
  | 'invoice' 
  | 'quotation' 
  | 'delivery_guide' 
  | 'monthly_report' 
  | 'package_menu' 
  | 'intern_offer' 
  | 'intern_joining' 
  | 'intern_noc' 
  | 'intern_completion'
  | 'intern_experience'
  | 'employee_offer' 
  | 'employee_joining' 
  | 'employee_payslip' 
  | 'intern_stipend' 
  | 'custom';

export type DocumentStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'final' 
  | 'shared' 
  | 'superseded' 
  | 'archived';

export interface DocumentRecord {
  id: string;
  documentNumber: string; // e.g. DD-AGR-2026-0001
  documentType: DocumentType;
  title: string;
  clientId?: string;
  clientName?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  assignedEmployeeIds?: string[];
  templateId?: string;
  templateVersion?: string;
  data: Record<string, any>;
  status: DocumentStatus;
  pdfUrl?: string;
  storagePath?: string;
  versionNumber: number;
  createdBy: string;
  createdByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  sharedAt?: string;
  sharedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: string;
  code: string; // e.g. OPT-01
  name: string;
  category: 'Web Architecture' | 'Mobile App Ecosystems' | 'Ongoing Care & Growth' | 'Custom';
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: string;
  billingType: 'one-time' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  minimumPrice?: number;
  priceType: 'fixed' | 'starting_from' | 'custom_quote';
  includedFeatures: string[];
  excludedFeatures?: string[];
  deliverables?: string[];
  deliveryTimeline?: string;
  supportTerms?: string;
  optionalAddons?: { name: string; price: number }[];
  adSpendSeparate?: boolean;
  traditionalAgencyPrice?: string;
  designedFor?: string;
  active: boolean;
  displayOrder: number;
}

export interface CustomPackage {
  id: string;
  clientId: string;
  clientName: string;
  packageName: string;
  basePackageCodes: string[];
  customServices: string[];
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  paymentSchedule?: string;
  customTimeline?: string;
  specialTerms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayslipRecord {
  id: string;
  payslipNumber: string; // e.g. DD-PAY-2026-0001
  employeeId: string;
  employeeName: string;
  userId: string;
  department: string;
  designation: string;
  type: 'employee' | 'intern';
  salaryMonth: string;
  payPeriod: string;
  basicSalary: number;
  allowances: number;
  incentives?: number;
  overtime?: number;
  deductions: number;
  totalEarnings: number;
  netPay: number;
  paymentDate?: string;
  paymentStatus: 'pending' | 'paid';
  remarks?: string;
  createdAt: string;
}

export interface OnboardingTask {
  id: string;
  clientId: string;
  clientName: string;
  closedWonAt: string;
  deadlineAt: string; // closedWonAt + 60 minutes
  status: 'not_started' | 'in_progress' | 'awaiting_approval' | 'ready_to_share' | 'shared' | 'overdue';
  checklist: {
    id: string;
    task: string;
    completed: boolean;
    docId?: string;
    docType?: DocumentType;
  }[];
  documentsPrepared: string[];
  sharedAt?: string;
  sharedBy?: string;
}

export interface CompanySettings {
  id?: string;
  companyName: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  supportEmail: string;
  website: string;
  msmeRegistration: string;
  gstin?: string;
  pan?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankBranch?: string;
  authorizedSignatoryName: string;
  authorizedSignatoryDesignation: string;
  ceoSignatureUrl?: string;
  proprietorStampUrl?: string;
  defaultCurrency: string;
  dateFormat: string;
  pdfBorderGold: boolean;
  pdfDoubleBorder: boolean;
}

export interface ActivityLog {
  id?: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: 'client' | 'employee' | 'intern' | 'document' | 'package' | 'settings' | 'auth' | 'assignment';
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface InternalNotification {
  id?: string;
  recipientId: string; // userId or 'super_admin'
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}
