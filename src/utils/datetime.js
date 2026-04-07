export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getTodayDate = () => new Date().toISOString().split("T")[0];

// "Wednesday, March 6, 2024"
export const getTodayReadable = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// "Good Morning" / "Good Afternoon" / "Good Evening"
export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

// Age calculate karne ke liye
export const calcAge = (dob) => {
  if (!dob) return "—";
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

// Month, Day, Year format ke liye
export const formatDate = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
