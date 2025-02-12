

export interface EventLog {
  entityId: string;
  entityType: string;
  eventType: "create" | "update" | "delete" | "other";
  eventDetails: string;
  createdAt: Date;

}
