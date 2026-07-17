import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, AVATAR_PRESETS, DEFAULT_AVATAR } from "../context/AuthContext";
import type { ApiRequest } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { requestService } from "../services/request.service";
import type { RequestPayload } from "../services/request.service";
import { authService } from "../services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Save,
  Trash2,
  FolderPlus,
  History as HistoryIcon,
  Folder,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Play,
  Copy,
  ChevronRight,
  ChevronDown,
  X,
  Server,
  Sun,
  Moon,
  Terminal,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const {
    user,
    logout,
    history,
    collections,
    envVariables,
    stats,
    addToHistory,
    clearHistory,
    createCollection,
    addToCollection,
    deleteCollection,
    updateEnvVariables,
    updateProfile,
    changePassword,
    incrementStats,
  } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredHistory = history.filter((h) =>
    (h.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.url || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigation state: 'tester' | 'collections' | 'history' | 'env' | 'settings'
  const [activeTab, setActiveTab] = useState<
    "tester" | "collections" | "history" | "env" | "settings"
  >("tester");

  // API Tester Panel states
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/todos/1",
  );
  const [headers, setHeaders] = useState<
    { key: string; value: string; active: boolean }[]
  >([{ key: "Accept", value: "application/json", active: true }]);
  const [params, setParams] = useState<
    { key: string; value: string; active: boolean }[]
  >([]);
  const [authType, setAuthType] = useState<"none" | "bearer" | "basic">("none");
  const [bearerToken, setBearerToken] = useState("");
  const [basicUser, setBasicUser] = useState("");
  const [basicPass, setBasicPass] = useState("");
  const [bodyType, setBodyType] = useState<"none" | "json">("none");
  const [requestBody, setRequestBody] = useState(
    '{\n  "title": "New Request",\n  "completed": false\n}',
  );

  // Selected tab inside API Tester request panel
  const [reqOptionTab, setReqOptionTab] = useState<
    "params" | "headers" | "auth" | "body"
  >("params");

  // Response Panel states
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [respTime, setRespTime] = useState(0);
  const [respSize, setRespSize] = useState(0);
  const [respStatus, setRespStatus] = useState<number | null>(null);
  const [respStatusText, setRespStatusText] = useState("");
  const [respHeaders, setRespHeaders] = useState<Record<string, string>>({});
  const [responseTab, setResponseTab] = useState<"body" | "headers">("body");

  // Collapsed states in JSON tree viewer
  const [jsonCollapsed, setJsonCollapsed] = useState<Record<string, boolean>>(
    {},
  );

  // Save request modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveRequestName, setSaveRequestName] = useState("New Request");
  const [saveCollectionId, setSaveCollectionId] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDesc, setNewCollectionDesc] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  // Settings states
  const [settingsName, setSettingsName] = useState(user?.fullName || "");
  const [settingsAvatar, setSettingsAvatar] = useState(
    user?.avatar || AVATAR_PRESETS[0],
  );
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [passUpdating, setPassUpdating] = useState(false);

  // Profile picture upload and Sidebar collapse states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const processImageFile = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("Unsupported file format. Please upload PNG, JPG, JPEG, or WEBP.", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("File is too large. Limit is 10MB.", "error");
      return;
    }

    // Keep actual file for POST request
    setAvatarFile(file);

    // Create instant local URL for fast rendering
    const localUrl = URL.createObjectURL(file);
    setUploadPreview(localUrl);
    showToast("Image selected. Save Details to apply changes.", "info");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleRemoveAvatar = () => {
    setUploadPreview(null);
    setAvatarFile(null);
    setSettingsAvatar("");
    showToast("Avatar scheduled for removal. Save Details to apply changes.", "warning");
  };

  // Update Settings local state if user changes (e.g. from context load)
  useEffect(() => {
    if (user) {
      setSettingsName(user.fullName);
      setSettingsAvatar(user.avatar);
    }
  }, [user]);

  // Sync params input list to URL query params
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // Parse query params from url
    try {
      const urlObj = new URL(
        newUrl.includes("//") ? newUrl : "http://" + newUrl,
      );
      const parsedParams: typeof params = [];
      urlObj.searchParams.forEach((value, key) => {
        parsedParams.push({ key, value, active: true });
      });
      if (parsedParams.length > 0) {
        // Only update if they differ to avoid loops
        setParams(parsedParams);
      }
    } catch (e) {
      // Url is incomplete, skip auto-syncing
    }
  };

  // Compile final url including active params and variable replacements
  const compileRequest = () => {
    let compiledUrl = url;

    // Apply active Environment Variables replacement
    envVariables.forEach((v) => {
      if (v.enabled) {
        const placeholder = `{{${v.key}}}`;
        compiledUrl = compiledUrl.replaceAll(placeholder, v.value);
      }
    });

    // Parse base URL and append active params if not already in query string
    try {
      const urlObj = new URL(
        compiledUrl.includes("//") ? compiledUrl : "https://" + compiledUrl,
      );
      params.forEach((p) => {
        if (p.active && p.key) {
          // If the parameter is not already in the search params
          if (
            !urlObj.searchParams.has(p.key) ||
            urlObj.searchParams.get(p.key) !== p.value
          ) {
            urlObj.searchParams.append(p.key, p.value);
          }
        }
      });
      return urlObj.toString();
    } catch (e) {
      // In case URL is relative or invalid, fall back to variable-replaced string
      return compiledUrl;
    }
  };

  // Dispatch API Call
  const handleSendRequest = async () => {
    const finalUrl = compileRequest();

    // Check validation
    if (!url) {
      showToast("Please specify a URL first", "warning");
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setRespStatus(null);

    showToast("Sending HTTP request...", "info");

    // Build Request Headers
    const requestHeaders: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.active && h.key) {
        // Variable replacement in headers
        let val = h.value;
        envVariables.forEach((env) => {
          if (env.enabled) val = val.replaceAll(`{{${env.key}}}`, env.value);
        });
        requestHeaders[h.key] = val;
      }
    });

    // Apply Authorization headers
    if (authType === "bearer" && bearerToken) {
      let token = bearerToken;
      envVariables.forEach((env) => {
        if (env.enabled) token = token.replaceAll(`{{${env.key}}}`, env.value);
      });
      requestHeaders["Authorization"] = `Bearer ${token}`;
    } else if (authType === "basic" && basicUser && basicPass) {
      const credentials = btoa(`${basicUser}:${basicPass}`);
      requestHeaders["Authorization"] = `Basic ${credentials}`;
    }

    try {
      // Build Auth payload
      let authPayload: any = { type: "None" };
      if (authType === "bearer" && bearerToken) {
        let token = bearerToken;
        envVariables.forEach((env) => {
          if (env.enabled) token = token.replaceAll(`{{${env.key}}}`, env.value);
        });
        authPayload = {
          type: "Bearer",
          token: token
        };
      }

      let parsedBodyToSend: any = {};
      if (
        method !== "GET" &&
        method !== "HEAD" &&
        bodyType === "json" &&
        requestBody
      ) {
        try {
          parsedBodyToSend = JSON.parse(requestBody);
        } catch (e) {
          parsedBodyToSend = requestBody;
        }
      }

      const payload: RequestPayload = {
        method,
        url: finalUrl,
        headers: requestHeaders,
        body: parsedBodyToSend,
        auth: authPayload,
      };

      const response = await requestService.sendRequest(payload);
      const resData = response.data;

      // Extract body text for size calculation
      const bodyText = typeof resData.body === "object" ? JSON.stringify(resData.body) : String(resData.body || "");
      const sizeBytes = new Blob([bodyText]).size;
      const sizeKb = parseFloat((sizeBytes / 1024).toFixed(2));

      // Pretty print JSON body if it's an object or string JSON
      let displayBody = resData.body;
      if (typeof displayBody === "string") {
        try {
          displayBody = JSON.parse(displayBody);
        } catch (e) {
          // Keep as string
        }
      }

      setResponse(displayBody);
      setRespTime(resData.responseTime);
      setRespSize(sizeKb);
      setRespStatus(resData.status);
      setRespStatusText(resData.statusText || "OK");
      setRespHeaders(resData.headers || {});

      // Save request to history context
      const newHistoryRequest: ApiRequest = {
        id: "req-" + Math.random().toString(36).substring(2, 9),
        name: `${method} ${url.split("?")[0].replace("https://", "").replace("http://", "")}`,
        method,
        url,
        headers,
        params,
        bodyType,
        body: requestBody,
        timestamp: Date.now(),
        response: {
          status: resData.status,
          statusText: resData.statusText || "OK",
          time: resData.responseTime,
          size: sizeKb,
          body:
            typeof displayBody === "object"
              ? JSON.stringify(displayBody, null, 2)
              : String(displayBody),
          headers: resData.headers || {},
        },
      };

      addToHistory(newHistoryRequest);
      incrementStats(resData.status >= 200 && resData.status < 400, method);
      showToast(`Request sent: ${resData.status} ${resData.statusText}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to execute request", "error");
      
      const errorResponse = {
        error: "Proxy Request Failed",
        message: err.message || "An error occurred while routing the request through the backend proxy server.",
      };

      setResponse(errorResponse);
      setRespTime(0);
      setRespSize(parseFloat((new Blob([JSON.stringify(errorResponse)]).size / 1024).toFixed(2)));
      setRespStatus(500);
      setRespStatusText("Internal Server Error");
      setRespHeaders({ "content-type": "application/json" });

      // Save request to history context anyway
      const newHistoryRequest: ApiRequest = {
        id: "req-" + Math.random().toString(36).substring(2, 9),
        name: `${method} ${url.replace("https://", "").replace("http://", "").substring(0, 30)}`,
        method,
        url,
        headers,
        params,
        bodyType,
        body: requestBody,
        timestamp: Date.now(),
        response: {
          status: 500,
          statusText: "Proxy Request Failed",
          time: 0,
          size: parseFloat((new Blob([JSON.stringify(errorResponse)]).size / 1024).toFixed(2)),
          body: JSON.stringify(errorResponse, null, 2),
          headers: { "content-type": "application/json" },
        },
      };

      addToHistory(newHistoryRequest);
      incrementStats(false, method);
    } finally {
      setIsLoading(false);
    }
  };

  // Load a request configuration from sidebar history or collections
  const loadRequest = (req: ApiRequest) => {
    setMethod(req.method);
    setUrl(req.url);
    if (req.headers) setHeaders(req.headers);
    if (req.params) setParams(req.params);
    if (req.body) setRequestBody(req.body);
    if (req.bodyType) setBodyType(req.bodyType === "json" ? "json" : "none");

    // Auto load authorization type if detected in headers
    const authHeader = req.headers?.find(
      (h) => h.key.toLowerCase() === "authorization",
    );
    if (authHeader) {
      if (authHeader.value.startsWith("Bearer ")) {
        setAuthType("bearer");
        setBearerToken(authHeader.value.replace("Bearer ", ""));
      } else if (authHeader.value.startsWith("Basic ")) {
        setAuthType("basic");
        try {
          const decoded = atob(authHeader.value.replace("Basic ", "")).split(
            ":",
          );
          setBasicUser(decoded[0] || "");
          setBasicPass(decoded[1] || "");
        } catch (e) {}
      }
    } else {
      setAuthType("none");
    }

    // Load response if available in history item
    if (req.response) {
      try {
        setResponse(JSON.parse(req.response.body));
      } catch (e) {
        setResponse(req.response.body);
      }
      setRespStatus(req.response.status);
      setRespStatusText(req.response.statusText);
      setRespTime(req.response.time);
      setRespSize(req.response.size);
      setRespHeaders(req.response.headers || {});
    } else {
      setResponse(null);
      setRespStatus(null);
    }

    setActiveTab("tester");
    showToast("Loaded request configuration", "info");
  };

  // Saving request handlers
  const handleOpenSaveModal = () => {
    if (!url) {
      showToast("Please specify a URL to save first", "warning");
      return;
    }
    setSaveRequestName(
      `${method} ${url.split("?")[0].replace("https://", "").replace("http://", "")}`,
    );
    if (collections.length > 0) {
      setSaveCollectionId(collections[0].id);
    }
    setShowSaveModal(true);
  };

  const handleSaveRequest = () => {
    if (!saveCollectionId) {
      showToast("Please select or create a collection first", "warning");
      return;
    }

    const compiledReq: ApiRequest = {
      id: "req-" + Math.random().toString(36).substring(2, 9),
      name: saveRequestName || "Saved Request",
      method,
      url,
      headers,
      params,
      bodyType,
      body: requestBody,
      timestamp: Date.now(),
    };

    addToCollection(saveCollectionId, compiledReq);
    setShowSaveModal(false);
    showToast("Request added to collection!", "success");
  };

  const handleCreateCollectionInsideModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName) return;
    createCollection(newCollectionName, newCollectionDesc);
    setNewCollectionName("");
    setNewCollectionDesc("");
    setIsCreatingCollection(false);
    showToast("Collection Created!", "success");
  };

  // Settings & Profile updates
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsName.trim()) {
      showToast("Name cannot be empty", "warning");
      return;
    }
    try {
      let finalAvatarUrl = settingsAvatar;
      if (avatarFile) {
        showToast("Uploading profile image...", "info");
        const uploadRes = await authService.uploadAvatar(avatarFile);
        if (uploadRes.success && uploadRes.avatarUrl) {
          finalAvatarUrl = uploadRes.avatarUrl;
          setSettingsAvatar(finalAvatarUrl);
          setAvatarFile(null);
        } else {
          showToast(uploadRes.message || "Failed to upload avatar", "error");
          return;
        }
      }
      await updateProfile(settingsName, finalAvatarUrl);
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass || !confirmNewPass) {
      showToast("Please fill in all password fields", "warning");
      return;
    }
    if (newPass !== confirmNewPass) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (newPass.length < 6) {
      showToast("Password must be at least 6 characters", "warning");
      return;
    }

    setPassUpdating(true);
    try {
      const res = await changePassword(oldPass, newPass);
      if (res) {
        showToast("Password changed successfully!", "success");
        setOldPass("");
        setNewPass("");
        setConfirmNewPass("");
      }
    } catch (err: any) {
      showToast(err.message || "Error updating password", "error");
    } finally {
      setPassUpdating(false);
    }
  };

  // Helper row managers for headers and params table
  const addHeaderRow = () =>
    setHeaders([...headers, { key: "", value: "", active: true }]);
  const updateHeaderRow = (
    idx: number,
    field: "key" | "value" | "active",
    val: any,
  ) => {
    const next = [...headers];
    next[idx] = { ...next[idx], [field]: val };
    setHeaders(next);
  };
  const deleteHeaderRow = (idx: number) =>
    setHeaders(headers.filter((_, i) => i !== idx));

  const addParamRow = () =>
    setParams([...params, { key: "", value: "", active: true }]);
  const updateParamRow = (
    idx: number,
    field: "key" | "value" | "active",
    val: any,
  ) => {
    const next = [...params];
    next[idx] = { ...next[idx], [field]: val };
    setParams(next);
  };
  const deleteParamRow = (idx: number) =>
    setParams(params.filter((_, i) => i !== idx));

  // JSON Collapsible Node formatter
  const renderJSONNode = (
    val: any,
    label: string = "",
    path: string = "root",
  ): React.ReactNode => {
    const key = label && <><span className="json-key">&quot;{label}&quot;</span><span className="json-punctuation">: </span></>;

    if (val === null)
      return (
        <span className="json-line">
          {key}
          <span className="json-null">null</span>
        </span>
      );
    if (typeof val === "boolean")
      return (
        <span className="json-line">
          {key}
          <span className="json-boolean">{String(val)}</span>
        </span>
      );
    if (typeof val === "number")
      return (
        <span className="json-line">
          {key}
          <span className="json-number">{val}</span>
        </span>
      );
    if (typeof val === "string")
      return (
        <span className="json-line">
          {key}
          <span className="json-string">&quot;{val}&quot;</span>
        </span>
      );

    const isCollapsed = jsonCollapsed[path];
    const isArray = Array.isArray(val);
    const keys = Object.keys(val);

    return (
      <div className="json-node">
        <span
          onClick={() =>
            setJsonCollapsed({ ...jsonCollapsed, [path]: !isCollapsed })
          }
          className="json-toggle"
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setJsonCollapsed({ ...jsonCollapsed, [path]: !isCollapsed });
            }
          }}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          {key}
          <span className="json-punctuation">
            {isArray ? `[${keys.length}]` : `{${keys.length}}`}
          </span>
        </span>

        {!isCollapsed && (
          <div className="json-children">
            {keys.map((k) => (
              <div key={k} className="json-child">
                {renderJSONNode(val[k], k, `${path}.${k}`)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Rendering Helper: API Tester Main Workspace
  const renderApiTester = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
      {/* Request Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "16px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{
            padding: "12px 18px",
            borderRadius: "var(--radius-md)",
            background: "hsl(var(--secondary))",
            color: getMethodColor(method),
            fontWeight: 800,
            border: "1px solid hsl(var(--border))",
            outline: "none",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>

        <div style={{ position: "relative", flexGrow: 1, display: "flex" }}>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Enter request URL (e.g. {{baseUrl}}/todos/1)"
            className="input-field"
            style={{ fontSize: "0.9rem", width: "100%", paddingRight: "120px" }}
          />
          {/* Quick variable compilation preview badge */}
          {url.includes("{{") && (
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "0.7rem",
                fontWeight: 600,
                background: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                padding: "4px 8px",
                borderRadius: "4px",
                pointerEvents: "none",
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={compileRequest()}
            >
              Resolves base...
            </span>
          )}
        </div>

        <button
          onClick={handleSendRequest}
          className="btn-primary"
          disabled={isLoading}
          style={{ padding: "12px 24px" }}
        >
          <Send size={16} /> Send
        </button>

        <button
          onClick={handleOpenSaveModal}
          className="btn-secondary"
          style={{ padding: "12px 16px" }}
          title="Save to Collection"
        >
          <Save size={16} /> Save
        </button>
      </div>

      {/* Tabs configuration */}
      <div
        className="glass-panel"
        style={{
          borderRadius: "var(--radius-md)",
          padding: "16px",
          minHeight: "280px",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid hsl(var(--border))",
            marginBottom: "16px",
            gap: "8px",
          }}
        >
          {[
            { id: "params", label: "Params" },
            { id: "headers", label: "Headers" },
            { id: "auth", label: "Authorization" },
            { id: "body", label: "Body" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setReqOptionTab(t.id as any)}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "none",
                borderBottom:
                  reqOptionTab === t.id
                    ? "2px solid hsl(var(--primary))"
                    : "none",
                color:
                  reqOptionTab === t.id
                    ? "hsl(var(--foreground))"
                    : "hsl(var(--muted-foreground))",
                fontWeight: reqOptionTab === t.id ? 700 : 500,
                cursor: "pointer",
                fontSize: "0.85rem",
                outline: "none",
              }}
            >
              {t.label}
              {t.id === "params" &&
                params.filter((p) => p.active).length > 0 &&
                ` (${params.filter((p) => p.active).length})`}
              {t.id === "headers" &&
                headers.filter((h) => h.active).length > 0 &&
                ` (${headers.filter((h) => h.active).length})`}
              {t.id === "auth" && authType !== "none" && ` (On)`}
            </button>
          ))}
        </div>

        <div style={{ minHeight: "180px" }}>
          {/* Query Params */}
          {reqOptionTab === "params" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  Query Parameters
                </span>
                <button
                  onClick={addParamRow}
                  className="btn-secondary"
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    borderRadius: "4px",
                  }}
                >
                  <Plus size={12} /> Add parameter
                </button>
              </div>
              {params.length === 0 ? (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "hsl(var(--muted-foreground))",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  No query parameters defined. They will be auto-generated here
                  if you append them to the URL search bar.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {params.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={p.active}
                        onChange={(e) =>
                          updateParamRow(idx, "active", e.target.checked)
                        }
                        style={{ accentColor: "hsl(var(--primary))" }}
                      />
                      <input
                        type="text"
                        value={p.key}
                        onChange={(e) =>
                          updateParamRow(idx, "key", e.target.value)
                        }
                        placeholder="Parameter Key"
                        className="input-field"
                        style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                      />
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) =>
                          updateParamRow(idx, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="input-field"
                        style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                      />
                      <button
                        onClick={() => deleteParamRow(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "hsl(var(--destructive))",
                          cursor: "pointer",
                          padding: "6px",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Headers */}
          {reqOptionTab === "headers" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  HTTP Headers
                </span>
                <button
                  onClick={addHeaderRow}
                  className="btn-secondary"
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    borderRadius: "4px",
                  }}
                >
                  <Plus size={12} /> Add header
                </button>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {headers.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={h.active}
                      onChange={(e) =>
                        updateHeaderRow(idx, "active", e.target.checked)
                      }
                      style={{ accentColor: "hsl(var(--primary))" }}
                    />
                    <input
                      type="text"
                      value={h.key}
                      onChange={(e) =>
                        updateHeaderRow(idx, "key", e.target.value)
                      }
                      placeholder="Header Name (e.g. Content-Type)"
                      className="input-field"
                      style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                    />
                    <input
                      type="text"
                      value={h.value}
                      onChange={(e) =>
                        updateHeaderRow(idx, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="input-field"
                      style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                    />
                    <button
                      onClick={() => deleteHeaderRow(idx)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "hsl(var(--destructive))",
                        cursor: "pointer",
                        padding: "6px",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auth */}
          {reqOptionTab === "auth" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "400px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    color: "hsl(var(--muted-foreground))",
                    marginBottom: "6px",
                  }}
                >
                  Authorization Type
                </label>
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value as any)}
                  className="input-field"
                  style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                >
                  <option value="none">No Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </div>

              {authType === "bearer" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: "6px",
                    }}
                  >
                    Token
                  </label>
                  <input
                    type="password"
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    placeholder="Enter token value (accepts {{variables}})"
                    className="input-field"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>
              )}

              {authType === "basic" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        color: "hsl(var(--muted-foreground))",
                        marginBottom: "6px",
                      }}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      value={basicUser}
                      onChange={(e) => setBasicUser(e.target.value)}
                      placeholder="Username"
                      className="input-field"
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        color: "hsl(var(--muted-foreground))",
                        marginBottom: "6px",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={basicPass}
                      onChange={(e) => setBasicPass(e.target.value)}
                      placeholder="Password"
                      className="input-field"
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body Raw JSON */}
          {reqOptionTab === "body" && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "12px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  Body Content Type:
                </span>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    checked={bodyType === "none"}
                    onChange={() => setBodyType("none")}
                    style={{ accentColor: "hsl(var(--primary))" }}
                  />
                  None
                </label>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    checked={bodyType === "json"}
                    onChange={() => setBodyType("json")}
                    style={{ accentColor: "hsl(var(--primary))" }}
                  />
                  JSON (application/json)
                </label>
              </div>

              {bodyType === "json" && (
                <div style={{ position: "relative" }}>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    style={{
                      width: "100%",
                      height: "140px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius-md)",
                      padding: "12px",
                      color: "hsl(var(--foreground))",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "12px",
                      bottom: "12px",
                      fontSize: "0.7rem",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    JSON raw payload
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Response Panel */}
      <div
        className="glass-panel"
        style={{
          borderRadius: "var(--radius-md)",
          padding: "16px",
          minHeight: "300px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid hsl(var(--border))",
            paddingBottom: "12px",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Response</h3>
          {respStatus !== null && (
            <div
              style={{
                display: "flex",
                gap: "16px",
                fontSize: "0.8rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background:
                    respStatus >= 200 && respStatus < 400
                      ? "hsl(142.1, 76.2%, 36.3%, 0.15)"
                      : "hsl(346.8, 77.2%, 49.8%, 0.15)",
                  color:
                    respStatus >= 200 && respStatus < 400
                      ? "#10b981"
                      : "#f43f5e",
                  fontWeight: 700,
                }}
              >
                {respStatus} {respStatusText}
              </span>
              <span>
                Time:{" "}
                <strong style={{ color: "hsl(var(--foreground))" }}>
                  {respTime} ms
                </strong>
              </span>
              <span>
                Size:{" "}
                <strong style={{ color: "hsl(var(--foreground))" }}>
                  {respSize} KB
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Response Tabs */}
        {response ? (
          <div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                borderBottom: "1px solid hsl(var(--border))",
                marginBottom: "12px",
                fontSize: "0.8rem",
              }}
            >
              <button
                onClick={() => setResponseTab("body")}
                style={{
                  padding: "6px 12px",
                  background: "none",
                  border: "none",
                  borderBottom:
                    responseTab === "body"
                      ? "2px solid hsl(var(--primary))"
                      : "none",
                  color:
                    responseTab === "body"
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))",
                  fontWeight: responseTab === "body" ? 700 : 500,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                Body
              </button>
              <button
                onClick={() => setResponseTab("headers")}
                style={{
                  padding: "6px 12px",
                  background: "none",
                  border: "none",
                  borderBottom:
                    responseTab === "headers"
                      ? "2px solid hsl(var(--primary))"
                      : "none",
                  color:
                    responseTab === "headers"
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))",
                  fontWeight: responseTab === "headers" ? 700 : 500,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                Headers ({Object.keys(respHeaders).length})
              </button>
            </div>

            {/* Tab content */}
            {responseTab === "body" ? (
              <div
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  maxHeight: "400px",
                  overflow: "auto",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.825rem",
                  position: "relative",
                }}
              >
                {/* Copy Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(response, null, 2),
                    );
                    showToast("Response body copied to clipboard!", "success");
                  }}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "hsl(var(--secondary))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.7rem",
                  }}
                >
                  <Copy size={12} /> Copy
                </button>

                {/* JSON Tree View */}
                {typeof response === "object" ? (
                  renderJSONNode(response)
                ) : (
                  <pre style={{ whiteSpace: "pre-wrap" }}>{response}</pre>
                )}
              </div>
            ) : (
              /* Headers table */
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.825rem",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid hsl(var(--border))",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      <th style={{ padding: "8px" }}>Header Key</th>
                      <th style={{ padding: "8px" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(respHeaders).map(([k, v]) => (
                      <tr
                        key={k}
                        style={{
                          borderBottom: "1px solid hsl(var(--border) / 0.5)",
                        }}
                      >
                        <td
                          style={{
                            padding: "8px",
                            fontWeight: 600,
                            color: "hsl(var(--primary))",
                          }}
                        >
                          {k}
                        </td>
                        <td style={{ padding: "8px", wordBreak: "break-all" }}>
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              color: "hsl(var(--muted-foreground))",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "220px",
              gap: "8px",
            }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "2.5px solid hsl(var(--primary))",
                    borderTopColor: "transparent",
                  }}
                />
                <span style={{ fontSize: "0.85rem" }}>
                  Waiting for API endpoint response...
                </span>
              </>
            ) : (
              <>
                <Play size={32} style={{ opacity: 0.5 }} />
                <span style={{ fontSize: "0.85rem" }}>
                  Construct a request and click Send to inspect results.
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Rendering Helper: Collections Manager
  const renderCollections = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Request Collections
          </h2>
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.85rem",
            }}
          >
            Groups of saved API requests
          </p>
        </div>
        <button
          onClick={() => {
            setNewCollectionName("New Collection");
            setIsCreatingCollection(true);
          }}
          className="btn-primary"
        >
          <FolderPlus size={16} /> New Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "60px 0",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <Folder size={40} style={{ opacity: 0.4, marginBottom: "16px" }} />
          <h3>No collections created yet</h3>
          <p style={{ fontSize: "0.9rem", marginTop: "6px" }}>
            Group your development routes together to stay organized.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {collections.map((col) => (
            <div
              key={col.id}
              className="glass-panel"
              style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  borderBottom: "1px solid hsl(var(--border))",
                  paddingBottom: "12px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Folder
                      size={18}
                      style={{ color: "hsl(var(--primary))" }}
                    />{" "}
                    {col.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "hsl(var(--muted-foreground))",
                      marginTop: "4px",
                    }}
                  >
                    {col.description || "No description"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    deleteCollection(col.id);
                    showToast("Collection deleted", "info");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "hsl(var(--destructive))",
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {col.requests.length === 0 ? (
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "hsl(var(--muted-foreground))",
                    padding: "16px 0",
                    fontStyle: "italic",
                  }}
                >
                  No requests in this collection. Configure a request in the API
                  Tester and click "Save" to add.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {col.requests.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => loadRequest(req)}
                      className="glass-panel"
                      style={{
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        background: "hsl(var(--secondary) / 0.3)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "hsl(var(--secondary) / 0.6)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "hsl(var(--secondary) / 0.3)")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            color: getMethodColor(req.method),
                            width: "45px",
                            display: "inline-block",
                          }}
                        >
                          {req.method}
                        </span>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                          {req.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "hsl(var(--muted-foreground))",
                            opacity: 0.8,
                          }}
                        >
                          {req.url}
                        </span>
                      </div>
                      <ChevronRight size={16} style={{ opacity: 0.5 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rendering Helper: History panel
  const renderHistory = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Request History
          </h2>
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.85rem",
            }}
          >
            Previous execution records
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              showToast("History cleared", "info");
            }}
            className="btn-secondary"
            style={{
              color: "hsl(var(--destructive))",
              borderColor: "hsl(var(--destructive) / 0.2)",
            }}
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "60px 0",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <HistoryIcon
            size={40}
            style={{ opacity: 0.4, marginBottom: "16px" }}
          />
          <h3>History is empty</h3>
          <p style={{ fontSize: "0.9rem", marginTop: "6px" }}>
            Sent requests will be logged here for quick retrieval.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {history.map((req) => (
            <div
              key={req.id}
              onClick={() => loadRequest(req)}
              className="glass-panel"
              style={{
                padding: "14px 20px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                background: "hsl(var(--card))",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor =
                  "hsl(var(--primary) / 0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexGrow: 1,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: getMethodColor(req.method),
                    width: "45px",
                    display: "inline-block",
                  }}
                >
                  {req.method}
                </span>
                <div style={{ minWidth: 0, flexGrow: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {req.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "hsl(var(--muted-foreground))",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      marginTop: "2px",
                    }}
                  >
                    {req.url}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginLeft: "16px",
                }}
              >
                {req.response && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color:
                        req.response.status >= 200 && req.response.status < 400
                          ? "#10b981"
                          : "#f43f5e",
                      background:
                        req.response.status >= 200 && req.response.status < 400
                          ? "hsl(142.1, 76.2%, 36.3%, 0.1)"
                          : "hsl(346.8, 77.2%, 49.8%, 0.1)",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {req.response.status}
                  </span>
                )}
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  {new Date(req.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <ChevronRight size={16} style={{ opacity: 0.5 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rendering Helper: Environment Variables panel
  const renderEnvironment = () => {
    const handleAddEnvRow = () => {
      const next = [...envVariables, { key: "", value: "", enabled: true }];
      updateEnvVariables(next);
    };

    const handleUpdateEnvRow = (
      idx: number,
      field: "key" | "value" | "enabled",
      val: any,
    ) => {
      const next = [...envVariables];
      next[idx] = { ...next[idx], [field]: val };
      updateEnvVariables(next);
    };

    const handleDeleteEnvRow = (idx: number) => {
      const next = envVariables.filter((_, i) => i !== idx);
      updateEnvVariables(next);
    };

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Environment Variables
            </h2>
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "0.85rem",
              }}
            >
              Configure global keys that are automatically replaced inside URLs
              or headers using double braces, e.g.{" "}
              <strong
                style={{ color: "hsl(var(--primary))" }}
              >{`{{baseUrl}}`}</strong>
            </p>
          </div>
          <button onClick={handleAddEnvRow} className="btn-primary">
            <Plus size={16} /> Add Variable
          </button>
        </div>

        <div
          className="glass-panel"
          style={{ borderRadius: "var(--radius-lg)", padding: "24px" }}
        >
          {envVariables.length === 0 ? (
            <div
              style={{
                color: "hsl(var(--muted-foreground))",
                textAlign: "center",
                padding: "30px 0",
              }}
            >
              No environment variables defined yet.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1.5fr 2fr 50px",
                  gap: "12px",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                  borderBottom: "1px solid hsl(var(--border))",
                  paddingBottom: "8px",
                }}
              >
                <span>Active</span>
                <span>Variable Key</span>
                <span>Value</span>
                <span style={{ textAlign: "center" }}>Action</span>
              </div>

              {envVariables.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1.5fr 2fr 50px",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={v.enabled}
                    onChange={(e) =>
                      handleUpdateEnvRow(idx, "enabled", e.target.checked)
                    }
                    style={{
                      accentColor: "hsl(var(--primary))",
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      justifySelf: "center",
                    }}
                  />
                  <input
                    type="text"
                    value={v.key}
                    onChange={(e) =>
                      handleUpdateEnvRow(
                        idx,
                        "key",
                        e.target.value.replace(/\s/g, ""),
                      )
                    }
                    placeholder="Variable Key (e.g. host)"
                    className="input-field"
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                  <input
                    type="text"
                    value={v.value}
                    onChange={(e) =>
                      handleUpdateEnvRow(idx, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="input-field"
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                  <button
                    onClick={() => handleDeleteEnvRow(idx)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "hsl(var(--destructive))",
                      cursor: "pointer",
                      justifySelf: "center",
                      padding: "6px",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Rendering Helper: Settings panel
  const renderSettings = () => {
    // Math helpers for API metrics
    const successRate =
      stats.totalRequests > 0
        ? Math.round((stats.successCount / stats.totalRequests) * 100)
        : 100;

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Account Settings
          </h2>
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.85rem",
            }}
          >
            Manage credentials and view usage metrics
          </p>
        </div>

        {/* API Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            className="glass-panel"
            style={{ padding: "20px", borderRadius: "var(--radius-md)" }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}
            >
              Total Requests Sent
            </span>
            <div
              style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px" }}
            >
              {stats.totalRequests}
            </div>
          </div>
          <div
            className="glass-panel"
            style={{ padding: "20px", borderRadius: "var(--radius-md)" }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}
            >
              Success Rate
            </span>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                marginTop: "8px",
                color: "#10b981",
              }}
            >
              {successRate}%
            </div>
          </div>
          <div
            className="glass-panel"
            style={{ padding: "20px", borderRadius: "var(--radius-md)" }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}
            >
              Failure Rate
            </span>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                marginTop: "8px",
                color: "#f43f5e",
              }}
            >
              {stats.totalRequests > 0 ? 100 - successRate : 0}%
            </div>
          </div>
        </div>

        {/* Custom Visual Bar Chart for HTTP Methods distribution */}
        <div
          className="glass-panel"
          style={{ padding: "24px", borderRadius: "var(--radius-md)" }}
        >
          <h3
            style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}
          >
            HTTP Method Distribution
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {Object.entries(stats.methodDistribution).map(
              ([methodName, count]) => {
                // Find percentage of total
                const pct =
                  stats.totalRequests > 0
                    ? (count / stats.totalRequests) * 100
                    : 0;
                const barColor = getMethodColor(methodName);

                return (
                  <div
                    key={methodName}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "70px 40px 1fr",
                      gap: "12px",
                      alignItems: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ fontWeight: 800, color: barColor }}>
                      {methodName}
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {count}
                    </span>
                    <div
                      style={{
                        height: "8px",
                        background: "hsl(var(--secondary))",
                        borderRadius: "4px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: barColor,
                          borderRadius: "4px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Update Profile Form */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          <form
            onSubmit={handleUpdateProfile}
            className="glass-panel"
            style={{
              padding: "24px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                borderBottom: "1px solid hsl(var(--border))",
                paddingBottom: "10px",
              }}
            >
              Profile Details
            </h3>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: "6px",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={settingsName}
                onChange={(e) => setSettingsName(e.target.value)}
                className="input-field"
                style={{ fontSize: "0.85rem" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: "12px",
                  fontWeight: 600
                }}
              >
                Profile Photo
              </label>
              <div 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "24px",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: isDragActive ? "2px dashed hsl(var(--primary))" : "1px dashed hsl(var(--border))",
                  background: isDragActive ? "hsl(var(--primary) / 0.05)" : "hsl(var(--secondary) / 0.1)",
                  transition: "all var(--transition-normal)",
                  position: "relative"
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Circular Avatar Preview */}
                <div style={{ position: "relative", width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", border: "2px solid hsl(var(--border))" }}>
                  <img 
                    src={uploadPreview || settingsAvatar || DEFAULT_AVATAR} 
                    alt="Profile Avatar Preview" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "0.75rem", color: "hsl(var(--muted-foreground))" }}>
                    Drag & drop or click to upload. Support WEBP, PNG, JPG (Max 2MB).
                  </span>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => document.getElementById("avatar-upload-input")?.click()}
                      className="btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                    >
                      {settingsAvatar ? "Replace Photo" : "Upload Photo"}
                    </button>
                    
                    {settingsAvatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="btn-secondary"
                        style={{ padding: "6px 12px", fontSize: "0.75rem", color: "hsl(var(--destructive))", borderColor: "hsl(var(--destructive) / 0.2)" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <input 
                  type="file"
                  id="avatar-upload-input"
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              Save Details
            </button>
          </form>

          {/* Change Password Form */}
          <form
            onSubmit={handleUpdatePassword}
            className="glass-panel"
            style={{
              padding: "24px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                borderBottom: "1px solid hsl(var(--border))",
                paddingBottom: "10px",
              }}
            >
              Change Password
            </h3>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: "6px",
                }}
              >
                Current Password
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Enter current password"
                className="input-field"
                style={{ fontSize: "0.85rem" }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: "6px",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="At least 6 characters"
                className="input-field"
                style={{ fontSize: "0.85rem" }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "hsl(var(--muted-foreground))",
                  marginBottom: "6px",
                }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
                placeholder="Confirm password"
                className="input-field"
                style={{ fontSize: "0.85rem" }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={passUpdating}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              {passUpdating ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const getMethodColor = (m: string) => {
    switch (m.toUpperCase()) {
      case "GET":
        return "#10b981"; // Emerald
      case "POST":
        return "#3b82f6"; // Blue
      case "PUT":
        return "#f97316"; // Orange
      case "PATCH":
        return "#a855f7"; // Purple
      case "DELETE":
        return "#ef4444"; // Red
      case "OPTIONS":
        return "#6366f1"; // Indigo
      case "HEAD":
        return "#ec4899"; // Pink
      default:
        return "hsl(var(--muted-foreground))";
    }
  };

  const renderMetricsDashboard = () => {
    const successRate = stats.totalRequests > 0 ? Math.round((stats.successCount / stats.totalRequests) * 100) : 100;
    const avgResponseTime = stats.averageResponseTime || 0;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "8px"
        }}
      >
        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card"
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, hsl(var(--card)) 60%, hsl(263.4, 75%, 62%, 0.05) 100%)",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
            Total Requests
          </span>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px", color: "hsl(var(--foreground))" }}>
            {stats.totalRequests}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card"
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, hsl(var(--card)) 60%, rgba(16, 185, 129, 0.05) 100%)",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
            Success Rate
          </span>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px", color: "#10b981" }}>
            {successRate}%
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card"
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, hsl(var(--card)) 60%, rgba(59, 130, 246, 0.05) 100%)",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
            Avg Response Time
          </span>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px", color: "#3b82f6" }}>
            {avgResponseTime} ms
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="premium-card"
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, hsl(var(--card)) 60%, rgba(249, 115, 22, 0.05) 100%)",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
            Collections
          </span>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px", color: "#f97316" }}>
            {collections.length}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "hsl(var(--background))",
      }}
    >
      {/* Dashboard Left Sidebar */}
      <aside
        style={{
          width: isSidebarCollapsed ? "72px" : "260px",
          height: "100vh",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid var(--glass-border)",
          display: "flex",
          flexDirection: "column",
          padding: isSidebarCollapsed ? "24px 10px" : "24px 16px",
          zIndex: 100,
          justifyContent: "space-between",
          transition: "width var(--transition-normal), padding var(--transition-normal)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Logo & Toggle Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: isSidebarCollapsed ? "center" : "space-between", gap: "10px", width: "100%" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none"
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(263.4, 90%, 68%) 100%)",
                  color: "white",
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                  flexShrink: 0
                }}
              >
                <Terminal size={18} />
              </div>
              {!isSidebarCollapsed && (
                <span className="text-gradient" style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.5px", color: "hsl(var(--foreground))" }}>
                  APIHUB
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                background: "none",
                border: "none",
                color: "hsl(var(--muted-foreground))",
                cursor: "pointer",
                display: isSidebarCollapsed ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px"
              }}
            >
              <ChevronRight size={16} style={{ transform: isSidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform var(--transition-normal)" }} />
            </button>
          </div>

          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              style={{
                background: "none",
                border: "none",
                color: "hsl(var(--muted-foreground))",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                margin: "0 auto",
                borderRadius: "50%",
                backgroundColor: "hsl(var(--secondary) / 0.2)"
              }}
              title="Expand Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Workspace Switcher */}
          {!isSidebarCollapsed ? (
            <div
              className="premium-card"
              style={{
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "hsl(var(--secondary) / 0.15)",
                border: "1px solid hsl(var(--border) / 0.6)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Personal Space</span>
              </div>
              <ChevronDown size={14} style={{ opacity: 0.6 }} />
            </div>
          ) : (
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                margin: "0 auto",
                boxShadow: "0 0 8px #10b981"
              }}
              title="Personal Space"
            />
          )}

          {/* Nav Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { id: "tester", label: "API Tester", icon: <Play size={16} /> },
              { id: "collections", label: "Collections", icon: <Folder size={16} /> },
              { id: "history", label: "History", icon: <HistoryIcon size={16} /> },
              { id: "env", label: "Environments", icon: <Server size={16} /> },
              { id: "settings", label: "Settings & Stats", icon: <SettingsIcon size={16} /> },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isSidebarCollapsed ? "center" : "flex-start",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: isActive ? "linear-gradient(90deg, hsl(var(--primary) / 0.15) 0%, transparent 100%)" : "none",
                    color: isActive ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    fontWeight: isActive ? 700 : 500,
                    border: "none",
                    borderLeft: !isSidebarCollapsed && isActive ? "3px solid hsl(var(--primary))" : "3px solid transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all var(--transition-fast)",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "hsl(var(--foreground))";
                      e.currentTarget.style.background = "hsl(var(--secondary) / 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "hsl(var(--muted-foreground))";
                      e.currentTarget.style.background = "none";
                    }
                  }}
                >
                  {item.icon} {!isSidebarCollapsed && item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Card at bottom */}
        <div
          style={{
            borderTop: "1px solid hsl(var(--border))",
            paddingTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: isSidebarCollapsed ? "center" : "flex-start", gap: "10px" }}>
            <img
              src={user?.avatar}
              alt={user?.fullName}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid hsl(var(--primary) / 0.3)"
              }}
            />
            {!isSidebarCollapsed && (
              <div style={{ minWidth: 0, flexGrow: 1 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.fullName}
                </div>
                <div style={{ fontSize: "0.7rem", color: "hsl(var(--muted-foreground))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            title={isSidebarCollapsed ? "Logout" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid hsl(var(--border))",
              background: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              color: "hsl(var(--muted-foreground))",
              transition: "all var(--transition-fast)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "hsl(var(--destructive))";
              e.currentTarget.style.borderColor = "hsl(var(--destructive) / 0.3)";
              e.currentTarget.style.background = "hsl(var(--destructive) / 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(var(--muted-foreground))";
              e.currentTarget.style.borderColor = "hsl(var(--border))";
              e.currentTarget.style.background = "none";
            }}
          >
            <LogOut size={14} /> {!isSidebarCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div
        style={{
          flexGrow: 1,
          marginLeft: isSidebarCollapsed ? "72px" : "260px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left var(--transition-normal)"
        }}
      >
        {/* Sticky Topbar */}
        <header
          style={{
            height: "60px",
            position: "sticky",
            top: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 32px",
            background: "var(--glass-bg)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--glass-border)",
            zIndex: 90
          }}
        >
          {/* Breadcrumb Workspace Path */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 600 }}>
            <span style={{ color: "hsl(var(--muted-foreground))" }}>Workspace</span>
            <span style={{ color: "hsl(var(--muted-foreground))" }}>/</span>
            <span style={{ color: "hsl(var(--foreground))" }}>Default Space</span>
          </div>

          {/* Quick Search */}
          <div style={{ position: "relative", width: "280px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => {
                if (searchQuery.length > 0) setShowSearchResults(true);
              }}
              placeholder="Search request history..."
              style={{
                width: "100%",
                padding: "6px 12px 6px 32px",
                fontSize: "0.8rem",
                borderRadius: "8px",
                background: "hsl(var(--secondary) / 0.15)",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
                outline: "none",
                transition: "all var(--transition-fast)"
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSearchResults(false);
              }}
            />
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))", display: "flex" }}>
              <Terminal size={14} />
            </span>

            {/* Quick Search Dropdown Overlay */}
            <AnimatePresence>
              {showSearchResults && filteredHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="premium-card"
                  style={{
                    position: "absolute",
                    top: "38px",
                    left: 0,
                    right: 0,
                    maxHeight: "260px",
                    overflowY: "auto",
                    zIndex: 200,
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "hsl(var(--muted-foreground))", padding: "4px 8px" }}>
                    History Search Results
                  </div>
                  {filteredHistory.slice(0, 5).map(h => (
                    <div
                      key={h.id}
                      onClick={() => {
                        loadRequest(h);
                        setSearchQuery("");
                        setShowSearchResults(false);
                        setActiveTab("tester");
                        showToast(`Loaded: ${h.name}`, "success");
                      }}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "hsl(var(--secondary) / 0.25)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                      <div style={{ display: "flex", gap: "8px", minWidth: 0 }}>
                        <span style={{ fontWeight: 800, color: getMethodColor(h.method) }}>{h.method}</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</span>
                      </div>
                      <ChevronRight size={12} style={{ opacity: 0.5 }} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Env Quick Selector */}
            <select
              value={envVariables.find(v => v.enabled)?.key || "none"}
              onChange={(e) => {
                const nextEnv = envVariables.map(v => ({
                  ...v,
                  enabled: v.key === e.target.value
                }));
                updateEnvVariables(nextEnv);
                showToast(e.target.value === "none" ? "Variables disabled" : `Switched env: ${e.target.value}`, "info");
              }}
              style={{
                fontSize: "0.8rem",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="none">No Environment</option>
              {envVariables.map(v => (
                <option key={v.key} value={v.key}>{v.key}</option>
              ))}
            </select>

            {/* Notifications */}
            <div style={{ position: "relative", cursor: "pointer", display: "flex" }}>
              <Server size={18} style={{ opacity: 0.7 }} />
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "6px",
                  height: "6px",
                  background: "#10b981",
                  borderRadius: "50%",
                  boxShadow: "0 0 0 2px hsl(var(--background))"
                }}
              />
            </div>

            {/* Theme Selector Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                color: "hsl(var(--foreground))"
              }}
            >
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Avatar Preset */}
            <img
              src={user?.avatar}
              alt="Avatar preset"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          </div>
        </header>

        {/* Viewport content */}
        <main
          style={{
            flexGrow: 1,
            padding: "32px",
            overflowY: "auto"
          }}
        >
          <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "tester" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {renderMetricsDashboard()}
                    {renderApiTester()}
                  </div>
                )}
                {activeTab === "collections" && renderCollections()}
                {activeTab === "history" && renderHistory()}
                {activeTab === "env" && renderEnvironment()}
                {activeTab === "settings" && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modal Dialog: Save to Collection */}
      <AnimatePresence>
        {showSaveModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="premium-card"
              style={{
                width: "100%",
                maxWidth: "440px",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                boxShadow: "var(--shadow-xl)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  Save Request Configuration
                </h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: "6px",
                    }}
                  >
                    Request Name
                  </label>
                  <input
                    type="text"
                    value={saveRequestName}
                    onChange={(e) => setSaveRequestName(e.target.value)}
                    className="input-field"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>

                {isCreatingCollection ? (
                  /* Create Inline Collection Form */
                  <form
                    onSubmit={handleCreateCollectionInsideModal}
                    style={{
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius-md)",
                      padding: "12px",
                      background: "hsl(var(--secondary) / 0.15)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>
                      Create New Collection
                    </div>
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="e.g. Stripe API"
                      className="input-field"
                      style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                      required
                    />
                    <input
                      type="text"
                      value={newCollectionDesc}
                      onChange={(e) => setNewCollectionDesc(e.target.value)}
                      placeholder="Optional Description"
                      className="input-field"
                      style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setIsCreatingCollection(false)}
                        className="btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                      >
                        Create
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Collection selection dropdown */
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "0.8rem",
                          color: "hsl(var(--muted-foreground))",
                        }}
                      >
                        Save to Collection
                      </label>
                      <button
                        onClick={() => setIsCreatingCollection(true)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "hsl(var(--primary))",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Create New
                      </button>
                    </div>
                    {collections.length === 0 ? (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "hsl(var(--muted-foreground))",
                          fontStyle: "italic",
                          padding: "10px 0",
                        }}
                      >
                        No collections available. Create one using the link
                        above!
                      </div>
                    ) : (
                      <select
                        value={saveCollectionId}
                        onChange={(e) => setSaveCollectionId(e.target.value)}
                        className="input-field"
                        style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                      >
                        {collections.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="btn-secondary"
                    style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRequest}
                    className="btn-primary"
                    disabled={collections.length === 0}
                    style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    Save Request
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dedicated Modal Dialog: Create Collection from Collections Tab */}
      <AnimatePresence>
        {isCreatingCollection && !showSaveModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="premium-card"
              style={{
                width: "100%",
                maxWidth: "440px",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                boxShadow: "var(--shadow-xl)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  Create New Collection
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingCollection(false);
                    setNewCollectionName("");
                    setNewCollectionDesc("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleCreateCollectionInsideModal}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: "6px",
                    }}
                  >
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="e.g. Authentication"
                    className="input-field"
                    style={{ fontSize: "0.85rem" }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "hsl(var(--muted-foreground))",
                      marginBottom: "6px",
                    }}
                  >
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCollectionDesc}
                    onChange={(e) => setNewCollectionDesc(e.target.value)}
                    placeholder="e.g. User onboarding routes"
                    className="input-field"
                    style={{ fontSize: "0.85rem" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingCollection(false);
                      setNewCollectionName("");
                      setNewCollectionDesc("");
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
