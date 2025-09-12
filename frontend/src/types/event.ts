export interface Event {
  id: number;
  name: string;
  location?: string;
  description?: string;
  event_type_id?: number;
  target_audience_id?: number;
  created_at?: string;
  updated_at?: string;
  EventsCategories?: EventCategory;
  TargetAudiences?: TargetAudience;
  EventDates: EventDate[];
  attendees?: EventAttendee[];
}

export interface EventDate {
  id: number;
  date: string;
  event_id: number;
}

export interface EventCategory {
  id: number;
  name: string;
}

export interface TargetAudience {
  id: number;
  name: string;
}

export interface EventAttendee {
  id: number;
  event_id: number;
  user_id: number;
  status: 'registered' | 'attended' | 'cancelled';
  registered_at: string;
}

export interface CreateEventData {
  name: string;
  location?: string;
  description?: string;
  event_type_id?: number;
  target_audience_id?: number;
  dates: { date: string }[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end?: Date;
  description?: string;
  location?: string;
  category?: string;
  color?: string;
  attendees?: number;
}
