'use client';

import { useState } from "react";
import { useSessionContext } from "@/context/SessionContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function AccountPage() {
  const { user, updateSession } = useSessionContext();
  const [name, setName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("profile")
      .update({ name })
      .eq("id", user?.id);
    setLoading(false);
    if (error) {
      setError("Failed to update name. Please try again.");
    } else {
      setSuccess(true);
      updateSession();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium mb-1">
          Display Name
        </label>
        <Input
          id="displayName"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button onClick={handleSave} disabled={loading || name.trim() === ""}>
        {loading ? "Saving..." : "Save"}
      </Button>
      {success && <div className="text-green-600 text-sm">Name updated!</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
