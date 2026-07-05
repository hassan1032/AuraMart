import { useCallback } from "react";

// Convert into AM & PM
export const useFormatTimeToAmPm = () => {
  const formatTimeToAmPm = useCallback((time) => {
    if (!time) return "";
    let [hours, minutes] = time.split(":").map(Number);
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }, []);
  return formatTimeToAmPm;
};


// Convert into 24 Hours
export const useConvertAmPmToHHMM = (time) => {
  const convertAmPmToHHMM = useCallback((time) => {
    if (!time) return "";
    let [t, ampm] = time.split(" "); // ["2:30", "PM"]
    let [hours, minutes] = t.split(":").map(Number);  // ["2" : "30"]

    if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;

    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }, []);

  return convertAmPmToHHMM;
};

// Date Format - dd:mm:yyyy
export const useDateFormat = () => {
  const formatDate = useCallback((date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  }, []);

  return formatDate;
}

// Date Format - dd-mm-yyyy - 2025-01-10T18:30:00.000Z
export const useFormatDate = () => {
  return useCallback((dateStr) => {
    if (!dateStr) return "";

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", dateStr);
        return "";
      }

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;   // DD-MM-YYYY
    } catch (err) {
      console.error("Error formatting date:", err);
      return "";
    }
  }, []);
};


// Date Format - yyyy-mm-dd
export const useBackendDateFormat = () => {
  const formatBackendDate = useCallback((date) => {
    if (!date) return;
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  }, []);

  return formatBackendDate;
}
