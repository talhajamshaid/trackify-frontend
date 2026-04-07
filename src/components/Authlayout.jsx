import bgImage from "../assets/images/bg.png";
import logo from "../assets/images/svg.svg";

const AuthLayout = ({ title, subtitle, children, showLogo = true }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-buttonbg/80 z-0" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-lg border p-8">
        {/* Logo */}
        {showLogo && (
          <div className="flex justify-center items-center gap-3 mb-8">
            <img src={logo} alt="logo" className="h-[5.6rem] w-auto" />
            <div className="text-3xl font-bold text-buttonbg leading-tight">
              Trackify
            </div>
          </div>
        )}

        {/* Title + Subtitle */}
        {title && (
          <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
        )}
        {subtitle && (
          <p className="text-sm text-foreground/50 mb-7">{subtitle}</p>
        )}

        {/* Page content */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
