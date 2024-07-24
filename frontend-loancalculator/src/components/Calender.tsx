import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const Calender = ({ value, handleDateChange }: any) => {
    return (
        <DatePicker selected={value} onChange={handleDateChange} dateFormat={"yyyy-MM-dd"} placeholderText={"yyyy-MM-dd"} />
    )
}

export default Calender