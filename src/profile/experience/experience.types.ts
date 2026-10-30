export interface ExperienceRecord {
  id: number;
  company: string;
  position: string;

  startDate: Date;
  endDate: Date | null;
  achievements: string[];

  profileId: number;
}
