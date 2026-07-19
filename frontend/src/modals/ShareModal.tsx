import { useEffect, useState } from "react";
import { api } from "../api/client.ts";
import type { Prayer } from "../types";
import type { User } from "../auth/AuthContext";
import "./loginmodal.css";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: Prayer;
  onVisibilityChange?: (isPublic: boolean) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  prayer,
  onVisibilityChange,
}: ShareModalProps) {
  const [isPublic, setIsPublic] = useState(prayer.is_public);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<"menu" | "people">("menu");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsPublic(prayer.is_public);
    }
  }, [isOpen, prayer]);

  async function copyPrivateLink() {
    try {
      setLoading(true);

      const data = await api(`/api/network/${prayer.id}/share-link`, {
        method: "POST",
      });

      await navigator.clipboard.writeText(data.url);

      alert("Private link copied!");
    } catch (err) {
      console.error(err);
      alert("Unable to copy link.");
    } finally {
      setLoading(false);
    }
  }

  async function togglePublic() {
    try {
      setLoading(true);

      const newValue = !isPublic;

      await api(`/api/network/${prayer.id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_public: newValue,
        }),
      });

      setIsPublic(newValue);
      onVisibilityChange?.(newValue);
    } catch (err) {
      console.error(err);
      alert("Unable to update visibility.");
    } finally {
      setLoading(false);
    }
  }

  async function nativeShare() {
    try {
      setLoading(true);

      const data = await api(`/api/network/${prayer.id}/share-link`, {
        method: "POST",
      });

      if (navigator.share) {
        await navigator.share({
          title: "Prayer",
          text: "Someone shared a prayer with you.",
          url: data.url,
        });
      } else {
        await navigator.clipboard.writeText(data.url);
        alert("Link copied!");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to share prayer.");
    } finally {
      setLoading(false);
    }
  }

  async function searchUsers() {
    const data = await api(`/api/network/search?q=${search}`);

    setUsers(data);
  }

  async function shareWithPerson() {
    if (!selectedUser) return;

    await api(`/api/network/${prayer.id}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: selectedUser,
      }),
    });

    alert("Prayer shared!");

    onClose();
  }

  function openPeople() {
    setMode("people");
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Share Prayer</h2>

        <button onClick={copyPrivateLink} disabled={loading}>
          🔗 Copy private link
        </button>

        <button onClick={togglePublic} disabled={loading}>
          {isPublic ? "🔒 Make private" : "🌎 Make public"}
        </button>

        <button onClick={openPeople} disabled={loading}>
          👥 Share with person
        </button>

        <button onClick={nativeShare} disabled={loading}>
          📤 More sharing options
        </button>

        <button className="cancel" onClick={onClose} disabled={loading}>
          Cancel
        </button>

        {mode === "people" && (
          <>
            <h2>Share with</h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
            />

            <button onClick={searchUsers}>Search</button>

            {users.map((user) => (
              <button key={user.id} onClick={() => setSelectedUser(user.id)}>
                {user.name}
              </button>
            ))}

            <button disabled={!selectedUser} onClick={shareWithPerson}>
              Share
            </button>
          </>
        )}
      </div>
    </div>
  );
}
