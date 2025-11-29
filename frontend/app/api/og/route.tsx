import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL - all configurable
    const title = searchParams.get("title") || "Portfolio";
    const subtitle = searchParams.get("subtitle") || "Developer Portfolio";
    const author = searchParams.get("author") || "";
    const domain = searchParams.get("domain") || "";
    const theme = searchParams.get("theme") || "default";

    // Theme-based colors
    const themes = {
      default: {
        bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        accent: "#fbbf24",
        text: "#ffffff",
      },
      projects: {
        bg: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
        accent: "#fbbf24",
        text: "#ffffff",
      },
      contact: {
        bg: "linear-gradient(135deg, #0891b2 0%, #6366f1 100%)",
        accent: "#fbbf24",
        text: "#ffffff",
      },
    };

    const selectedTheme =
      themes[theme as keyof typeof themes] || themes.default;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            background: selectedTheme.bg,
            padding: "80px",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {/* Top Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              padding: "16px 32px",
              borderRadius: "50px",
              fontSize: "24px",
              color: selectedTheme.text,
              fontWeight: "600",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            Portfolio
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "900px",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "900",
                color: selectedTheme.text,
                lineHeight: "1.1",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "36px",
                fontWeight: "500",
                color: selectedTheme.accent,
                lineHeight: "1.3",
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Author Info */}
            {(author || domain) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {author && (
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        color: selectedTheme.text,
                      }}
                    >
                      {author}
                    </div>
                  )}
                  {domain && (
                    <div
                      style={{
                        fontSize: "22px",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {domain}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
