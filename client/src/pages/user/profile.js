import Head from "next/head";
import { useEffect } from "react";
import { userAPI } from "@/services/api";
<<<<<<< HEAD
=======

>>>>>>> bb5d19c1a00e8b4e7ca849d39857508b1d44c067
import UserLayout from "@/components/user/UserLayout";
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

export default function UserProfile() {
  const { userData, setUserData, passwordData, setPasswordData, error, setError, success, setSuccess, loading, userId, setUserId, handleUserUpdate, handlePasswordChange } = useProfileForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAPI.getUser();
  
        if (res?.success && res?.data) {
          setUserId(res.data._id);
          setUserData({
            name: res.data.name || "",
            email: res.data.email || "",
            age: res.data.age || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        setError("Failed to load profile data");
      }
    };
  
    fetchUser();
  }, [setUserId, setUserData, setError]);

  return (
    <>
      <Head>
        <title>User Profile | CyberArena</title>
      </Head>
      <UserLayout>
        <ProfilePageContainer>
          <ProfilePageTitle>Profile Settings</ProfilePageTitle>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <ProfileSection title="Account Information">
              <AccountInformationForm 
                userData={userData} 
                setUserData={setUserData} 
                onSave={handleUserUpdate}
                loading={loading}
              />
            </ProfileSection>
            <ProfileSection title="Change Password">
              <ChangePasswordForm 
                passwordData={passwordData} 
                setPasswordData={setPasswordData} 
                onSubmit={handlePasswordChange}
                loading={loading}
              />
            </ProfileSection>
          </Box>
          <ProfileToasts error={error} success={success} onErrorClose={() => setError(null)} onSuccessClose={() => setSuccess(false)} />
        </ProfilePageContainer>
      </UserLayout>
    </>
  );
}
