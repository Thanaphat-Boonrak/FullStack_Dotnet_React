import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import ProfilePhoto from "./ProfilePhoto";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowing from "./ProfileFollowing";
import ProfileActivities from "./ProfileActivities";

export default function ProfileContent() {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, value: number) => {
    setValue(value);
  };
  const tabContent = [
    { label: "About", content: <ProfileAbout /> },
    { label: "Photos", content: <ProfilePhoto></ProfilePhoto> },

    { label: "Events", content: <ProfileActivities /> },

    {
      label: "Followers",
      content: <ProfileFollowing activeTab={value} />,
    },

    { label: "Following", content: <ProfileFollowing activeTab={value} /> },
  ];
  return (
    <Box
      component={Paper}
      mt={2}
      p={3}
      elevation={3}
      height={500}
      sx={{ display: "flex", alignItems: "flex-start", borderRadius: 3 }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        sx={{ borderRight: 1, height: 450, minWidth: 200 }}
        onChange={handleChange}
      >
        {tabContent.map((tab, index) => (
          <Tab key={index} label={tab.label}></Tab>
        ))}
      </Tabs>
      <Box sx={{ flexGrow: "1", p: 3 }}>{tabContent[value].content}</Box>
    </Box>
  );
}
