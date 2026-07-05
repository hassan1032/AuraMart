const ClearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('data')
    localStorage.removeItem('location_ip')
    localStorage.removeItem('location_latitude')
    localStorage.removeItem('location_longitude')
}

export default ClearSession; 