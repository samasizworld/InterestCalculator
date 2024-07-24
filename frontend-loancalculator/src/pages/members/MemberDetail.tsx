import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import './MemberDetail.css'; // Ensure this file exists and is correctly referenced

const apiUrl = 'http://localhost:4400/api/v1/';

const MemberDetail = () => {
    const { memberid } = useParams();
    const navigate = useNavigate();
    const [fields, setFields] = useState({
        Firstname: "",
        Middlename: "",
        Lastname: "",
        Emailaddress: ""
    });

    useEffect(() => {
        if (memberid != '0') {
            axios.get(`${apiUrl}members/${memberid}`, {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    setFields(res.data);
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Internal server error');
                });
        }

    }, [memberid]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFields(prevFields => ({ ...prevFields, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (memberid == '0') {
            axios.post(`${apiUrl}members`, JSON.stringify(fields), {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    toast.success('Record created.')
                    navigate(`/members/${res.data?.id}`);
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Internal server error');
                });
        } else {
            axios.put(`${apiUrl}members/${memberid}`,JSON.stringify(fields), {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    console.log(res.data);
                    toast.success('Record saved.')

                })
                .catch(err => {
                    console.error(err);
                    toast.error('Internal server error');
                });
        }


    }

    return (
        <div className="form-container">
            <div className="button-group-top">
                <Link to={`/members/${memberid}/loans`} className="view-button">View Loans</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstname">First Name</label>
                    <input
                        type="text"
                        id="firstname"
                        name="Firstname"
                        value={fields.Firstname || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input
                        type="text"
                        id="lastname"
                        name="Lastname"
                        value={fields.Lastname || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="middlename">Middle Name</label>
                    <input
                        type="text"
                        id="middlename"
                        name="Middlename"
                        value={fields.Middlename || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="emailaddress">Email Address</label>
                    <input
                        type="email"
                        id="emailaddress"
                        name="Emailaddress"
                        value={fields.Emailaddress || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="button-group-bottom">
                    <button type="submit" className="save-button">Save</button>
                </div>
            </form>
        </div>
    );
};

export default MemberDetail;
