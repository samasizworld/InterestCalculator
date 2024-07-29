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

    const [error, setError] = useState({
        Firstname: "Firstname mandatory.",
        Lastname: "Lastname mandatory.",
        Emailaddress: "Email mandatory."
    });

    useEffect(() => {
        if (memberid != '0') {
            axios.get(`${apiUrl}members/${memberid}`, {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    setFields(res.data);
                    setError({
                        Firstname: "",
                        Lastname: "",
                        Emailaddress: ""
                    });

                })
                .catch(err => {
                    console.error(err);
                    toast.error('Internal server error');
                });
        }

    }, [memberid]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        if (name == 'Firstname') {
            if (!value) {
                setError((prev: any) => {
                    const updated = { ...prev };
                    updated.Firstname = 'Firstname mandatory.';
                    return updated;
                });
            } else {
                setError((prev: any) => {
                    const updated = { ...prev };
                    updated.Firstname = '';
                    return updated;
                });
            }
        }
        if (name == 'Emailaddress') {
            if (!value?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                setError((prev: any) => {
                    const updated = { ...prev };
                    updated.Emailaddress = 'Invalid email address.';
                    return updated;
                });
            } else {
                setError((prev: any) => {
                    const updated = { ...prev };
                    updated.Emailaddress = '';
                    return updated;
                });
            }

        }

        if (name == 'Lastname') {
            if (!value) {
                setError((prev: any) => {
                    const updated = { ...prev };
                    updated.Lastname = 'Lastname mandatory.';
                    return updated;
                });
            } else {
                setError((prev: any) => {
                    const updated = { ...prev };
                    updated.Lastname = '';
                    return updated;
                });
            }
        }
        setFields(prevFields => ({ ...prevFields, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!fields.Emailaddress?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            toast.error('Invalid email address.');
            return;
        }

        if (!fields.Firstname) {
            toast.error('Firstname mandatory.');
            return;
        }

        if (!fields.Lastname) {
            toast.error('Lastname mandatory.');
            return;
        }

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
            axios.put(`${apiUrl}members/${memberid}`, JSON.stringify(fields), {
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
            {memberid != '0' ? <div className="button-group-top">
                <Link to={`/members/${memberid}/loans`} className="view-button">View Loans</Link>
            </div> : <></>}
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
                    {error.Firstname && <div style={{ color: 'red' }}>{error.Firstname}</div>}

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
                    <label htmlFor="lastname">Last Name</label>
                    <input
                        type="text"
                        id="lastname"
                        name="Lastname"
                        value={fields.Lastname || ''}
                        onChange={handleInputChange}
                    />
                    {error.Lastname && <div style={{ color: 'red' }}>{error.Lastname}</div>}

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
                    {error.Emailaddress && <div style={{ color: 'red' }}>{error.Emailaddress}</div>}

                </div>
                <div className="button-group-bottom">
                    <button type="submit" className="save-button" disabled={!!error.Firstname || !!error.Lastname || !!error.Emailaddress}>Save</button>
                </div>
            </form>
        </div>
    );
};

export default MemberDetail;
