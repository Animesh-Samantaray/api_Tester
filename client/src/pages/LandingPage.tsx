import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Shield,
  FolderOpen,
  History,
  Braces,
  Globe,
  Moon,
  Laptop,
  ArrowRight,
  Check,
  ChevronDown,
  CheckCircle2,
  Star,
  Sparkles,
  Terminal,
  Cpu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleNavClick = (anchorId: string) => {
    const element = document.getElementById(anchorId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Interactive Mockup State
  const [mockMethod, setMockMethod] = useState("GET");
  const [mockUrl, setMockUrl] = useState(
    "https://api.github.com/users/octocat",
  );
  const [mockResponse, setMockResponse] = useState<any>(null);
  const [mockLoading, setMockLoading] = useState(false);
  const [mockStats, setMockStats] = useState({ status: 200, time: 0, size: 0 });

  const triggerMockRequest = () => {
    setMockLoading(true);
    setMockResponse(null);
    setTimeout(() => {
      setMockLoading(false);
      if (mockUrl.includes("octocat")) {
        setMockResponse({
          login: "octocat",
          id: 5832347,
          node_id: "MDQ6VXNlcjU4MzIzNDc=",
          avatar_url: "https://avatars.githubusercontent.com/u/5832347?v=4",
          type: "User",
          name: "The Octocat",
          company: "@github",
          blog: "https://github.blog",
          location: "San Francisco",
          public_repos: 8,
          followers: 3822,
          following: 9,
        });
        setMockStats({ status: 200, time: 84, size: 0.42 });
      } else {
        setMockResponse({
          id: 101,
          title: "Custom API Request",
          success: true,
          message:
            "The request executed successfully on APIHUB Sandbox client.",
        });
        setMockStats({ status: 201, time: 132, size: 0.18 });
      }
    }, 800);
  };

  const features = [
    {
      icon: <Play size={20} />,
      title: "Fast API Testing",
      desc: "Execute requests instantly with auto-completions and visual response panels.",
    },
    {
      icon: <Shield size={20} />,
      title: "Authentication Support",
      desc: "Secure APIs using Bearer Tokens, Basic Auth, or OAuth headers.",
    },
    {
      icon: <FolderOpen size={20} />,
      title: "Request Collections",
      desc: "Organize related endpoints in hierarchical folders for easy maintenance.",
    },
    {
      icon: <History size={20} />,
      title: "Request History",
      desc: "Never lose a request. Look back, filter, and reuse prior queries easily.",
    },
    {
      icon: <Braces size={20} />,
      title: "JSON Formatter",
      desc: "View collapsible, color-coded, and fully formatted JSON response logs.",
    },
    {
      icon: <Globe size={20} />,
      title: "Environment Variables",
      desc: "Switch variables between Local, Staging, and Production instantly using {{key}}.",
    },
    {
      icon: <Moon size={20} />,
      title: "Dark & Light Mode",
      desc: "Rest your eyes. Smooth, persistent themes matching your preferences.",
    },
    {
      icon: <Laptop size={20} />,
      title: "Fully Responsive",
      desc: "Test requests on any device, from full-screen monitors to mobile displays.",
    },
  ];

  const faqs = [
    {
      q: "Is APIHUB completely free to use?",
      a: "Yes! APIHUB is a frontend-centric API tool designed for fast prototyping, debugging, and mock testing. All credentials, history, and variables stay safely in your browser's local storage.",
    },
    {
      q: "How does the Environment Variables system work?",
      a: 'You can define global variables in the Environment Manager. Once defined (e.g. key: "host", value: "https://api.example.com"), you can insert them inside any URL, headers, or body using double curly braces like {{host}}/v1/users.',
    },
    {
      q: "Can I export my request collections?",
      a: "Currently, all collections are saved locally. You can easily manage, edit, and create folders directly within the dashboard. We are currently working on a JSON export/import feature in the next update.",
    },
    {
      q: "Does this send actual requests or only simulated ones?",
      a: 'It does both! When you type a real external URL and click "Send", the application will trigger a real browser-level fetch request and render the true response headers and body. It fallbacks to simulated states for routes requiring CORS-disabled backend access.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div style={{ paddingTop: "70px", position: "relative" }}>
      <div className="hero-glow-bg" />

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 0 60px 0",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div className="container">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "20px",
              background: "hsl(var(--primary) / 0.1)",
              color: "hsl(var(--primary))",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "20px",
              border: "1px solid hsl(var(--primary) / 0.2)",
            }}
          >
            <Sparkles size={14} /> Introducing APIHUB 1.0 — Free Developer Suite
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              marginBottom: "24px",
              maxWidth: "850px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Modern API Testing <br />
            <span className="text-gradient">Platform for Developers</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "hsl(var(--muted-foreground))",
              maxWidth: "600px",
              margin: "0 auto 40px auto",
              lineHeight: 1.6,
            }}
          >
            Streamline your API development workflow with a premium, beautiful
            client. Build requests, manage collections, inspect JSON payloads,
            and swap environments seamlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "60px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="btn-primary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-secondary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}
            >
              Explore Features
            </a>
          </motion.div>

          {/* Interactive Live Mockup Preview */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 80,
              damping: 15,
            }}
            className="glass-panel"
            style={{
              borderRadius: "var(--radius-lg)",
              maxWidth: "900px",
              margin: "0 auto",
              padding: "16px",
              textAlign: "left",
              boxShadow: "var(--shadow-xl)",
              overflow: "hidden",
              position: "relative",
              border: "1px solid var(--glass-border)",
            }}
          >
            {/* Window Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
                borderBottom: "1px solid hsl(var(--border))",
                paddingBottom: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ff5f56",
                    display: "inline-block",
                  }}
                ></span>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ffbd2e",
                    display: "inline-block",
                  }}
                ></span>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#27c93f",
                    display: "inline-block",
                  }}
                ></span>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Terminal size={12} /> Live API Client Mockup
              </div>
              <div style={{ width: "48px" }}></div>
            </div>

            {/* Request Bar */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <select
                value={mockMethod}
                onChange={(e) => setMockMethod(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "hsl(var(--secondary))",
                  color:
                    mockMethod === "GET"
                      ? "#3b82f6"
                      : mockMethod === "POST"
                        ? "#10b981"
                        : "#f59e0b",
                  fontWeight: 700,
                  border: "1px solid hsl(var(--border))",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                type="text"
                value={mockUrl}
                onChange={(e) => setMockUrl(e.target.value)}
                placeholder="https://api.example.com"
                style={{
                  flexGrow: 1,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "hsl(var(--secondary) / 0.5)",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "0.9rem",
                  outline: "none",
                  color: "hsl(var(--foreground))",
                }}
              />
              <button
                onClick={triggerMockRequest}
                className="btn-primary"
                disabled={mockLoading}
                style={{
                  padding: "8px 20px",
                  borderRadius: "var(--radius-md)",
                }}
              >
                {mockLoading ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Tabs & Layout inside mockup */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "16px",
              }}
            >
              {/* Response Panel Mock */}
              <div
                style={{
                  borderRadius: "var(--radius-md)",
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Response Stats */}
                <div
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid hsl(var(--border))",
                    display: "flex",
                    gap: "16px",
                    fontSize: "0.8rem",
                    color: "hsl(var(--muted-foreground))",
                    alignItems: "center",
                  }}
                >
                  <span>Response:</span>
                  {mockResponse ? (
                    <>
                      <span style={{ color: "#10b981", fontWeight: 600 }}>
                        {mockStats.status} OK
                      </span>
                      <span>
                        Time:{" "}
                        <strong style={{ color: "hsl(var(--foreground))" }}>
                          {mockStats.time} ms
                        </strong>
                      </span>
                      <span>
                        Size:{" "}
                        <strong style={{ color: "hsl(var(--foreground))" }}>
                          {mockStats.size} KB
                        </strong>
                      </span>
                    </>
                  ) : (
                    <span>
                      No request sent yet. Click{" "}
                      <strong
                        style={{
                          color: "hsl(var(--primary))",
                          cursor: "pointer",
                        }}
                        onClick={triggerMockRequest}
                      >
                        Send
                      </strong>{" "}
                      to test the sandbox!
                    </span>
                  )}
                </div>

                {/* Response Content */}
                <div
                  style={{
                    padding: "12px",
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: "180px",
                    fontSize: "0.825rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {mockLoading ? (
                    <div
                      style={{
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          ease: "linear",
                          duration: 1,
                        }}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          border: "2px solid hsl(var(--primary))",
                          borderTopColor: "transparent",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "hsl(var(--muted-foreground))",
                        }}
                      >
                        Dispatching simulated sandbox API call...
                      </span>
                    </div>
                  ) : mockResponse ? (
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                      <span className="json-punctuation">{"{"}</span>
                      {Object.entries(mockResponse).map(
                        ([key, val], idx, arr) => (
                          <div key={key} style={{ paddingLeft: "16px" }}>
                            <span className="json-key">"{key}"</span>
                            <span className="json-punctuation">: </span>
                            {typeof val === "string" ? (
                              <span className="json-string">"{val}"</span>
                            ) : typeof val === "number" ? (
                              <span className="json-number">{val}</span>
                            ) : (
                              <span className="json-boolean">
                                {String(val)}
                              </span>
                            )}
                            {idx < arr.length - 1 && (
                              <span className="json-punctuation">,</span>
                            )}
                          </div>
                        ),
                      )}
                      <span className="json-punctuation">{"}"}</span>
                    </pre>
                  ) : (
                    <div
                      style={{
                        color: "hsl(var(--muted-foreground))",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "120px",
                        gap: "6px",
                      }}
                    >
                      <span>Ready to receive response payloads...</span>
                      <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                        Try changing URL or method and click Send.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section
        id="features"
        style={{
          padding: "80px 0",
          borderTop: "1px solid hsl(var(--border))",
          background: "hsl(var(--card) / 0.2)",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                marginBottom: "12px",
              }}
            >
              Fully Packed Developer Dashboard
            </h2>
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              We've engineered everything you need to test, organize, and
              inspect endpoints efficiently in a modern interface.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid-features"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-panel"
                whileHover={{
                  y: -6,
                  borderColor: "hsl(var(--primary) / 0.4)",
                  transition: { duration: 0.15 },
                }}
                style={{
                  padding: "24px",
                  borderRadius: "var(--radius-md)",
                  transition: "border-color var(--transition-fast)",
                }}
              >
                <div
                  style={{
                    color: "hsl(var(--primary))",
                    background: "hsl(var(--primary) / 0.1)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "hsl(var(--muted-foreground))",
                    lineHeight: 1.5,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        style={{ padding: "80px 0", borderTop: "1px solid hsl(var(--border))" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "hsl(var(--primary))",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Cpu size={16} /> Optimized for Speed
              </div>
              <h2
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: "20px",
                }}
              >
                Replace bulky native applications. Load instantly.
              </h2>
              <p
                style={{
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: "24px",
                  lineHeight: 1.6,
                }}
              >
                Unlike legacy API testing apps that weigh hundreds of megabytes
                and require long setups, APIHUB runs instantly inside your
                browser. Build payloads, save workspace environments, and query
                JSON APIs locally or through CORS-compliant integrations without
                the wait.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  "100% frontend security — no credentials sent to any third-party clouds",
                  "Instant environment variables swap and parameter mapping",
                  "Responsive interface built for tablets and laptops alike",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", alignItems: "start", gap: "8px" }}
                  >
                    <div
                      style={{
                        background: "hsl(var(--primary) / 0.1)",
                        color: "hsl(var(--primary))",
                        borderRadius: "50%",
                        padding: "2px",
                        display: "flex",
                      }}
                    >
                      <Check size={14} style={{ padding: "2px" }} />
                    </div>
                    <span style={{ fontSize: "0.925rem", fontWeight: 500 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aesthetic Box */}
            <div
              className="glass-panel"
              style={{
                borderRadius: "var(--radius-lg)",
                padding: "32px",
                border: "1px solid var(--glass-border)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "hsl(var(--primary) / 0.1)",
                  filter: "blur(30px)",
                }}
              ></div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Braces className="text-gradient" /> Workspaces & Collections
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "hsl(var(--muted-foreground))",
                  lineHeight: 1.5,
                }}
              >
                Configure collections of requests for different endpoints.
                Inject dynamic variables like base URLs or tokens securely.
              </p>
              <div
                style={{
                  background: "hsl(var(--secondary) / 0.5)",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid hsl(var(--border))",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                }}
              >
                <div>
                  <span style={{ color: "#8b5cf6" }}>export</span>{" "}
                  <span style={{ color: "#3b82f6" }}>const</span> config = {"{"}
                </div>
                <div style={{ paddingLeft: "16px" }}>
                  env: <span style={{ color: "#ec4899" }}>'Production'</span>,
                </div>
                <div style={{ paddingLeft: "16px" }}>
                  baseUrl:{" "}
                  <span style={{ color: "#10b981" }}>
                    'https://api.linear.app/v1'
                  </span>
                  ,
                </div>
                <div style={{ paddingLeft: "16px" }}>
                  headers: {"{"} Authorization:{" "}
                  <span style={{ color: "#ec4899" }}>'Bearer token'</span> {"}"}
                </div>
                <div>{"};"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid hsl(var(--border))",
          background: "hsl(var(--card) / 0.1)",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                marginBottom: "12px",
              }}
            >
              Loved by Developers Worldwide
            </h2>
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Hear what engineers are saying about their transition to modern
              API setups.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                name: "Sarah Jenkins",
                role: "Staff Frontend Engineer at Vercel",
                text: "APIHUB has replaced all my local electron-based API tools. It loads in a fraction of a second and handles basic auth headers and custom variable replacements flawlessly.",
                avatar:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
              },
              {
                name: "Marcus Vance",
                role: "Full Stack Engineer at Stripe",
                text: "The interface design is simply gorgeous. Toggling light/dark mode feels smooth and the collapsible JSON formatter makes handling large response structures extremely clean.",
                avatar:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
              },
              {
                name: "Chloe Chen",
                role: "Lead DevOps at Linear",
                text: "I love that everything stays locally inside the browser. It gives me peace of mind when testing sensitive keys, and variables change configurations immediately.",
                avatar:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: "24px",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      color: "#fb923c",
                      marginBottom: "12px",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "hsl(var(--foreground))",
                      fontStyle: "italic",
                      marginBottom: "20px",
                      lineHeight: 1.6,
                    }}
                  >
                    "{t.text}"
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                      {t.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Optional but requested) */}
      <section
        id="pricing"
        style={{ padding: "80px 0", borderTop: "1px solid hsl(var(--border))" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                marginBottom: "12px",
              }}
            >
              Simple, transparent developer plans
            </h2>
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Start for free today. Access advanced setups in a single click.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {/* Free Plan */}
            <div
              className="glass-panel"
              style={{
                padding: "32px",
                borderRadius: "var(--radius-lg)",
                width: "340px",
                border: "1px solid var(--glass-border)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  Sandbox Hobby
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "hsl(var(--muted-foreground))",
                    marginBottom: "20px",
                  }}
                >
                  For indie developers exploring API testing.
                </p>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  $0{" "}
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    / forever
                  </span>
                </div>
                <hr
                  style={{
                    border: 0,
                    borderTop: "1px solid hsl(var(--border))",
                    marginBottom: "20px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginBottom: "32px",
                  }}
                >
                  {[
                    "Unlimited HTTP Requests",
                    "Environment variables replacement",
                    "Standard response inspectors",
                    "Local workspace saving",
                  ].map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <CheckCircle2 size={16} className="text-emerald-500" />{" "}
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/signup"
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div
              className="glass-panel"
              style={{
                padding: "32px",
                borderRadius: "var(--radius-lg)",
                width: "340px",
                border: "2px solid hsl(var(--primary))",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: "12px",
                  background: "hsl(var(--primary))",
                  color: "white",
                }}
              >
                POPULAR
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  Pro Suite
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "hsl(var(--muted-foreground))",
                    marginBottom: "20px",
                  }}
                >
                  For professional engineers and teams.
                </p>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  $19{" "}
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    / user / mo
                  </span>
                </div>
                <hr
                  style={{
                    border: 0,
                    borderTop: "1px solid hsl(var(--border))",
                    marginBottom: "20px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginBottom: "32px",
                  }}
                >
                  {[
                    "Everything in Hobby",
                    "Team sharing & workspace sync",
                    "Advanced auth flows (OAuth2)",
                    "Performance charting",
                    "Dedicated priority support",
                  ].map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <CheckCircle2 size={16} className="text-emerald-500" />{" "}
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/signup"
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section
        id="faq"
        style={{
          padding: "80px 0",
          borderTop: "1px solid hsl(var(--border))",
          background: "hsl(var(--card) / 0.15)",
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                marginBottom: "12px",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              Have questions about APIHUB? Find answers below.
            </p>
          </div>

          <div>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="faq-accordion">
                  <button
                    className="faq-trigger"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: "flex" }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="faq-content">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid hsl(var(--border))",
          padding: "60px 0 30px 0",
          background: "hsl(var(--background))",
          fontSize: "0.85rem",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}
              >
                <Terminal size={16} /> <span>APIHUB</span>
              </div>
              <p
                style={{
                  color: "hsl(var(--muted-foreground))",
                  lineHeight: 1.5,
                }}
              >
                A modern client for API requests and testing. Optimized for
                rapid local development.
              </p>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                }}
              >
                Product
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <li>
                  <a
                    href="#features"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#features");
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#pricing");
                    }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#faq");
                    }}
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                }}
              >
                Resources
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#faq");
                    }}
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#faq");
                    }}
                  >
                    Status System
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                }}
              >
                Legal
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <li>
                  <a
                    href="#privacy"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => e.preventDefault()}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                    onClick={(e) => e.preventDefault()}
                  >
                    Cookie Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr
            style={{
              border: 0,
              borderTop: "1px solid hsl(var(--border))",
              marginBottom: "20px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "hsl(var(--muted-foreground))",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span>
              © {new Date().getFullYear()} APIHUB. Made with love for
              developers.
            </span>
            <span>OS Host: Windows Client</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
