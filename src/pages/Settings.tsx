import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Users,
  Database,
  Globe,
  Lock,
  Mail,
  Smartphone,
  Monitor,
  Palette,
  Clock,
  Save,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SystemSettings {
  general: {
    companyName: string;
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    weeklyReports: boolean;
    systemAlerts: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
    ipWhitelist: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    retentionPeriod: number;
    cloudStorage: boolean;
  };
  integrations: {
    emailService: string;
    smsProvider: string;
    cloudStorage: string;
    analyticsEnabled: boolean;
  };
}

export default function Settings() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);

  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      companyName: "JD Marc Construction Limited",
      timezone: "Africa/Lagos",
      language: "en",
      dateFormat: "DD/MM/YYYY",
      currency: "NGN",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      systemAlerts: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: false,
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retentionPeriod: 30,
      cloudStorage: true,
    },
    integrations: {
      emailService: "smtp",
      smsProvider: "twilio",
      cloudStorage: "aws",
      analyticsEnabled: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to load settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings loaded successfully");
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error("Only administrators can modify system settings");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setHasChanges(false);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (
    section: keyof SystemSettings,
    key: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7967E] mx-auto mb-4"></div>
          <p className="text-[#142E54] font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="bg-white/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[#142E54] flex items-center gap-2">
                  <SettingsIcon className="h-8 w-8 text-[#A7967E]" />
                  System Settings
                </h1>
                <p className="text-[#A7967E] mt-1">
                  Configure system parameters and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving || !isAdmin}
                className="bg-[#142E54] hover:bg-[#142E54]/90"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="backup"
                    className="flex items-center gap-2"
                  >
                    <Database className="h-4 w-4" />
                    Backup
                  </TabsTrigger>
                  <TabsTrigger
                    value="integrations"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Integrations
                  </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#142E54] mb-4">
                      General Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={settings.general.companyName}
                          onChange={(e) =>
                            updateSetting(
                              "general",
                              "companyName",
                              e.target.value,
                            )
                          }
                          disabled={!isAdmin}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={settings.general.timezone}
                          onValueChange={(value) =>
                            updateSetting("general", "timezone", value)
                          }
                          disabled={!isAdmin}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Africa/Lagos">
                              Africa/Lagos (WAT)
                            </SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">
                              America/New_York (EST)
                            </SelectItem>
                            <SelectItem value="Europe/London">
                              Europe/London (GMT)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={settings.general.language}
                          onValueChange={(value) =>
                            updateSetting("general", "language", value)
                          }
                          disabled={!isAdmin}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={settings.general.currency}
                          onValueChange={(value) =>
                            updateSetting("general", "currency", value)
                          }
                          disabled={!isAdmin}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">
                              Nigerian Naira (₦)
                            </SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">
                              British Pound (£)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#142E54] mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(settings.notifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {key === "emailNotifications" && (
                                <Mail className="h-5 w-5 text-[#A7967E]" />
                              )}
                              {key === "pushNotifications" && (
                                <Bell className="h-5 w-5 text-[#A7967E]" />
                              )}
                              {key === "smsNotifications" && (
                                <Smartphone className="h-5 w-5 text-[#A7967E]" />
                              )}
                              {key === "weeklyReports" && (
                                <Clock className="h-5 w-5 text-[#A7967E]" />
                              )}
                              {key === "systemAlerts" && (
                                <AlertTriangle className="h-5 w-5 text-[#A7967E]" />
                              )}
                              <div>
                                <p className="font-medium text-[#142E54]">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {key === "emailNotifications" &&
                                    "Receive notifications via email"}
                                  {key === "pushNotifications" &&
                                    "Browser push notifications"}
                                  {key === "smsNotifications" &&
                                    "SMS text message alerts"}
                                  {key === "weeklyReports" &&
                                    "Weekly summary reports"}
                                  {key === "systemAlerts" &&
                                    "Critical system alerts"}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) =>
                                updateSetting("notifications", key, checked)
                              }
                              disabled={!isAdmin}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#142E54] mb-4">
                      Security Configuration
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5 text-[#A7967E]" />
                          <div>
                            <p className="font-medium text-[#142E54]">
                              Two-Factor Authentication
                            </p>
                            <p className="text-sm text-gray-600">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.security.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            updateSetting("security", "twoFactorAuth", checked)
                          }
                          disabled={!isAdmin}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">
                            Session Timeout (minutes)
                          </Label>
                          <Input
                            id="sessionTimeout"
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "sessionTimeout",
                                parseInt(e.target.value),
                              )
                            }
                            disabled={!isAdmin}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="passwordExpiry">
                            Password Expiry (days)
                          </Label>
                          <Input
                            id="passwordExpiry"
                            type="number"
                            value={settings.security.passwordExpiry}
                            onChange={(e) =>
                              updateSetting(
                                "security",
                                "passwordExpiry",
                                parseInt(e.target.value),
                              )
                            }
                            disabled={!isAdmin}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Backup Settings */}
                <TabsContent value="backup" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#142E54] mb-4">
                      Backup Configuration
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-[#A7967E]" />
                          <div>
                            <p className="font-medium text-[#142E54]">
                              Automatic Backup
                            </p>
                            <p className="text-sm text-gray-600">
                              Enable scheduled backups
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.backup.autoBackup}
                          onCheckedChange={(checked) =>
                            updateSetting("backup", "autoBackup", checked)
                          }
                          disabled={!isAdmin}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">
                            Backup Frequency
                          </Label>
                          <Select
                            value={settings.backup.backupFrequency}
                            onValueChange={(value) =>
                              updateSetting("backup", "backupFrequency", value)
                            }
                            disabled={!isAdmin}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="retentionPeriod">
                            Retention Period (days)
                          </Label>
                          <Input
                            id="retentionPeriod"
                            type="number"
                            value={settings.backup.retentionPeriod}
                            onChange={(e) =>
                              updateSetting(
                                "backup",
                                "retentionPeriod",
                                parseInt(e.target.value),
                              )
                            }
                            disabled={!isAdmin}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Integration Settings */}
                <TabsContent value="integrations" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#142E54] mb-4">
                      Third-party Integrations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emailService">Email Service</Label>
                        <Select
                          value={settings.integrations.emailService}
                          onValueChange={(value) =>
                            updateSetting("integrations", "emailService", value)
                          }
                          disabled={!isAdmin}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="smtp">SMTP</SelectItem>
                            <SelectItem value="sendgrid">SendGrid</SelectItem>
                            <SelectItem value="mailgun">Mailgun</SelectItem>
                            <SelectItem value="ses">Amazon SES</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cloudStorage">Cloud Storage</Label>
                        <Select
                          value={settings.integrations.cloudStorage}
                          onValueChange={(value) =>
                            updateSetting("integrations", "cloudStorage", value)
                          }
                          disabled={!isAdmin}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aws">Amazon S3</SelectItem>
                            <SelectItem value="gcp">Google Cloud</SelectItem>
                            <SelectItem value="azure">
                              Microsoft Azure
                            </SelectItem>
                            <SelectItem value="dropbox">Dropbox</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm">
                    You have read-only access to system settings. Contact an
                    administrator to make changes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
