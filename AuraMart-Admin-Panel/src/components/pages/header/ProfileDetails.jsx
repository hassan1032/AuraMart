import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Phone, Pencil } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { useAuth } from "../../../context/AuthContext";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { getInitials } from "../../../lib/utils";

const ProfileDetails = () => {
  const { hasPermission } = useAuth();
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", contact: "", profileImage: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.AUTH.GET_ADMIN_PROFILE });
      if (error) { toast.error(error.message || "Failed to load profile"); }
      else if (data?.data) setProfile({ firstName: data.data.firstName || "", lastName: data.data.lastName || "", email: data.data.email || "", contact: data.data.contact || "", profileImage: data.data.profileImage || "" });
      setLoading(false);
    })();
  }, []);

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Details"
        subtitle="Your admin account information"
        breadcrumbs={[{ label: "Account" }, { label: "Profile" }]}
        icon={<User size={20} />}
        action={
          hasPermission("Profile", "edit") && (
            <Link to="/admin/profile/edit">
              <Button icon={<Pencil size={14} />}>Edit Profile</Button>
            </Link>
          )
        }
      />

      <div className="max-w-xl">
        <Card>
          <CardBody>
            {loading ? (
              <div className="flex items-center gap-4">
                <div className="skeleton w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-32 rounded" />
                  <div className="skeleton h-4 w-48 rounded" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 pb-5 border-b border-[#F5F0EA]">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={fullName} className="w-16 h-16 rounded-full object-cover border-2 border-[#EAEAEA]" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#E63946] text-xl font-bold border-2 border-[#EAEAEA]">
                    {getInitials(fullName) || "A"}
                  </div>
                )}
                <div>
                  <p className="text-base font-bold text-[#2B2D42]">{fullName || "Admin"}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Administrator</p>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-3">
              {[
                { icon: User,  label: "First Name",  value: profile.firstName },
                { icon: User,  label: "Last Name",   value: profile.lastName  },
                { icon: Mail,  label: "Email",        value: profile.email    },
                { icon: Phone, label: "Phone",        value: profile.contact  },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-[#F5F0EA] last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium">{label}</p>
                    <p className="text-sm font-medium text-[#2B2D42] mt-0.5">{loading ? "—" : (value || "—")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDetails;
