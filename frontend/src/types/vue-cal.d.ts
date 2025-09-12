declare module 'vue-cal' {
  import { DefineComponent } from 'vue'
  
  export interface CalendarEvent {
    id?: string | number
    start: string | Date
    end?: string | Date
    title: string
    content?: string
    class?: string
    style?: Record<string, any>
    allDay?: boolean
  }

  export interface VueCalProps {
    events?: CalendarEvent[]
    selectedDate?: string | Date
    activeView?: 'years' | 'year' | 'month' | 'week' | 'day'
    startWeekOnSunday?: boolean
    hideViewSelector?: boolean
    clickToNavigate?: boolean
    dblclickToNavigate?: boolean
    disableViews?: string[]
    defaultView?: string
    minDate?: string | Date
    maxDate?: string | Date
    locale?: string
  }

  const VueCal: DefineComponent<VueCalProps, {}, any>
  export default VueCal
  
  export { CalendarEvent }
}
