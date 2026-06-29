import { useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Car, Leaf, Baby, PawPrint, Calendar, FileText, QrCode,
  LogOut, ChevronLeft, CheckCircle, Clock, XCircle,
  Download, Printer, Upload, Camera, Shield,
  BarChart3, Users, Eye, ArrowRight, X, Check,
  Bell, ChevronDown, ScanLine, Home, AlertCircle,
  RefreshCw, Lock, Mail, Globe, Search, Plus, MessageSquare, KeyRound,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen =
  | "login" | "register"
  | "forgot-1" | "forgot-2" | "forgot-3" | "forgot-4"
  | "dash" | "vehicle" | "sag" | "minor" | "pet" | "appointment" | "tramites" | "qr"
  | "off-panel" | "off-admin" | "off-admin-users";

// ─── Palette ─────────────────────────────────────────────────────────────────
const P = {
  darkGreen: "#283D3B",
  teal: "#197278",
  beige: "#EDDDD4",
  red: "#C44536",
  darkRed: "#772E25",
  success: "#2d8c54",
  successBg: "#e6f4ea",
  warnColor: "#b45309",
  warnBg: "#fef3c7",
};

const inputBase = "w-full px-3 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#197278]";
const inputSt = { borderColor: "rgba(40,61,59,0.2)", color: P.darkGreen, background: "#fff", minHeight: "44px" };

// ─── Shared components (defined OUTSIDE App to avoid focus loss on re-render) ──

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold" style={{ color: P.darkGreen }}>{label}</label>
      {children}
    </div>
  );
}

function PrimaryBtn({ onClick, children, disabled, className = "" }: {
  onClick?: () => void; children: React.ReactNode; disabled?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] ${className}`}
      style={{ background: disabled ? "#ccc" : P.teal, minHeight: "44px" }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-2xl font-semibold text-sm border-2 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
      style={{ borderColor: P.teal, color: P.teal, minHeight: "44px" }}
    >
      {children}
    </button>
  );
}

// ─── QR Code SVG ─────────────────────────────────────────────────────────────
function QRCodeSVG({ value = "SFD-2026-001234" }: { value?: string }) {
  const M = 21, CS = 10;
  const isFinderZone = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= M - 8) || (r >= M - 8 && c < 8);
  const finderFilled = (r: number, c: number) => {
    let lr = r, lc = c;
    if (r < 8 && c >= M - 8) lc = c - (M - 7);
    if (r >= M - 8 && c < 8) lr = r - (M - 7);
    if (lr < 0 || lr > 6 || lc < 0 || lc > 6) return false;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    return lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  };
  const rects: { x: number; y: number }[] = [];
  for (let r = 0; r < M; r++)
    for (let c = 0; c < M; c++) {
      const filled = isFinderZone(r, c)
        ? finderFilled(r, c)
        : ((r * 13) ^ (c * 7) ^ value.charCodeAt((r * M + c) % value.length)) % 2 === 0;
      if (filled) rects.push({ x: c * CS, y: r * CS });
    }
  return (
    <svg viewBox={`0 0 ${M * CS} ${M * CS}`} className="w-full h-full">
      <rect width={M * CS} height={M * CS} fill="white" />
      {rects.map(({ x, y }, i) => <rect key={i} x={x} y={y} width={CS} height={CS} fill={P.darkGreen} />)}
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    approved: { label: "Aprobado",  color: P.success,   bg: P.successBg },
    pending:  { label: "Pendiente", color: P.warnColor, bg: P.warnBg },
    rejected: { label: "Rechazado", color: P.red,       bg: "#fde8e6" },
    ok:       { label: "Sin alertas", color: P.success,  bg: P.successBg },
  };
  const c = cfg[status] ?? { label: status, color: "#666", bg: "#eee" };
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

// ─── Shared layout header for auth screens ────────────────────────────────────
function AuthHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack: () => void }) {
  return (
    <div className="pt-10 pb-6 px-5" style={{ background: P.darkGreen }}>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>
        <ChevronLeft size={16} /> Volver
      </button>
      <h1 className="text-xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-xs mt-1" style={{ color: "#a8c5c2" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Step indicator for forgot flow ──────────────────────────────────────────
function ForgotSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  const labels = ["Correo", "Método", "Código", "Contraseña"];
  return (
    <div className="flex items-center gap-2 px-5 py-4 bg-white border-b" style={{ borderColor: "rgba(40,61,59,0.1)" }}>
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                style={{
                  background: done ? P.success : active ? P.teal : "rgba(40,61,59,0.1)",
                  color: done || active ? "#fff" : "#9aafae",
                }}
              >
                {done ? <Check size={13} /> : step}
              </div>
              <span className="text-xs font-medium" style={{ color: active ? P.teal : done ? P.success : "#9aafae" }}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className="flex-1 h-0.5 mb-4 rounded-full" style={{ background: done ? P.success : "rgba(40,61,59,0.1)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [loginTab, setLoginTab] = useState<"viajero" | "funcionario" | "admin">("viajero");
  const [highContrast, setHighContrast] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMethod, setForgotMethod] = useState<"email" | "sms" | null>(null);
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // Traveler form states
  const [vehicleData, setVehicleData] = useState({ patente: "", marca: "", modelo: "", anio: "2022", pais: "Chile" });
  const [vehicleSaved, setVehicleSaved] = useState(false);
  const [sagHasProducts, setSagHasProducts] = useState<boolean | null>(null);
  const [sagCategories, setSagCategories] = useState<string[]>([]);
  const [minorData, setMinorData] = useState({ nombre: "", rut: "", nacimiento: "" });
  const [petData, setPetData] = useState({ tipo: "Perro", nombre: "", raza: "", edad: "" });
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [tramiteQR, setTramiteQR] = useState<string | null>(null);

  // Official panel states
  const [scannedCode, setScannedCode] = useState("");
  const [showTravelerInfo, setShowTravelerInfo] = useState(false);
  const [officialTab, setOfficialTab] = useState<"aduana" | "pdi" | "sag">("aduana");
  const [approvalStates, setApprovalStates] = useState<Record<string, string>>({
    vehicle: "pending", minor: "approved", pet: "pending", sag: "pending", pdi: "ok",
  });
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDocsDialog, setShowDocsDialog] = useState(false);
  const [crossingRegistered, setCrossingRegistered] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const nav = (s: Screen) => setScreen(s);

  const steps = [
    vehicleData.patente !== "", sagHasProducts !== null,
    minorData.nombre !== "", petData.nombre !== "", appointmentConfirmed,
  ];
  const completedCount = steps.filter(Boolean).length;
  const allStepsDone = completedCount === 5;
  const allApproved = Object.values(approvalStates).every(v => v === "approved" || v === "ok");

  const hc = highContrast;
  const BG  = hc ? "#ffffff" : P.beige;
  const FG  = hc ? "#000000" : P.darkGreen;
  const NAV = hc ? "#000000" : P.darkGreen;
  const PRI = hc ? "#000000" : P.teal;

  // Masked values for forgot flow
  const maskedEmail = (() => {
    if (!forgotEmail) return "ju***@correo.com";
    const [user = "", domain = "correo.com"] = forgotEmail.split("@");
    return `${user.slice(0, 2)}${"*".repeat(Math.max(3, user.length - 2))}@${domain}`;
  })();
  const maskedPhone = "+56 9 **** **07";

  // ── Inner components that need screen/nav/state ────────────────────────────

  function TravelerHeader({ title, back }: { title: string; back?: Screen }) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 sticky top-0 z-10" style={{ background: NAV }}>
        {back && (
          <button onClick={() => nav(back)} aria-label="Volver">
            <ChevronLeft size={22} color="white" />
          </button>
        )}
        <span className="flex-1 text-white font-semibold text-base leading-tight">{title}</span>
        {!back && (
          <button
            onClick={() => setHighContrast(!hc)}
            className="text-xs px-2.5 py-1 rounded-lg border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
          >
            {hc ? "Normal" : "Alto contraste"}
          </button>
        )}
        {!back && (
          <button onClick={() => nav("login")} className="ml-1" aria-label="Cerrar sesión">
            <LogOut size={18} color="rgba(255,255,255,0.7)" />
          </button>
        )}
      </div>
    );
  }

  function BottomNav() {
    const items: { id: Screen; Icon: React.ElementType; label: string }[] = [
      { id: "dash", Icon: Home, label: "Inicio" },
      { id: "tramites", Icon: FileText, label: "Trámites" },
      { id: "appointment", Icon: Calendar, label: "Turno" },
      { id: "qr", Icon: QrCode, label: "Mi QR" },
    ];
    return (
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center border-t"
        style={{ background: hc ? "#000" : "#fff", borderColor: hc ? "#000" : "rgba(40,61,59,0.12)" }}>
        {items.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => nav(id)}
            className="flex flex-col items-center gap-0.5 px-4 py-2"
            style={{ color: screen === id ? PRI : (hc ? "#555" : "#9aafae"), minHeight: "52px" }}>
            <Icon size={22} />
            <span style={{ fontSize: "0.625rem", fontWeight: screen === id ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </nav>
    );
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (screen === "login") {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen flex flex-col" style={{ background: P.beige, fontFamily: "Inter, sans-serif" }}>
          <div className="pt-12 pb-8 px-6 flex flex-col items-center" style={{ background: P.darkGreen }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{ background: P.teal }}>
              <Globe size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center leading-tight">Salto Frontera Digital</h1>
            <p className="text-sm mt-1 text-center" style={{ color: "#a8c5c2" }}>Paso Cardenal Samoré · Chile–Argentina</p>
            <p className="text-xs mt-2 px-4 py-1.5 rounded-full" style={{ background: "rgba(25,114,120,0.3)", color: "#a8dfe3" }}>
              Reduce tu espera de horas a minutos
            </p>
          </div>

          {/* 3-tab selector */}
          <div className="mx-5 mt-6">
            <div className="flex rounded-2xl overflow-hidden border-2 p-1 gap-1" style={{ borderColor: "rgba(40,61,59,0.15)", background: "#fff" }}>
              {([
                { id: "viajero",     label: "Viajero" },
                { id: "funcionario", label: "Funcionario" },
                { id: "admin",       label: "Admin" },
              ] as const).map(tab => (
                <button key={tab.id} onClick={() => setLoginTab(tab.id)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all"
                  style={{ background: loginTab === tab.id ? P.teal : "transparent", color: loginTab === tab.id ? "#fff" : P.darkGreen }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-5 flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>

              {/* Admin badge */}
              {loginTab === "admin" && (
                <div className="flex items-center gap-3 p-3 rounded-2xl mb-5" style={{ background: "rgba(40,61,59,0.05)", border: "1px solid rgba(40,61,59,0.12)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: P.darkGreen }}>
                    <Shield size={18} color="white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: P.darkGreen }}>Acceso Administrador</p>
                    <p className="text-xs" style={{ color: "#7a9695" }}>Área restringida · Solo personal autorizado</p>
                  </div>
                </div>
              )}

              <h2 className="text-base font-bold mb-5" style={{ color: P.darkGreen }}>
                {loginTab === "viajero" ? "Iniciar sesión" : loginTab === "funcionario" ? "Acceso institucional" : "Iniciar sesión como administrador"}
              </h2>

              <div className="flex flex-col gap-4">
                <FieldBlock label="Correo electrónico">
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9aafae" }} />
                    <input type="email"
                      placeholder={loginTab === "admin" ? "admin@aduana.cl" : "correo@ejemplo.com"}
                      className={inputBase} style={{ ...inputSt, paddingLeft: "2.25rem" }} />
                  </div>
                </FieldBlock>

                <FieldBlock label="Contraseña">
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9aafae" }} />
                    <input type="password" placeholder="••••••••"
                      className={inputBase} style={{ ...inputSt, paddingLeft: "2.25rem" }} />
                  </div>
                </FieldBlock>

                {loginTab === "admin" && (
                  <FieldBlock label="Código de acceso">
                    <div className="relative">
                      <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9aafae" }} />
                      <input type="password" placeholder="Código institucional"
                        className={inputBase} style={{ ...inputSt, paddingLeft: "2.25rem" }} />
                    </div>
                    <p className="text-xs" style={{ color: "#9aafae" }}>Proporcionado por tu supervisor</p>
                  </FieldBlock>
                )}

                {(loginTab === "funcionario" || loginTab === "admin") && (
                  <label className="flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: P.darkGreen }}>
                    <input type="checkbox" className="w-4 h-4 accent-[#197278]" /> Recordar sesión
                  </label>
                )}

                <button
                  onClick={() => {
                    if (loginTab === "viajero") nav("dash");
                    else if (loginTab === "funcionario") nav("off-panel");
                    else nav("off-admin");
                  }}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all mt-1"
                  style={{ background: loginTab === "admin" ? P.darkGreen : P.teal, minHeight: "44px" }}>
                  {loginTab === "viajero" ? "Iniciar sesión" : loginTab === "funcionario" ? "Ingresar al sistema" : "Ingresar como administrador"}
                </button>

                {loginTab === "viajero" && (
                  <>
                    <button onClick={() => { setForgotEmail(""); setForgotMethod(null); setForgotCode(""); nav("forgot-1"); }}
                      className="text-sm text-center font-medium" style={{ color: P.teal }}>
                      ¿Olvidaste tu contraseña?
                    </button>
                    <p className="text-sm text-center" style={{ color: "#7a9695" }}>
                      ¿No tienes cuenta?{" "}
                      <button onClick={() => nav("register")} className="font-bold" style={{ color: P.teal }}>
                        Registrarse
                      </button>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="text-center text-xs pb-8 px-6" style={{ color: "#9aafae" }}>
            Sistema oficial · Servicio Nacional de Aduanas de Chile
          </p>
        </div>
      </>
    );
  }

  // ── REGISTER ──────────────────────────────────────────────────────────────
  if (screen === "register") {
    const fields = [
      { label: "Nombre",              type: "text",     placeholder: "Juan" },
      { label: "Apellido",            type: "text",     placeholder: "Pérez" },
      { label: "RUT / Pasaporte",     type: "text",     placeholder: "12.345.678-9" },
      { label: "Correo electrónico",  type: "email",    placeholder: "juan@correo.com" },
      { label: "Contraseña",          type: "password", placeholder: "Mínimo 8 caracteres" },
      { label: "Confirmar contraseña",type: "password", placeholder: "Repite tu contraseña" },
    ];
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen" style={{ background: P.beige, fontFamily: "Inter, sans-serif" }}>
          <AuthHeader title="Crear cuenta" subtitle="Ingresa tus datos para registrarte" onBack={() => nav("login")} />
          <div className="p-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="flex flex-col gap-4">
                {fields.map(({ label, ...props }) => (
                  <FieldBlock key={label} label={label}>
                    <input {...props} className={inputBase} style={inputSt} />
                    {label === "Contraseña" && (
                      <p className="text-xs" style={{ color: P.teal }}>Mínimo 8 caracteres</p>
                    )}
                  </FieldBlock>
                ))}
                <label className="flex items-start gap-3 text-sm cursor-pointer" style={{ color: P.darkGreen }}>
                  <input type="checkbox" className="w-4 h-4 mt-0.5 accent-[#197278] flex-shrink-0" />
                  <span>Acepto los <span style={{ color: P.teal }}>términos y condiciones</span> y la política de privacidad</span>
                </label>
                <PrimaryBtn onClick={() => {
                  toast.success("¡Registro exitoso!", {
                    description: "Tu cuenta ha sido creada. Ya puedes iniciar sesión.",
                  });
                  nav("login");
                }}>
                  Crear cuenta
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── FORGOT — PASO 1: Ingresa tu correo ────────────────────────────────────
  if (screen === "forgot-1") {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen" style={{ background: P.beige, fontFamily: "Inter, sans-serif" }}>
          <AuthHeader title="Recuperar contraseña" subtitle="Paso 1 de 4 · Identifica tu cuenta" onBack={() => nav("login")} />
          <ForgotSteps current={1} />
          <div className="p-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(25,114,120,0.08)" }}>
                <Mail size={26} color={P.teal} />
              </div>
              <h2 className="text-base font-bold mb-1" style={{ color: P.darkGreen }}>Ingresa tu correo registrado</h2>
              <p className="text-sm mb-5" style={{ color: "#7a9695" }}>
                Buscaremos tu cuenta y te mostraremos opciones para recuperar tu contraseña.
              </p>
              <FieldBlock label="Correo electrónico">
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9aafae" }} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className={`${inputBase}`}
                    style={{ ...inputSt, paddingLeft: "2.25rem" }}
                  />
                </div>
              </FieldBlock>
              <div className="mt-5">
                <PrimaryBtn
                  onClick={() => {
                    if (forgotEmail.length > 3) nav("forgot-2");
                  }}
                  disabled={forgotEmail.length < 4}
                >
                  Buscar cuenta
                </PrimaryBtn>
              </div>
              <button onClick={() => nav("login")} className="w-full mt-3 text-sm text-center" style={{ color: "#9aafae" }}>
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── FORGOT — PASO 2: Elige método de recuperación ─────────────────────────
  if (screen === "forgot-2") {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen" style={{ background: P.beige, fontFamily: "Inter, sans-serif" }}>
          <AuthHeader title="Recuperar contraseña" subtitle="Paso 2 de 4 · Elige cómo recibir el código" onBack={() => nav("forgot-1")} />
          <ForgotSteps current={2} />
          <div className="p-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              {/* Account found */}
              <div className="flex items-center gap-3 p-3 rounded-2xl mb-6" style={{ background: P.successBg }}>
                <CheckCircle size={20} color={P.success} className="flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold" style={{ color: P.success }}>Cuenta encontrada</p>
                  <p className="text-xs" style={{ color: "#5a9e6d" }}>Elige cómo quieres recibir el código de 6 dígitos</p>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: "#9aafae" }}>
                ¿Cómo deseas recuperar tu contraseña?
              </p>

              {/* Email option */}
              <button
                onClick={() => { setForgotMethod("email"); nav("forgot-3"); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 text-left transition-all hover:opacity-90 active:scale-[0.99]"
                style={{ background: "rgba(25,114,120,0.06)", border: `1.5px solid ${P.teal}` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: P.teal }}>
                  <Mail size={20} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: P.darkGreen }}>Enviar por correo electrónico</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: "#7a9695" }}>{maskedEmail}</p>
                </div>
                <ArrowRight size={16} color={P.teal} />
              </button>

              {/* SMS option */}
              <button
                onClick={() => { setForgotMethod("sms"); nav("forgot-3"); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:opacity-90 active:scale-[0.99]"
                style={{ background: "rgba(25,114,120,0.06)", border: `1.5px solid ${P.teal}` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: P.teal }}>
                  <MessageSquare size={20} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: P.darkGreen }}>Enviar por SMS</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: "#7a9695" }}>{maskedPhone}</p>
                </div>
                <ArrowRight size={16} color={P.teal} />
              </button>

              <button onClick={() => { setForgotEmail(""); nav("forgot-1"); }}
                className="w-full mt-5 text-sm text-center font-medium" style={{ color: "#9aafae" }}>
                Probar con otro correo
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── FORGOT — PASO 3: Ingresa el código ────────────────────────────────────
  if (screen === "forgot-3") {
    const destination = forgotMethod === "email" ? maskedEmail : maskedPhone;
    const via = forgotMethod === "email" ? "correo electrónico" : "SMS";
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen" style={{ background: P.beige, fontFamily: "Inter, sans-serif" }}>
          <AuthHeader title="Recuperar contraseña" subtitle={`Paso 3 de 4 · Verificación por ${via}`} onBack={() => nav("forgot-2")} />
          <ForgotSteps current={3} />
          <div className="p-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(25,114,120,0.08)" }}>
                <KeyRound size={26} color={P.teal} />
              </div>
              <h2 className="text-base font-bold mb-1" style={{ color: P.darkGreen }}>Ingresa el código de verificación</h2>
              <p className="text-sm mb-1" style={{ color: "#7a9695" }}>
                Enviamos un código de 6 dígitos a:
              </p>
              <p className="text-sm font-bold font-mono mb-5" style={{ color: P.darkGreen }}>{destination}</p>

              <FieldBlock label="Código de verificación">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={forgotCode}
                  onChange={e => setForgotCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className={`${inputBase} text-center text-2xl font-bold font-mono tracking-[0.4em]`}
                  style={inputSt}
                />
              </FieldBlock>

              <p className="text-xs mt-2 mb-5" style={{ color: "#9aafae" }}>
                El código expira en 15 minutos. Revisa también tu carpeta de spam.
              </p>

              <PrimaryBtn
                onClick={() => forgotCode.length === 6 && nav("forgot-4")}
                disabled={forgotCode.length < 6}
              >
                Verificar código
              </PrimaryBtn>

              <button
                onClick={() => {
                  toast.info("Código reenviado", { description: `Se envió un nuevo código a ${destination}` });
                }}
                className="w-full mt-3 text-sm text-center font-medium" style={{ color: P.teal }}>
                ¿No recibiste el código? Reenviar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── FORGOT — PASO 4: Nueva contraseña ─────────────────────────────────────
  if (screen === "forgot-4") {
    const passwordsMatch = newPassword.length >= 8 && newPassword === newPasswordConfirm;
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen" style={{ background: P.beige, fontFamily: "Inter, sans-serif" }}>
          <AuthHeader title="Recuperar contraseña" subtitle="Paso 4 de 4 · Crea tu nueva contraseña" onBack={() => nav("forgot-3")} />
          <ForgotSteps current={4} />
          <div className="p-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(25,114,120,0.08)" }}>
                <Lock size={26} color={P.teal} />
              </div>
              <h2 className="text-base font-bold mb-1" style={{ color: P.darkGreen }}>Crea tu nueva contraseña</h2>
              <p className="text-sm mb-5" style={{ color: "#7a9695" }}>
                Debe tener al menos 8 caracteres.
              </p>

              <div className="flex flex-col gap-4">
                <FieldBlock label="Nueva contraseña">
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9aafae" }} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className={inputBase}
                      style={{ ...inputSt, paddingLeft: "2.25rem" }}
                    />
                  </div>
                  {newPassword.length > 0 && newPassword.length < 8 && (
                    <p className="text-xs" style={{ color: P.red }}>La contraseña debe tener al menos 8 caracteres</p>
                  )}
                </FieldBlock>

                <FieldBlock label="Confirmar contraseña">
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9aafae" }} />
                    <input
                      type="password"
                      value={newPasswordConfirm}
                      onChange={e => setNewPasswordConfirm(e.target.value)}
                      placeholder="Repite tu nueva contraseña"
                      className={inputBase}
                      style={{ ...inputSt, paddingLeft: "2.25rem" }}
                    />
                  </div>
                  {newPasswordConfirm.length > 0 && newPassword !== newPasswordConfirm && (
                    <p className="text-xs" style={{ color: P.red }}>Las contraseñas no coinciden</p>
                  )}
                  {passwordsMatch && (
                    <p className="text-xs flex items-center gap-1" style={{ color: P.success }}>
                      <CheckCircle size={12} /> Las contraseñas coinciden
                    </p>
                  )}
                </FieldBlock>

                <PrimaryBtn
                  onClick={() => {
                    if (passwordsMatch) {
                      toast.success("¡Contraseña actualizada!", {
                        description: "Ya puedes iniciar sesión con tu nueva contraseña.",
                      });
                      setNewPassword("");
                      setNewPasswordConfirm("");
                      setForgotCode("");
                      nav("login");
                    }
                  }}
                  disabled={!passwordsMatch}
                >
                  Guardar nueva contraseña
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── TRAVELER SCREENS ──────────────────────────────────────────────────────

  if (screen === "dash") {
    const menuItems: { id: Screen; Icon: React.ElementType; label: string; done: boolean | null }[] = [
      { id: "vehicle",     Icon: Car,      label: "Registrar vehículo",   done: vehicleData.patente !== "" },
      { id: "sag",         Icon: Leaf,     label: "Declaración SAG",       done: sagHasProducts !== null },
      { id: "minor",       Icon: Baby,     label: "Autorización de menor", done: minorData.nombre !== "" },
      { id: "pet",         Icon: PawPrint, label: "Declarar mascota",      done: petData.nombre !== "" },
      { id: "appointment", Icon: Calendar, label: "Reservar turno",        done: appointmentConfirmed },
      { id: "tramites",    Icon: FileText, label: "Mis trámites",          done: null },
      { id: "qr",          Icon: QrCode,   label: "Código QR",             done: null },
    ];
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Salto Frontera Digital" />
          <div className="mx-4 mt-4 p-4 rounded-2xl bg-white" style={{ border: `1px solid ${hc ? "#000" : "rgba(40,61,59,0.1)"}` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold" style={{ color: FG }}>Completa tus trámites antes de cruzar</span>
              <span className="text-sm font-bold tabular-nums" style={{ color: PRI }}>{completedCount}/5</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(40,61,59,0.1)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 5) * 100}%`, background: allStepsDone ? P.success : P.teal }} />
            </div>
            {allStepsDone && (
              <div className="mt-2.5 flex items-center gap-2">
                <CheckCircle size={15} color={P.success} />
                <span className="text-sm font-bold" style={{ color: P.success }}>¡Listo para cruzar!</span>
              </div>
            )}
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {menuItems.map(({ id, Icon, label, done }) => (
              <button key={id} onClick={() => nav(id)}
                className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl transition-all hover:opacity-90 active:scale-95 relative"
                style={{
                  background: done === true ? P.teal : "#fff",
                  border: `${hc ? "2px" : "1px"} solid ${done === true ? P.teal : "rgba(40,61,59,0.1)"}`,
                  minHeight: "96px", color: done === true ? "#fff" : FG,
                }}>
                {done === true && <span className="absolute top-2 right-2"><CheckCircle size={14} color="rgba(255,255,255,0.9)" /></span>}
                <Icon size={26} />
                <span className="text-xs font-semibold text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  if (screen === "vehicle") {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Registrar vehículo" back="dash" />
          <div className="p-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="flex flex-col gap-4">
                <FieldBlock label="Patente">
                  <input value={vehicleData.patente}
                    onChange={e => setVehicleData({ ...vehicleData, patente: e.target.value.toUpperCase() })}
                    placeholder="AA·BB·00" maxLength={8}
                    className={`${inputBase} font-mono tracking-[0.2em] font-bold`} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="Marca">
                  <input value={vehicleData.marca}
                    onChange={e => setVehicleData({ ...vehicleData, marca: e.target.value })}
                    placeholder="Toyota" className={inputBase} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="Modelo">
                  <input value={vehicleData.modelo}
                    onChange={e => setVehicleData({ ...vehicleData, modelo: e.target.value })}
                    placeholder="Hilux" className={inputBase} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="Año">
                  <input type="number" value={vehicleData.anio}
                    onChange={e => setVehicleData({ ...vehicleData, anio: e.target.value })}
                    min="1990" max="2026" className={inputBase} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="País de registro">
                  <select value={vehicleData.pais}
                    onChange={e => setVehicleData({ ...vehicleData, pais: e.target.value })}
                    className={inputBase} style={inputSt}>
                    {["Chile", "Argentina", "Brasil", "Uruguay", "Perú", "Bolivia", "Colombia", "Otro"].map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </FieldBlock>
                {vehicleSaved && (
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: P.successBg }}>
                    <CheckCircle size={16} color={P.success} />
                    <span className="text-sm font-semibold" style={{ color: P.success }}>Vehículo guardado correctamente</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <PrimaryBtn onClick={() => {
                    setVehicleSaved(true);
                    toast.success("Vehículo guardado", { description: `${vehicleData.marca} ${vehicleData.modelo} · ${vehicleData.patente}` });
                  }} className="flex-1">
                    Guardar y continuar
                  </PrimaryBtn>
                  {vehicleSaved && (
                    <button className="px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-1.5 hover:opacity-80"
                      style={{ background: "rgba(40,61,59,0.08)", color: P.darkGreen, minHeight: "44px" }}>
                      <Printer size={15} /> Imprimir
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  if (screen === "sag") {
    const sagItems = ["Frutas y verduras", "Carnes y embutidos", "Lácteos y derivados", "Semillas y plantas", "Alimentos procesados", "Otros productos vegetales"];
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Declaración SAG" back="dash" />
          <div className="p-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="p-3 rounded-xl mb-5 flex items-start gap-2" style={{ background: "rgba(25,114,120,0.06)" }}>
                <Leaf size={16} color={P.teal} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: "#5f7372" }}>
                  El SAG fiscaliza el ingreso de productos agropecuarios para proteger la sanidad del país. Declarar es obligatorio.
                </p>
              </div>
              <p className="text-sm font-bold mb-3" style={{ color: FG }}>¿Portas productos animales o vegetales?</p>
              <div className="flex gap-3 mb-5">
                {([{ val: false, label: "No" }, { val: true, label: "Sí" }] as const).map(({ val, label }) => (
                  <button key={label} onClick={() => setSagHasProducts(val)}
                    className="flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all"
                    style={{ background: sagHasProducts === val ? P.teal : "#fff", borderColor: sagHasProducts === val ? P.teal : "rgba(40,61,59,0.2)", color: sagHasProducts === val ? "#fff" : FG, minHeight: "44px" }}>
                    {label}
                  </button>
                ))}
              </div>
              {sagHasProducts && (
                <div className="mb-5">
                  <p className="text-sm font-semibold mb-3" style={{ color: FG }}>Selecciona las categorías:</p>
                  <div className="flex flex-col gap-1">
                    {sagItems.map(item => (
                      <label key={item} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" checked={sagCategories.includes(item)}
                          onChange={() => setSagCategories(prev =>
                            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
                          )}
                          className="w-4 h-4 accent-[#197278]" />
                        <span className="text-sm" style={{ color: FG }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <OutlineBtn onClick={() => {}}>
                  <Upload size={15} /> Adjuntar documentación
                </OutlineBtn>
                <PrimaryBtn onClick={() => {
                  toast.success("Declaración SAG enviada");
                  nav("dash");
                }} disabled={sagHasProducts === null}>
                  Enviar declaración
                </PrimaryBtn>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  if (screen === "minor") {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Autorización de menor" back="dash" />
          <div className="p-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="p-3 rounded-xl mb-5 flex items-start gap-2" style={{ background: "rgba(25,114,120,0.06)" }}>
                <Baby size={16} color={P.teal} className="flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: "#5f7372" }}>
                  Si viajas con un menor sin ambos progenitores, debes adjuntar la autorización notarial correspondiente.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <FieldBlock label="Nombre completo del menor">
                  <input type="text" value={minorData.nombre}
                    onChange={e => setMinorData({ ...minorData, nombre: e.target.value })}
                    placeholder="María González López" className={inputBase} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="RUT del menor">
                  <input type="text" value={minorData.rut}
                    onChange={e => setMinorData({ ...minorData, rut: e.target.value })}
                    placeholder="23.456.789-0" className={inputBase} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="Fecha de nacimiento">
                  <input type="date" value={minorData.nacimiento}
                    onChange={e => setMinorData({ ...minorData, nacimiento: e.target.value })}
                    className={inputBase} style={inputSt} />
                </FieldBlock>
                <OutlineBtn onClick={() => {}}>
                  <Upload size={15} /> Adjuntar autorización notarial
                </OutlineBtn>
                <PrimaryBtn onClick={() => { toast.success("Autorización de menor registrada"); nav("dash"); }}>
                  Registrar autorización
                </PrimaryBtn>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  if (screen === "pet") {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Declarar mascota" back="dash" />
          <div className="p-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="flex flex-col gap-4">
                <FieldBlock label="Tipo de mascota">
                  <div className="flex gap-2">
                    {["Perro", "Gato", "Otro"].map(t => (
                      <button key={t} onClick={() => setPetData({ ...petData, tipo: t })}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                        style={{ background: petData.tipo === t ? P.teal : "#fff", borderColor: petData.tipo === t ? P.teal : "rgba(40,61,59,0.2)", color: petData.tipo === t ? "#fff" : FG, minHeight: "44px" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </FieldBlock>
                <FieldBlock label="Nombre">
                  <input value={petData.nombre} onChange={e => setPetData({ ...petData, nombre: e.target.value })}
                    placeholder="Firulais" className={inputBase} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="Raza">
                  <input value={petData.raza} onChange={e => setPetData({ ...petData, raza: e.target.value })}
                    placeholder="Labrador" className={inputBase} style={inputSt} />
                </FieldBlock>
                <FieldBlock label="Edad (años)">
                  <input value={petData.edad} onChange={e => setPetData({ ...petData, edad: e.target.value })}
                    placeholder="3" className={inputBase} style={inputSt} />
                </FieldBlock>
                <OutlineBtn onClick={() => {}}>
                  <Upload size={15} /> Adjuntar certificado sanitario y vacunas
                </OutlineBtn>
                <PrimaryBtn onClick={() => { toast.success("Mascota registrada correctamente"); nav("dash"); }}>
                  Registrar mascota
                </PrimaryBtn>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  if (screen === "appointment") {
    const availableDays = [2, 3, 5, 6, 7, 10, 11, 12, 14, 15, 17, 18, 19, 21, 22, 24, 25, 26, 28, 29];
    const offset = 2;
    const times = [
      { id: "mañana", label: "Mañana", range: "08:00–12:00" },
      { id: "tarde",  label: "Tarde",  range: "12:00–18:00" },
      { id: "noche",  label: "Noche",  range: "18:00–22:00" },
    ];
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Reservar turno" back="dash" />
          <div className="p-4">
            {appointmentConfirmed ? (
              <div className="bg-white rounded-3xl p-7 shadow-sm text-center" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: P.successBg }}>
                  <CheckCircle size={32} color={P.success} />
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: FG }}>Turno reservado</h3>
                <p className="text-sm mb-1" style={{ color: "#5f7372" }}>Fecha: <strong style={{ color: FG }}>Jueves {selectedDate} de julio 2026</strong></p>
                <p className="text-sm mb-5" style={{ color: "#5f7372" }}>Horario: <strong style={{ color: FG }}>{selectedTime}</strong></p>
                <p className="text-xs p-3 rounded-xl" style={{ background: P.successBg, color: P.success }}>
                  Se ha enviado un recordatorio a tu correo electrónico
                </p>
                <button onClick={() => setAppointmentConfirmed(false)} className="mt-4 text-sm font-medium" style={{ color: P.teal }}>
                  Modificar reserva
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-5 shadow-sm" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base" style={{ color: FG }}>Julio 2026</h3>
                  <div className="flex gap-2">
                    {[ChevronLeft, ChevronDown].map((Icon, i) => (
                      <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(40,61,59,0.07)" }}>
                        <Icon size={15} color={P.darkGreen} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-7 mb-1">
                  {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map(d => (
                    <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: "#9aafae" }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: offset }).map((_, i) => <div key={`b${i}`} />)}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const avail = availableDays.includes(day);
                    const sel = selectedDate === day;
                    return (
                      <button key={day} disabled={!avail} onClick={() => setSelectedDate(day)}
                        className="aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
                        style={{ background: sel ? P.teal : avail ? "rgba(25,114,120,0.1)" : "transparent", color: sel ? "#fff" : avail ? P.teal : "#ccc", minHeight: "32px" }}>
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5">
                  <p className="text-sm font-semibold mb-2.5" style={{ color: FG }}>Selecciona horario:</p>
                  <div className="flex gap-2">
                    {times.map(t => (
                      <button key={t.id} onClick={() => setSelectedTime(`${t.label} (${t.range})`)}
                        className="flex-1 py-3 rounded-2xl text-center border-2 transition-all"
                        style={{ background: selectedTime.startsWith(t.label) ? P.teal : "#fff", borderColor: selectedTime.startsWith(t.label) ? P.teal : "rgba(40,61,59,0.2)", color: selectedTime.startsWith(t.label) ? "#fff" : FG }}>
                        <div className="text-xs font-bold">{t.label}</div>
                        <div className="text-xs opacity-70">{t.range}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <PrimaryBtn onClick={() => {
                    if (selectedDate && selectedTime) {
                      setAppointmentConfirmed(true);
                      toast.success("Turno reservado", { description: `Día ${selectedDate} jul · ${selectedTime}` });
                    }
                  }} disabled={!selectedDate || !selectedTime}>
                    Reservar turno
                  </PrimaryBtn>
                </div>
              </div>
            )}
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  if (screen === "tramites") {
    const list = [
      { id: "VEH-001", name: "Vehículo", status: vehicleData.patente ? "approved" : "pending", detail: vehicleData.patente ? `${vehicleData.marca} ${vehicleData.modelo} · ${vehicleData.patente}` : "No registrado" },
      { id: "SAG-001", name: "Declaración SAG", status: sagHasProducts !== null ? "approved" : "pending", detail: sagHasProducts === true ? "Con productos declarados" : sagHasProducts === false ? "Sin productos" : "Pendiente" },
      { id: "MEN-001", name: "Autorización menor", status: minorData.nombre ? "approved" : "pending", detail: minorData.nombre || "No registrado" },
      { id: "MAS-001", name: "Mascota", status: petData.nombre ? "approved" : "pending", detail: petData.nombre ? `${petData.tipo}: ${petData.nombre}` : "No registrada" },
      { id: "TUR-001", name: "Turno frontera", status: appointmentConfirmed ? "approved" : "pending", detail: appointmentConfirmed ? `Día ${selectedDate} jul · ${selectedTime}` : "Sin reserva" },
    ];
    const allOk = list.every(t => t.status === "approved");
    const SIcons: Record<string, React.ElementType> = { approved: CheckCircle, pending: Clock, rejected: XCircle };
    const cfgMap: Record<string, { color: string; bg: string; label: string }> = {
      approved: { color: P.success, bg: P.successBg, label: "Aprobado" },
      pending:  { color: P.warnColor, bg: P.warnBg, label: "Pendiente" },
      rejected: { color: P.red, bg: "#fde8e6", label: "Rechazado" },
    };
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Mis trámites" back="dash" />
          {allOk && (
            <div className="mx-4 mt-4 p-4 rounded-2xl flex items-center gap-3" style={{ background: P.successBg, border: `1px solid ${P.success}` }}>
              <CheckCircle size={22} color={P.success} />
              <div>
                <p className="font-bold text-sm" style={{ color: P.success }}>¡Listo para cruzar!</p>
                <p className="text-xs" style={{ color: P.success }}>Todos los trámites han sido aprobados</p>
              </div>
            </div>
          )}
          <div className="p-4 flex flex-col gap-3">
            {list.map(t => {
              const c = cfgMap[t.status];
              const SIcon = SIcons[t.status];
              return (
                <div key={t.id} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ border: "1px solid rgba(40,61,59,0.07)" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: FG }}>{t.name}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#7a9695" }}>{t.detail}</p>
                    <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full w-fit" style={{ background: c.bg }}>
                      <SIcon size={11} color={c.color} />
                      <span className="text-xs font-semibold" style={{ color: c.color }}>{c.label}</span>
                    </div>
                  </div>
                  <button onClick={() => { setTramiteQR(t.id); nav("qr"); }}
                    className="flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl flex-shrink-0"
                    style={{ background: "rgba(25,114,120,0.08)", color: P.teal }}>
                    <QrCode size={18} />
                    <span className="text-xs font-semibold">Ver QR</span>
                  </button>
                </div>
              );
            })}
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  if (screen === "qr") {
    const qrId = tramiteQR ?? "SFD-2026-001234";
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen pb-20" style={{ background: BG, fontFamily: "Inter, sans-serif" }}>
          <TravelerHeader title="Código QR" back="tramites" />
          <div className="p-4 flex flex-col items-center">
            <div className="bg-white rounded-3xl p-6 shadow-sm w-full max-w-xs" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
              <div className="w-full aspect-square p-4 rounded-2xl mb-4" style={{ border: "2px dashed rgba(40,61,59,0.15)" }}>
                <QRCodeSVG value={qrId} />
              </div>
              <div className="text-center mb-5">
                <p className="text-xs font-mono font-bold tracking-widest" style={{ color: P.teal }}>{qrId}</p>
                <p className="text-xs mt-1.5" style={{ color: "#9aafae" }}>
                  Válido hasta: <strong style={{ color: P.darkRed }}>21 Jul 2026, 23:59</strong>
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <PrimaryBtn onClick={() => toast.success("QR descargado correctamente")}>
                  <span className="flex items-center justify-center gap-2"><Download size={15} /> Descargar QR</span>
                </PrimaryBtn>
                <button onClick={() => nav("dash")} className="w-full py-3 rounded-2xl font-semibold text-sm"
                  style={{ background: "rgba(40,61,59,0.07)", color: FG, minHeight: "44px" }}>
                  Volver al dashboard
                </button>
              </div>
            </div>
          </div>
          <BottomNav />
        </div>
      </>
    );
  }

  // ── OFFICIAL VALIDATION PANEL ─────────────────────────────────────────────
  if (screen === "off-panel") {
    const traveler = {
      nombre: "Juan Alberto Pérez González", rut: "12.345.678-9", pasaporte: "AA123456",
      vehicle: { patente: "BCDF42", marca: "Toyota", modelo: "Hilux", anio: 2022, pais: "Chile" },
      pet: { tipo: "Perro", nombre: "Rex", raza: "Labrador", edad: 3 },
      sag: { categories: ["Frutas y verduras", "Lácteos y derivados"], docs: ["declaracion_sag.pdf"] },
    };
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen flex flex-col" style={{ background: "#eef2f2", fontFamily: "Inter, sans-serif" }}>
          <div className="flex items-center justify-between px-6 py-3.5 flex-shrink-0" style={{ background: P.darkGreen }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: P.teal }}>
                <Globe size={16} color="white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Salto Frontera Digital</p>
                <p className="text-xs" style={{ color: "#a8c5c2" }}>Panel de Validación · Cardenal Samoré</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell size={18} color="rgba(255,255,255,0.6)" />
              <div className="text-right">
                <p className="text-white text-sm font-semibold leading-tight">Carlos Muñoz</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: P.teal, color: "#fff" }}>Aduana</span>
              </div>
              <button onClick={() => nav("login")} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
                <LogOut size={15} /> Salir
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden min-h-0">
            <div className="w-72 flex-shrink-0 flex flex-col p-4 gap-4 overflow-y-auto" style={{ background: "#fff", borderRight: "1px solid rgba(40,61,59,0.1)" }}>
              <h3 className="font-bold text-sm" style={{ color: P.darkGreen }}>Escanear código QR</h3>
              <div className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center"
                style={{ background: "#1a2826", aspectRatio: "1", border: `2px solid ${P.teal}` }}>
                <Camera size={36} color={P.teal} className="opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 relative">
                    {[["top-0 left-0 border-t-2 border-l-2 rounded-tl"], ["top-0 right-0 border-t-2 border-r-2 rounded-tr"],
                      ["bottom-0 left-0 border-b-2 border-l-2 rounded-bl"], ["bottom-0 right-0 border-b-2 border-r-2 rounded-br"]
                    ].map(([cls], i) => <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: P.teal }} />)}
                  </div>
                </div>
                <p className="absolute bottom-2 text-xs font-medium" style={{ color: P.teal }}>Cámara activa</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: "rgba(40,61,59,0.1)" }} />
                <span className="text-xs" style={{ color: "#9aafae" }}>o ingresa código</span>
                <div className="flex-1 h-px" style={{ background: "rgba(40,61,59,0.1)" }} />
              </div>
              <div className="flex gap-2">
                <input value={scannedCode} onChange={e => setScannedCode(e.target.value)}
                  placeholder="SFD-2026-XXXXXX"
                  className="flex-1 px-3 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#197278]"
                  style={{ borderColor: "rgba(40,61,59,0.2)", color: P.darkGreen, minHeight: "44px" }} />
                <button onClick={() => setShowTravelerInfo(true)} className="px-3 rounded-xl text-white"
                  style={{ background: P.teal, minHeight: "44px" }}>
                  <Search size={16} />
                </button>
              </div>
              <button onClick={() => { setShowTravelerInfo(true); setCrossingRegistered(false); }}
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: P.teal }}>
                <ScanLine size={15} /> Simular escaneo
              </button>
              {showTravelerInfo && (
                <button onClick={() => { setShowTravelerInfo(false); setScannedCode(""); setCrossingRegistered(false); setApprovalStates({ vehicle: "pending", minor: "approved", pet: "pending", sag: "pending", pdi: "ok" }); }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: "rgba(196,69,54,0.07)", color: P.red }}>
                  <RefreshCw size={13} /> Nuevo escaneo
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {!showTravelerInfo ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <ScanLine size={52} color="#c8d8d7" className="mx-auto mb-3" />
                    <p className="text-sm font-medium" style={{ color: "#9aafae" }}>Escanea un código QR para ver la información del viajero</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl p-5 mb-4 flex items-center gap-4" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ background: P.darkGreen }}>JP</div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-base truncate" style={{ color: P.darkGreen }}>{traveler.nombre}</h2>
                      <p className="text-xs mt-0.5" style={{ color: "#7a9695" }}>RUT: {traveler.rut} · Pasaporte: {traveler.pasaporte}</p>
                      <p className="text-xs mt-1 font-mono font-semibold" style={{ color: P.teal }}>SFD-2026-{scannedCode || "001234"}</p>
                    </div>
                    {allApproved && !crossingRegistered && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: P.successBg }}>
                        <CheckCircle size={13} color={P.success} />
                        <span className="text-xs font-bold" style={{ color: P.success }}>Listo</span>
                      </div>
                    )}
                  </div>

                  {crossingRegistered ? (
                    <div className="bg-white rounded-2xl p-8 text-center" style={{ border: `2px solid ${P.success}` }}>
                      <CheckCircle size={48} color={P.success} className="mx-auto mb-3" />
                      <h3 className="text-xl font-bold mb-1" style={{ color: P.success }}>Cruce registrado</h3>
                      <p className="text-sm mb-0.5" style={{ color: "#5f7372" }}>Nº de cruce: <strong style={{ color: P.darkGreen }}>CRU-2026-008741</strong></p>
                      <p className="text-sm mb-5" style={{ color: "#5f7372" }}>Fecha y hora: <strong style={{ color: P.darkGreen }}>21 Jun 2026, 14:32</strong></p>
                      <div className="p-3.5 rounded-xl text-sm font-medium" style={{ background: P.successBg, color: P.success }}>
                        Se ha enviado el comprobante al correo del viajero (j.perez@gmail.com)
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1 mb-4 p-1 rounded-2xl" style={{ background: "#fff", border: "1px solid rgba(40,61,59,0.1)" }}>
                        {(["aduana", "pdi", "sag"] as const).map(tab => (
                          <button key={tab} onClick={() => setOfficialTab(tab)}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                            style={{ background: officialTab === tab ? P.darkGreen : "transparent", color: officialTab === tab ? "#fff" : P.darkGreen }}>
                            {tab === "aduana" ? "Aduana" : tab === "pdi" ? "PDI" : "SAG"}
                          </button>
                        ))}
                      </div>

                      <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                        {officialTab === "aduana" && (
                          <div className="flex flex-col gap-5">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: "#9aafae" }}>Vehículo registrado</h4>
                              <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "#f5f9f8" }}>
                                <div>
                                  <p className="text-sm font-semibold" style={{ color: P.darkGreen }}>
                                    <span className="font-mono">{traveler.vehicle.patente}</span> · {traveler.vehicle.marca} {traveler.vehicle.modelo} {traveler.vehicle.anio}
                                  </p>
                                  <p className="text-xs mt-0.5" style={{ color: "#7a9695" }}>Registro: {traveler.vehicle.pais}</p>
                                </div>
                                <StatusBadge status={approvalStates.vehicle} />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: "#9aafae" }}>Autorización de menor</h4>
                              <div className="p-3.5 rounded-xl" style={{ background: "#f5f9f8" }}>
                                <p className="text-sm" style={{ color: "#9aafae" }}>No aplica para este cruce</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: "#9aafae" }}>Mascota</h4>
                              <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "#f5f9f8" }}>
                                <div>
                                  <p className="text-sm font-semibold" style={{ color: P.darkGreen }}>
                                    {traveler.pet.tipo}: {traveler.pet.nombre} ({traveler.pet.raza}, {traveler.pet.edad} años)
                                  </p>
                                  <p className="text-xs mt-0.5" style={{ color: "#7a9695" }}>Certificado sanitario: adjunto</p>
                                </div>
                                <StatusBadge status={approvalStates.pet} />
                              </div>
                            </div>
                          </div>
                        )}
                        {officialTab === "pdi" && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#9aafae" }}>Antecedentes migratorios</h4>
                            <div className="flex items-center gap-3 p-4 rounded-xl mb-3" style={{ background: P.successBg }}>
                              <Shield size={22} color={P.success} />
                              <div>
                                <p className="font-bold text-sm" style={{ color: P.success }}>Sin alertas migratorias</p>
                                <p className="text-xs mt-0.5" style={{ color: "#5a9e6d" }}>Consultado: Interpol + base interna PDI</p>
                              </div>
                            </div>
                            <div className="p-3.5 rounded-xl" style={{ background: "#f5f9f8" }}>
                              <p className="text-xs font-bold mb-2" style={{ color: P.darkGreen }}>Historial de cruces recientes:</p>
                              {[["15 Mar 2026", "Los Libertadores", "Ingreso"], ["02 Feb 2026", "Cardenal Samoré", "Egreso"]].map(([date, paso, dir]) => (
                                <p key={date} className="text-xs py-0.5" style={{ color: "#7a9695" }}>{paso} — <span style={{ color: P.darkGreen }}>{date}</span> · {dir}</p>
                              ))}
                            </div>
                          </div>
                        )}
                        {officialTab === "sag" && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#9aafae" }}>Declaración jurada SAG</h4>
                            <div className="flex items-center justify-between p-3.5 rounded-xl mb-4" style={{ background: P.warnBg }}>
                              <div className="flex items-center gap-2">
                                <AlertCircle size={16} color={P.warnColor} />
                                <span className="text-sm font-bold" style={{ color: P.warnColor }}>Declara productos agropecuarios</span>
                              </div>
                              <StatusBadge status={approvalStates.sag} />
                            </div>
                            <p className="text-xs font-bold mb-2" style={{ color: P.darkGreen }}>Categorías declaradas:</p>
                            {traveler.sag.categories.map(c => (
                              <div key={c} className="flex items-center gap-2 py-2 border-b" style={{ borderColor: "rgba(40,61,59,0.07)" }}>
                                <Check size={13} color={P.teal} />
                                <span className="text-sm" style={{ color: P.darkGreen }}>{c}</span>
                              </div>
                            ))}
                            <p className="text-xs font-bold mt-3 mb-2" style={{ color: P.darkGreen }}>Documentación adjunta:</p>
                            {traveler.sag.docs.map(d => (
                              <div key={d} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "#f5f9f8" }}>
                                <FileText size={13} color={P.teal} />
                                <span className="text-xs font-mono font-semibold" style={{ color: P.teal }}>{d}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2.5 mb-3">
                        <button onClick={() => { setApprovalStates({ vehicle: "approved", minor: "approved", pet: "approved", sag: "approved", pdi: "ok" }); toast.success("Todos los trámites aprobados"); }}
                          className="flex-1 py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90"
                          style={{ background: P.success, minHeight: "44px" }}>
                          <CheckCircle size={15} /> Aprobar todo
                        </button>
                        <button onClick={() => setShowRejectDialog(true)}
                          className="flex-1 py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90"
                          style={{ background: P.red, minHeight: "44px" }}>
                          <XCircle size={15} /> Rechazar
                        </button>
                        <button onClick={() => setShowDocsDialog(true)}
                          className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90"
                          style={{ background: P.warnBg, color: P.warnColor, border: `1px solid ${P.warnColor}30`, minHeight: "44px" }}>
                          <AlertCircle size={15} /> Solicitar docs
                        </button>
                      </div>
                      {allApproved && (
                        <button onClick={() => { setCrossingRegistered(true); toast.success("Cruce registrado", { description: "CRU-2026-008741 · Comprobante enviado al viajero" }); }}
                          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90"
                          style={{ background: P.darkGreen, minHeight: "48px" }}>
                          <ArrowRight size={18} /> Registrar cruce
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {showRejectDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                <h3 className="font-bold mb-4" style={{ color: P.darkGreen }}>Motivo de rechazo</h3>
                <select className="w-full px-3 py-3 rounded-xl border text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#C44536]" style={{ borderColor: "rgba(40,61,59,0.2)", color: P.darkGreen }}>
                  <option>Documentación incompleta</option>
                  <option>Productos no declarados detectados</option>
                  <option>Datos del vehículo inconsistentes</option>
                  <option>Alerta migratoria activa</option>
                  <option>Certificado sanitario vencido</option>
                </select>
                <div className="flex gap-3">
                  <button onClick={() => setShowRejectDialog(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "rgba(40,61,59,0.08)", color: P.darkGreen }}>Cancelar</button>
                  <button onClick={() => { setApprovalStates(p => ({ ...p, vehicle: "rejected" })); setShowRejectDialog(false); toast.error("Trámite rechazado"); }}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: P.red }}>Confirmar rechazo</button>
                </div>
              </div>
            </div>
          )}
          {showDocsDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                <h3 className="font-bold mb-4" style={{ color: P.darkGreen }}>Solicitar documentación adicional</h3>
                <textarea rows={4} placeholder="Describe los documentos requeridos..." className="w-full px-3 py-3 rounded-xl border text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#197278]" style={{ borderColor: "rgba(40,61,59,0.2)", color: P.darkGreen }} />
                <div className="flex gap-3">
                  <button onClick={() => setShowDocsDialog(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "rgba(40,61,59,0.08)", color: P.darkGreen }}>Cancelar</button>
                  <button onClick={() => { setShowDocsDialog(false); toast.info("Solicitud enviada al viajero"); }}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: P.warnColor }}>Enviar solicitud</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ── ADMIN PANEL ───────────────────────────────────────────────────────────
  if (screen === "off-admin" || screen === "off-admin-users") {
    const isUsers = screen === "off-admin-users";
    const users = [
      { id: 1, name: "Carlos Muñoz",     email: "c.munoz@aduana.cl",  role: "Aduana", status: "active" },
      { id: 2, name: "Patricia Salinas", email: "p.salinas@pdi.cl",    role: "PDI",    status: "active" },
      { id: 3, name: "Roberto Vega",     email: "r.vega@sag.cl",       role: "SAG",    status: "blocked" },
      { id: 4, name: "Ana Torres",       email: "a.torres@aduana.cl", role: "Aduana", status: "active" },
      { id: 5, name: "Miguel Fuentes",   email: "m.fuentes@pdi.cl",    role: "PDI",    status: "active" },
    ];
    const roleColor: Record<string, { color: string; bg: string }> = {
      Aduana: { color: P.teal,      bg: "rgba(25,114,120,0.1)" },
      PDI:    { color: "#2563eb",   bg: "rgba(37,99,235,0.1)" },
      SAG:    { color: P.warnColor, bg: P.warnBg },
    };
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="min-h-screen flex" style={{ background: "#eef2f2", fontFamily: "Inter, sans-serif" }}>
          <div className="w-56 flex-shrink-0 flex flex-col" style={{ background: P.darkGreen }}>
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={17} color={P.teal} />
                <span className="text-white font-bold text-sm">SFD Admin</span>
              </div>
              <p className="text-xs" style={{ color: "#a8c5c2" }}>Panel administrativo</p>
            </div>
            {[
              { id: "off-admin" as Screen, Icon: BarChart3, label: "Reportes", active: !isUsers },
              { id: "off-admin-users" as Screen, Icon: Users, label: "Gestión usuarios", active: isUsers },
            ].map(({ id, Icon, label, active }) => (
              <button key={id} onClick={() => nav(id)}
                className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all"
                style={{ background: active ? "rgba(255,255,255,0.1)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.55)", borderLeft: `3px solid ${active ? P.teal : "transparent"}` }}>
                <Icon size={17} /> {label}
              </button>
            ))}
            <div className="mt-auto p-5">
              <button onClick={() => nav("login")} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            {!isUsers ? (
              <div>
                <h1 className="text-xl font-bold mb-6" style={{ color: P.darkGreen }}>Reportes</h1>
                <div className="bg-white rounded-2xl p-5 mb-5 flex flex-wrap gap-4 items-end" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                  {[["Fecha inicio", "2026-06-01"], ["Fecha fin", "2026-06-21"]].map(([label, val]) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold" style={{ color: P.darkGreen }}>{label}</label>
                      <input type="date" defaultValue={val} className="px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#197278]" style={{ borderColor: "rgba(40,61,59,0.2)", color: P.darkGreen }} />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold" style={{ color: P.darkGreen }}>Tipo</label>
                    <select className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: "rgba(40,61,59,0.2)", color: P.darkGreen }}>
                      <option>Personas y vehículos</option>
                      <option>Solo personas</option>
                      <option>Solo vehículos</option>
                      <option>Incidentes SAG</option>
                    </select>
                  </div>
                  <button onClick={() => setReportGenerated(true)} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold flex items-center gap-2" style={{ background: P.teal }}>
                    <BarChart3 size={15} /> Generar reporte
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {[
                    { label: "Cruces totales", value: "2,847", delta: "+12%", up: true },
                    { label: "Aprobados",       value: "2,701", delta: "+8%",  up: true },
                    { label: "Rechazados",      value: "146",   delta: "-3%",  up: false },
                    { label: "Tiempo promedio", value: "7 min", delta: "−62%", up: true },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                      <p className="text-xs font-semibold mb-1.5" style={{ color: "#7a9695" }}>{s.label}</p>
                      <p className="text-2xl font-bold" style={{ color: P.darkGreen }}>{s.value}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: s.up ? P.success : P.red }}>{s.delta} vs mes anterior</p>
                    </div>
                  ))}
                </div>
                {reportGenerated && (
                  <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(40,61,59,0.08)" }}>
                      <h3 className="font-bold text-sm" style={{ color: P.darkGreen }}>Vista previa · Jun 2026</h3>
                      <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-lg text-white text-xs font-bold" style={{ background: P.red }}>PDF</button>
                        <button className="px-4 py-1.5 rounded-lg text-white text-xs font-bold" style={{ background: P.success }}>Excel</button>
                      </div>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: "#f5f9f8" }}>
                          {["Fecha", "Nº Cruce", "Viajero", "Vehículo", "Institución", "Estado", "Tiempo"].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-bold" style={{ color: "#7a9695" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["21 Jun", "CRU-008741", "Juan Pérez G.",   "BCDF42", "Aduana", "approved", "6 min"],
                          ["21 Jun", "CRU-008740", "María López S.",  "XRTK89", "PDI",    "approved", "8 min"],
                          ["20 Jun", "CRU-008739", "Pedro Soto M.",   "MNZL34", "SAG",    "rejected", "12 min"],
                          ["20 Jun", "CRU-008738", "Ana Ruiz F.",     "PQRS56", "Aduana", "approved", "5 min"],
                          ["20 Jun", "CRU-008737", "Luis Vera C.",    "ABCD12", "PDI",    "approved", "9 min"],
                        ].map(([fecha, nro, viajero, patente, inst, estado, tiempo]) => (
                          <tr key={nro} className="border-t hover:bg-[#f5f9f8]" style={{ borderColor: "rgba(40,61,59,0.06)" }}>
                            <td className="px-4 py-3 text-xs" style={{ color: "#7a9695" }}>{fecha}</td>
                            <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color: P.teal }}>{nro}</td>
                            <td className="px-4 py-3 text-sm font-semibold" style={{ color: P.darkGreen }}>{viajero}</td>
                            <td className="px-4 py-3 text-xs font-mono font-bold" style={{ color: P.darkGreen }}>{patente}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: "#7a9695" }}>{inst}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: estado === "approved" ? P.successBg : "#fde8e6", color: estado === "approved" ? P.success : P.red }}>
                                {estado === "approved" ? "Aprobado" : "Rechazado"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-semibold" style={{ color: P.darkGreen }}>{tiempo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-xl font-bold" style={{ color: P.darkGreen }}>Gestión de usuarios</h1>
                  <button className="px-4 py-2.5 rounded-xl text-white text-sm font-bold flex items-center gap-2" style={{ background: P.teal }}>
                    <Plus size={15} /> Nuevo usuario
                  </button>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(40,61,59,0.08)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "#f5f9f8" }}>
                        {["Usuario", "Correo", "Rol", "Estado", "Acciones"].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-xs font-bold" style={{ color: "#7a9695" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-t hover:bg-[#f5f9f8]" style={{ borderColor: "rgba(40,61,59,0.06)" }}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: P.darkGreen }}>
                                {u.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                              </div>
                              <span className="font-semibold text-sm" style={{ color: P.darkGreen }}>{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs" style={{ color: "#7a9695" }}>{u.email}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: roleColor[u.role]?.bg, color: roleColor[u.role]?.color }}>{u.role}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: u.status === "active" ? P.successBg : "#fde8e6", color: u.status === "active" ? P.success : P.red }}>
                              {u.status === "active" ? "Activo" : "Bloqueado"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              <button className="p-1.5 rounded-lg hover:bg-[#e8f5f0]" aria-label="Editar"><Eye size={14} color={P.teal} /></button>
                              <button className="p-1.5 rounded-lg hover:bg-[#fef3c7]" aria-label="Bloquear"><Lock size={14} color={P.warnColor} /></button>
                              <button className="p-1.5 rounded-lg hover:bg-[#fde8e6]" aria-label="Eliminar"><X size={14} color={P.red} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return null;
}
