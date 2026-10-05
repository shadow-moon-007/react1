export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerId: string;
  subDepartmentIds: string[];
  mission: string;
  charter: string;
  strategicPillars: {
    title: string;
    description: string;
  }[];
}

export interface SubDepartment {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  description: string;
  managerId: string;
  teamIds: string[];
  responsibilities: string[];
  primaryFocus: string;
}

export interface Team {
  id: string;
  subDepartmentId: string;
  name: string;
  code: string;
  description: string;
  managerId: string;
  memberIds: string[];
  responsibilities: string[];
  keyAreas: string[];
  techStack?: string[];
  contactInfo: {
    channel: string;
    email: string;
    officeLocation: string;
    onCallRotation: string;
  };
  resourceIds?: string[];
}

export interface Employee {
  id: string;
  name: string;
  title: string;
  role: 'GBS Vice President' | 'Sub-Department Director' | 'Team Manager' | 'Operations Manager' | 'Solutions Architect' | 'Lead Specialist' | 'Team Member';
  email: string;
  phone?: string;
  location: string;
  subDepartmentId: string;
  teamId?: string;
  managerId?: string;
  bio?: string;
  skills: string[];
  initials: string;
}

export type ResourceCategory =
  | 'HR'
  | 'IT'
  | 'Policies'
  | 'Training'
  | 'Benefits'
  | 'Forms'
  | 'Processes'
  | 'Internal Tools';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  applicableTo: 'All Teams' | string; // e.g. 'All Teams', subdepartment ID, or team ID
  subDepartmentId?: string;
  teamId?: string;
  url: string;
  lastUpdated: string;
  format: 'PDF' | 'Portal' | 'Doc' | 'Guide' | 'Tool' | 'Policy';
}

export interface QuickLink {
  id: string;
  title: string;
  description: string;
  category: 'Enterprise Suite' | 'Business Operations' | 'Transformation Tools' | 'Productivity' | 'Support';
  url: string;
  scope: 'Entire GBS' | 'GBS-BTS' | 'GPS-BO';
  subDepartmentId?: string;
  teamId?: string;
  iconName: string;
  isExternal?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: {
    name: string;
    title: string;
    avatarInitials: string;
  };
  publishedDate: string;
  category: 'Operations' | 'Transformation' | 'Strategic' | 'Process Excellence' | 'Systems & Tools' | 'People & Culture';
  audience: 'Entire GBS' | 'GBS-BTS' | 'GPS-BO' | 'Specific Team';
  subDepartmentId?: string;
  teamId?: string;
  status: 'Published' | 'Draft' | 'Archived';
  priority: 'High' | 'Normal';
  readTime: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'Operating Model' | 'Standard Operating Procedure' | 'Policy' | 'Process Map' | 'SLA Agreement' | 'Onboarding Guide';
  category: 'Operations' | 'Transformation' | 'Governance' | 'Finance' | 'Procurement' | 'IT & Security';
  owner: string;
  lastUpdated: string;
  scope: 'Department' | 'Sub-Department' | 'Team';
  subDepartmentId?: string;
  teamId?: string;
  fileSize: string;
  version: string;
}

export interface DepartmentEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'Town Hall' | 'Process Review' | 'Innovation Showcase' | 'Training Session' | 'Sprint Review';
  organizer: string;
  subDepartmentId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  subDepartment: string;
  team: string;
  role: 'Department Admin' | 'Team Manager' | 'Team Member';
  tenantId: string;
  objectId: string;
  initials: string;
}
