import {
  Department,
  SubDepartment,
  Team,
  Employee,
  Announcement,
  ResourceItem,
  QuickLink,
  DocumentItem,
  DepartmentEvent,
} from '../types';
import {
  initialDepartment,
  initialSubDepartments,
  initialTeams,
  initialEmployees,
  initialAnnouncements,
  initialQuickLinks,
  initialResources,
  initialDocuments,
  initialEvents,
} from './mockData';

// In-memory working copy for POC interaction and CMS modifications
class IntranetStore {
  private department: Department = { ...initialDepartment };
  private subDepartments: SubDepartment[] = [...initialSubDepartments];
  private teams: Team[] = [...initialTeams];
  private employees: Employee[] = [...initialEmployees];
  private announcements: Announcement[] = [...initialAnnouncements];
  private quickLinks: QuickLink[] = [...initialQuickLinks];
  private resources: ResourceItem[] = [...initialResources];
  private documents: DocumentItem[] = [...initialDocuments];
  private events: DepartmentEvent[] = [...initialEvents];
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Read Operations ---
  async getDepartment(): Promise<Department> {
    return { ...this.department };
  }

  async getSubDepartments(): Promise<SubDepartment[]> {
    return [...this.subDepartments];
  }

  async getSubDepartment(id: string): Promise<SubDepartment | undefined> {
    return this.subDepartments.find((sd) => sd.id === id);
  }

  async getTeams(subDepartmentId?: string): Promise<Team[]> {
    if (subDepartmentId) {
      return this.teams.filter((t) => t.subDepartmentId === subDepartmentId);
    }
    return [...this.teams];
  }

  async getTeam(id: string): Promise<Team | undefined> {
    return this.teams.find((t) => t.id === id);
  }

  async getEmployees(filter?: {
    subDepartmentId?: string;
    teamId?: string;
    role?: string;
  }): Promise<Employee[]> {
    let result = [...this.employees];
    if (filter?.subDepartmentId) {
      result = result.filter((e) => e.subDepartmentId === filter.subDepartmentId);
    }
    if (filter?.teamId) {
      result = result.filter((e) => e.teamId === filter.teamId);
    }
    if (filter?.role) {
      result = result.filter((e) => e.role === filter.role);
    }
    return result;
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.find((e) => e.id === id);
  }

  async getAnnouncements(audience?: string): Promise<Announcement[]> {
    if (audience && audience !== 'All') {
      return this.announcements.filter((a) => a.audience === audience || a.audience === 'Entire GBS');
    }
    return [...this.announcements];
  }

  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    return this.announcements.find((a) => a.id === id);
  }

  async getResources(category?: string, subDepartmentId?: string): Promise<ResourceItem[]> {
    let res = [...this.resources];
    if (category && category !== 'All') {
      res = res.filter((r) => r.category === category);
    }
    if (subDepartmentId && subDepartmentId !== 'All') {
      res = res.filter((r) => r.applicableTo === 'All Teams' || r.subDepartmentId === subDepartmentId);
    }
    return res;
  }

  async getQuickLinks(category?: string): Promise<QuickLink[]> {
    if (category && category !== 'All') {
      return this.quickLinks.filter((q) => q.category === category);
    }
    return [...this.quickLinks];
  }

  async getDocuments(category?: string, subDepartmentId?: string): Promise<DocumentItem[]> {
    let docs = [...this.documents];
    if (category && category !== 'All') {
      docs = docs.filter((d) => d.category === category);
    }
    if (subDepartmentId && subDepartmentId !== 'All') {
      docs = docs.filter((d) => d.scope === 'Department' || d.subDepartmentId === subDepartmentId);
    }
    return docs;
  }

  async getEvents(): Promise<DepartmentEvent[]> {
    return [...this.events];
  }

  // --- CMS / Admin Mutations (POC State Simulation) ---
  async addTeam(newTeamData: Omit<Team, 'id'>): Promise<Team> {
    const id = `team-${Date.now().toString().slice(-5)}`;
    const team: Team = { ...newTeamData, id };
    this.teams.push(team);

    // Update parent subdepartment
    const subDept = this.subDepartments.find((sd) => sd.id === team.subDepartmentId);
    if (subDept && !subDept.teamIds.includes(id)) {
      subDept.teamIds.push(id);
    }

    this.notify();
    return team;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | null> {
    const index = this.teams.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.teams[index] = { ...this.teams[index], ...updates };
    this.notify();
    return this.teams[index];
  }

  async updateManager(teamId: string, managerId: string): Promise<boolean> {
    const team = this.teams.find((t) => t.id === teamId);
    if (!team) return false;
    team.managerId = managerId;
    this.notify();
    return true;
  }

  async createAnnouncement(data: Omit<Announcement, 'id'>): Promise<Announcement> {
    const id = `ann-${Date.now().toString().slice(-4)}`;
    const announcement: Announcement = { ...data, id };
    this.announcements.unshift(announcement);
    this.notify();
    return announcement;
  }

  async updateResource(id: string, updates: Partial<ResourceItem>): Promise<ResourceItem | null> {
    const index = this.resources.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.resources[index] = { ...this.resources[index], ...updates };
    this.notify();
    return this.resources[index];
  }

  async addResource(data: Omit<ResourceItem, 'id'>): Promise<ResourceItem> {
    const id = `res-${Date.now().toString().slice(-4)}`;
    const res: ResourceItem = { ...data, id };
    this.resources.unshift(res);
    this.notify();
    return res;
  }

  async addQuickLink(data: Omit<QuickLink, 'id'>): Promise<QuickLink> {
    const id = `ql-${Date.now().toString().slice(-4)}`;
    const ql: QuickLink = { ...data, id };
    this.quickLinks.push(ql);
    this.notify();
    return ql;
  }

  async addDocument(data: Omit<DocumentItem, 'id'>): Promise<DocumentItem> {
    const id = `doc-${Date.now().toString().slice(-4)}`;
    const doc: DocumentItem = { ...data, id };
    this.documents.unshift(doc);
    this.notify();
    return doc;
  }

  // Search across entire intranet
  async globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { teams: [], employees: [], resources: [], announcements: [], documents: [] };

    const teams = this.teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.responsibilities.some((r) => r.toLowerCase().includes(q))
    );

    const employees = this.employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q)) ||
        e.email.toLowerCase().includes(q)
    );

    const resources = this.resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );

    const announcements = this.announcements.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );

    const documents = this.documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    );

    return { teams, employees, resources, announcements, documents };
  }
}

export const intranetService = new IntranetStore();
