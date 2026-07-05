function getCountryFromLatLon(lat, lon) {
    // India
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) return "IND";

    // UK
    if (lat >= 49 && lat <= 59 && lon >= -8 && lon <= 2) return "UK";

    // Dubai (UAE)
    if (lat >= 23 && lat <= 26 && lon >= 54 && lon <= 56) return "DUBAI";

    // Italy
    if (lat >= 36 && lat <= 47 && lon >= 6 && lon <= 18) return "ITALY";

    // Spain
    if (lat >= 36 && lat <= 44 && lon >= -9 && lon <= 4) return "SPAIN";

    // France
    if (lat >= 41 && lat <= 51 && lon >= -5 && lon <= 9) return "FRANCE";
    return null;
}
export default getCountryFromLatLon;
