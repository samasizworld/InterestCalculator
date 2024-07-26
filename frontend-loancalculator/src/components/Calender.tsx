import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const Calender = ({ value, handleDateChange }: any) => {
    // if (value) {
    //     const year = new Date(value).getFullYear();
    //     const month = new Date(value).getMonth() + 1;
    //     const day = new Date(value).getDate();
    //     // steps
    //     // datepicker sends date with 00:00:00 and timezone kathmandu 
    //     // but in payload, it sends utc time by subtracting 5 hr:45 min which leads issue. date can be prev date

    //     //  inorder to fix it, i make 5:45
    //     // while making payload it makes utc time by subtracting 545. It makes sure date always selected date 
    //     // value = new Date(`${year}-${month}-${day} 05:45:00`);
    //     value = new Date(`${year}-${month}-${day} 12:00:00`);

    //     console.log(value);
    // }
    return (
        <DatePicker selected={value} onChange={handleDateChange} dateFormat={"yyyy-MM-dd"} placeholderText={"yyyy-MM-dd"} />
    )
}

export default Calender