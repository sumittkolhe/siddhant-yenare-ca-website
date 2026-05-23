import {
  FileText,
  Receipt,
  SearchCheck,
  Calculator,
  Building2,
  TrendingUp,
  Gavel,
  HandCoins,
} from 'lucide-react';

export const services = [
  {
    id: 'income-tax',
    icon: FileText,
    title: 'Income Tax Services',
    description: 'ITR filing for individuals, HUFs, firms & companies. Tax planning, assessment representation, and appeal matters handled with precision.',
    features: ['ITR Filing & E-filing', 'Tax Planning & Advisory', 'TDS/TCS Compliance', 'Assessment & Appeals'],
  },
  {
    id: 'gst',
    icon: Receipt,
    title: 'GST Services',
    description: 'End-to-end GST compliance including registrations, monthly/quarterly return filing, refunds, and annual reconciliation.',
    features: ['GST Registration', 'GSTR-1, 3B, 9, 9C Filing', 'E-way Bill Compliance', 'GST Refund & Audit'],
  },
  {
    id: 'audit',
    icon: SearchCheck,
    title: 'Audit & Assurance',
    description: 'Statutory, tax, and internal audits conducted with thoroughness and adherence to ICAI standards.',
    features: ['Statutory Audit', 'Tax Audit (44AB)', 'Internal Audit', 'Bank Audit'],
  },
  {
    id: 'accounting',
    icon: Calculator,
    title: 'Accounting & Bookkeeping',
    description: 'Accurate, technology-driven accounting services that keep your books clean and compliance-ready year-round.',
    features: ['Tally / Busy Accounting', 'Payroll Management', 'Bank Reconciliation', 'MIS Reports'],
  },
  {
    id: 'company',
    icon: Building2,
    title: 'Company & LLP Services',
    description: 'Incorporation, compliance, and annual filing for private limited companies, LLPs, and partnership firms.',
    features: ['Company Incorporation', 'LLP Registration', 'ROC Annual Compliance', 'Director KYC & Changes'],
  },
  {
    id: 'advisory',
    icon: TrendingUp,
    title: 'Business Advisory',
    description: 'Strategic financial guidance for startups and growing businesses — from funding readiness to financial restructuring.',
    features: ['Business Plan & Projections', 'Loan Documentation', 'MSME / Startup Registration', 'Project Finance Advisory'],
  },
  {
    id: 'compliance',
    icon: Gavel,
    title: 'Compliance & Registrations',
    description: 'Hassle-free registrations and compliance management across various regulatory frameworks.',
    features: ['PAN / TAN Registration', 'MSME (Udyam) Registration', 'Import Export Code (IEC)', 'Professional Tax'],
  },
  {
    id: 'wealth',
    icon: HandCoins,
    title: 'Wealth & Investment Advisory',
    description: 'Personalized financial planning and investment advisory to help you grow and protect your wealth.',
    features: ['Investment Planning', 'Capital Gains Advisory', 'NRI Taxation', 'Succession Planning'],
  },
];
