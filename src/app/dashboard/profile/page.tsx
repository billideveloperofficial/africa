
import { ProfileForm } from "@/components/dashboard/profile-form";

export default function ProfilePage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Manage Your Profile</h1>
            <p className="text-muted-foreground">This is how brands will see you. Keep it up-to-date!</p>
        </div>
        <ProfileForm />
    </div>
  );
}
