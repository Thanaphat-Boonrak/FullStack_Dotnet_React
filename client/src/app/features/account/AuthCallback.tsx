import { useNavigate, useSearchParams } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const { fetchGithubToken } = useAccount();
  const code = params.get("code");
  const [loading, setLoading] = useState(true);
  const fetced = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!code || fetced.current) return;
    fetced.current = true;
    fetchGithubToken
      .mutateAsync(code)
      .then(() => {
        navigate("/activities");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [code, fetchGithubToken]);

  if (!code) return <Typography>Problem authenticatinh with GitHub</Typography>;

  return (
    <Paper
      sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        gap: 3,
        maxWidth: "md",
        mx: "auto",
        borderRadius: 3,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
        <GitHub fontSize="large"></GitHub>
        <Typography variant="h4">Logging in with Github</Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography>Problem signin in with github</Typography>
      )}
    </Paper>
  );
}
