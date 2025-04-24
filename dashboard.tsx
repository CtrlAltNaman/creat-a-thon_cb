"use client"

import { useState, useEffect } from "react"
import { Bell, BellRing, Info, Shield, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DeviceDetailsPage from "@/components/DeviceDetailsPage"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [activeAlerts, setActiveAlerts] = useState(0)
  const [temperature, setTemperature] = useState(24)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<{
    name: string
    type: string
    status: string
  } | null>(null)

  type StatusType = "normal" | "warning" | "critical"

  // Get location and fetch weather data
  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        if (data.main && data.main.temp) {
          setTemperature(Math.round(data.main.temp));
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLocationError('Failed to fetch weather data');
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get location');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  // Get battery level
  useEffect(() => {
    const getBatteryLevel = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));

          // Listen for battery level changes
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        }
      } catch (error) {
        console.error('Battery API not supported:', error);
      }
    };

    getBatteryLevel();
  }, []);

  // Only start simulation for battery
  useEffect(() => {
    setMounted(true);
    
    const interval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(0, Math.min(100, prev - 0.1)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Determine status based on battery level
  const getStatus = (level: number): StatusType => {
    if (level < 20) return "critical"
    if (level < 50) return "warning"
    return "normal"
  }

  const status: StatusType = getStatus(batteryLevel)

  // Show loading state or initial values before client-side hydration
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading dashboard...</div>
          <div className="text-sm text-muted-foreground">Please wait while we fetch the latest data</div>
        </div>
      </div>
    )
  }

  // If a device is selected, show the device details page
  if (selectedDevice) {
    return (
      <DeviceDetailsPage
        device={selectedDevice}
        onBack={() => setSelectedDevice(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-slate-100/50 dark:from-gray-900/50 dark:to-slate-800/50">
      <div className="min-h-screen bg-muted/30">
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold tracking-tight">Fire Alarm Dashboard</h1>
                </div>
                <p className="text-muted-foreground">Monitor and manage your building's fire safety system</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </header>

            {status === "critical" && (
              <Alert variant="destructive" className="animate-pulse">
                <BellRing className="h-5 w-5" />
                <AlertTitle className="font-bold">EMERGENCY: Fire Detected!</AlertTitle>
                <AlertDescription>
                  High smoke levels detected in Zone 1. Please evacuate immediately and call emergency services.
                </AlertDescription>
              </Alert>
            )}

            {status === "warning" && (
              <Alert variant="default" className="border-orange-500 text-orange-500">
                <Info className="h-5 w-5" />
                <AlertTitle className="font-bold">Warning: Elevated Smoke Levels</AlertTitle>
                <AlertDescription>
                  Smoke levels are above normal in Zone 1. Please investigate immediately.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className={`${status === "critical" ? "border-red-500 shadow-red-500/20 shadow-lg" : ""}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {status === "normal" ? "Normal" : status === "warning" ? "Warning" : "ALERT"}
                    </div>
                    <Badge
                      className={
                        status === "normal"
                          ? "bg-green-500"
                          : status === "warning"
                            ? "bg-orange-500"
                            : "bg-red-500 animate-pulse"
                      }
                    >
                      {activeAlerts > 0 ? `${activeAlerts} Active` : "All Clear"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{temperature}°C</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Real-time local temperature
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Battery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(batteryLevel)}%</div>
                  <Progress
                    value={batteryLevel}
                    className="mt-2"
                    indicatorClassName={
                      batteryLevel < 20 ? "bg-red-500" : batteryLevel < 50 ? "bg-orange-500" : "bg-green-500"
                    }
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    System battery level
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button variant="destructive" className="w-full">
                    <BellRing className="mr-2 h-4 w-4" />
                    Test Alarm
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    System Check
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bell className="mr-2 h-4 w-4" />
                    Silence Alarm
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="zones">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="zones">Zones</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="zones" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Zone 1 - Main Office", status: status, devices: 4 },
                    { name: "Zone 2 - Conference Room", status: "normal", devices: 2 },
                    { name: "Zone 3 - Kitchen", status: "normal", devices: 3 },
                    { name: "Zone 4 - Hallway", status: "offline", devices: 2 },
                    { name: "Zone 5 - Server Room", status: "normal", devices: 5 },
                    { name: "Zone 6 - Reception", status: "normal", devices: 3 },
                  ].map((zone, i) => (
                    <Card key={i} className={zone.status === "critical" ? "border-red-500" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium">{zone.name}</CardTitle>
                          <Badge
                            className={
                              zone.status === "normal"
                                ? "bg-green-500"
                                : zone.status === "warning"
                                  ? "bg-orange-500"
                                  : zone.status === "critical"
                                    ? "bg-red-500 animate-pulse"
                                    : "bg-gray-500"
                            }
                          >
                            {zone.status === "offline"
                              ? "Offline"
                              : zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">{zone.devices} devices connected</div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="devices" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Smoke Detector - Main Office", type: "smoke", status: status },
                    { name: "Heat Sensor - Conference Room", type: "heat", status: "normal" },
                    { name: "Smoke Detector - Kitchen", type: "smoke", status: "normal" },
                    { name: "Sprinkler System - Hallway", type: "sprinkler", status: "offline" },
                    { name: "CO Detector - Server Room", type: "co", status: "normal" },
                    { name: "Alarm Panel - Reception", type: "panel", status: "normal" },
                  ].map((device, i) => (
                    <Card key={i} className={device.status === "critical" ? "border-red-500" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
                          <Badge
                            className={
                              device.status === "normal"
                                ? "bg-green-500"
                                : device.status === "warning"
                                  ? "bg-orange-500"
                                  : device.status === "critical"
                                    ? "bg-red-500 animate-pulse"
                                    : "bg-gray-500"
                            }
                          >
                            {device.status === "offline"
                              ? "Offline"
                              : device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {device.type.charAt(0).toUpperCase() + device.type.slice(1)} Detector
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">Last checked: 2 minutes ago</div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setSelectedDevice(device)}
                        >
                          View Device
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Alert History</CardTitle>
                    <CardDescription>Recent alerts and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { time: "10:23 AM", message: "Smoke level above threshold in Zone 1", level: "warning" },
                        { time: "09:45 AM", message: "System test completed successfully", level: "info" },
                        {
                          time: "Yesterday, 6:12 PM",
                          message: "Battery level low on Zone 4 detector",
                          level: "warning",
                        },
                        { time: "Yesterday, 3:30 PM", message: "Scheduled maintenance completed", level: "info" },
                        { time: "2 days ago", message: "Fire alarm triggered in Zone 3", level: "critical" },
                      ].map((alert, i) => (
                        <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div
                            className={`mt-0.5 h-2 w-2 rounded-full ${
                              alert.level === "critical"
                                ? "bg-red-500"
                                : alert.level === "warning"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <div className="grid gap-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">{alert.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-xl">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center justify-between border-r pr-4">
                    <div>
                      <h3 className="font-semibold">Fire Department</h3>
                      <p className="text-sm text-muted-foreground">Emergency Response</p>
                    </div>
                    <Button variant="destructive" size="sm" className="w-24">
                      Call Now
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-r pr-4">
                    <div>
                      <h3 className="font-semibold">Building Security</h3>
                      <p className="text-sm text-muted-foreground">24/7 Support</p>
                    </div>
                    <Button variant="secondary" size="sm" className="w-24">
                      Call
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">System Maintenance</h3>
                      <p className="text-sm text-muted-foreground">Technical Support</p>
                    </div>
                    <Button variant="secondary" size="sm" className="w-24">
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
