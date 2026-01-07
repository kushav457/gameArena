import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import Layout from "@/components/common/layout/layoutComponent";
import { Button } from "@/components/common/ui/uiComponents";

export default function FlappyBirdPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Flappy Bird | CyberArena</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: { xs: "16px", md: "24px" } }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Typography
              variant="h4"
              className="gaming-title"
              sx={{
                fontFamily: "'Jersey 10', sans-serif",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: (theme) => theme.palette.text.primary,
              }}
            >
              Flappy Bird
            </Typography>
            <Button label="Back" variant="secondary" onClick={() => router.push("/")} />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: { xs: "70vh", md: "78vh" },
              borderRadius: "12px",
              overflow: "hidden",
              border: (theme) =>
                `1px solid ${theme.palette.mode === "dark" ? "rgba(56,189,248,0.25)" : "rgba(56,189,248,0.35)"}`,
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <iframe
              title="Flappy Bird"
              src="/game/flappyBird/index.html"
              style={{ width: "100%", height: "100%", border: "0" }}
              allow="autoplay; fullscreen"
            />
          </Box>
        </Box>
      </Layout>
    </>
  );
}


