import { useState, type ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useProfile } from "../../context/profile-context";
import { Dialog } from "../common/Dialog";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Use 50 characters or fewer"),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(30, "Use 30 characters or fewer")
    .regex(/^[a-zA-Z0-9._]+$/, "Use letters, numbers, periods, or underscores"),
  website: z
    .string()
    .trim()
    .max(200, "Use 200 characters or fewer")
    .refine((value) => value === "" || URL.canParse(value), "Enter a complete URL"),
  bio: z.string().max(150, "Use 150 characters or fewer"),
  avatar: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border-color)",
  color: "var(--text-primary)",
  outline: "none",
  fontSize: "0.9rem",
};

export function EditProfileModal() {
  const { user, updateUserProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadError, setUploadError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      website: user.website,
      bio: user.bio,
      avatar: user.avatar,
    },
  });
  const avatar = watch("avatar");

  const close = () => {
    const state = location.state;
    const backgroundPath =
      state && typeof state === "object" && "backgroundPath" in state
        ? state.backgroundPath
        : `/${user.username}`;
    navigate(typeof backgroundPath === "string" ? backgroundPath : `/${user.username}`, {
      replace: true,
    });
  };

  const submit = (values: ProfileFormValues) => {
    updateUserProfile(values);
    navigate(`/${values.username}`, { replace: true });
  };

  const handleAvatarFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Choose an image smaller than 5 MB.");
      return;
    }

    setUploadError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setValue("avatar", reader.result, { shouldDirty: true, shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open onClose={close} ariaLabel="Edit profile" panelStyle={{ maxWidth: 520 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div style={{ width: 24 }} />
        <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Edit profile</h2>
        <button
          type="button"
          aria-label="Close profile editor"
          onClick={close}
          className="action-btn"
        >
          <X size={20} />
        </button>
      </header>

      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--bg-secondary)",
            padding: "12px 16px",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src={avatar}
              alt={`${user.username} avatar preview`}
              style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{user.username}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.name}</div>
            </div>
          </div>
          <label className="btn-primary" htmlFor="avatar-upload">
            Change photo
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
            style={{ display: "none" }}
          />
        </div>
        {uploadError && <p className="form-error" role="alert">{uploadError}</p>}

        <label>
          <span className="form-label">Name</span>
          <input type="text" {...register("name")} style={inputStyle} />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </label>

        <label>
          <span className="form-label">Username</span>
          <input type="text" autoCapitalize="none" {...register("username")} style={inputStyle} />
          {errors.username && <span className="form-error">{errors.username.message}</span>}
        </label>

        <label>
          <span className="form-label">Website</span>
          <input type="url" autoCapitalize="none" {...register("website")} style={inputStyle} />
          {errors.website && <span className="form-error">{errors.website.message}</span>}
        </label>

        <label>
          <span className="form-label">Bio</span>
          <textarea
            {...register("bio")}
            style={{ ...inputStyle, height: 80, resize: "none" }}
          />
          {errors.bio && <span className="form-error">{errors.bio.message}</span>}
        </label>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          Save profile
        </button>
      </form>
    </Dialog>
  );
}
