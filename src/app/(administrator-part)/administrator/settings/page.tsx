import SettingsPage from "@/features/AdminPart/Settings/component/SettingsPage";

export default function AdministratorSettingsRoute() {
  return <SettingsPage canManageContent={false} />;
}
