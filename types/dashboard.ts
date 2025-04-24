export type StatusType = "normal" | "warning" | "critical" | "offline"

export interface Device {
  name: string
  type: "smoke" | "heat" | "sprinkler" | "co" | "panel"
  status: StatusType
}

export interface Zone {
  name: string
  status: StatusType
  devices: number
}

export interface AlertHistory {
  time: string
  message: string
  level: "info" | "warning" | "critical"
}

export interface EmergencyContact {
  title: string
  description: string
  buttonText: string
  variant: "destructive" | "secondary"
} 