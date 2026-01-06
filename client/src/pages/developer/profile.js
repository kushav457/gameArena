import Head from "next/head";
import { useEffect } from "react";
import { userAPI } from "@/services/api";
import DeveloperLayout from "@/components/developer/DeveloperLayout";
import {
  ProfilePageContainer,
  ProfilePageTitle,
  ProfileSection,
  AccountInformationForm,
  ChangePasswordForm,
  ProfileToasts,
  useProfileForm,
} from "@/components/common/ProfileComponents";
import { Box } from "@mui/material";

export default function DeveloperProfile() {
  const { userData, setUserData, passwordData, setPasswordData, error, setError, success, setSuccess, handlePasswordChange } = useProfileForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAPI.getUser();
  
        if (res?.success && res?.data) {
          setUserData({
            name: res.data.name || "",
            email: res.data.email || "",
            age: res.data.age || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch developer profile", err);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <>
      <Head>
        <title>Developer Profile | CyberArena</title>
      </Head>
      <DeveloperLayout>
        <ProfilePageContainer>
          <ProfilePageTitle>Profile Settings</ProfilePageTitle>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <ProfileSection title="Account Information">
              <AccountInformationForm userData={userData} setUserData={setUserData} />
            </ProfileSection>
            <ProfileSection title="Change Password">
              <ChangePasswordForm passwordData={passwordData} setPasswordData={setPasswordData} onSubmit={handlePasswordChange} />
            </ProfileSection>
          </Box>
          <ProfileToasts error={error} success={success} onErrorClose={() => setError(null)} onSuccessClose={() => setSuccess(false)} />
        </ProfilePageContainer>
      </DeveloperLayout>
    </>
  );
}
