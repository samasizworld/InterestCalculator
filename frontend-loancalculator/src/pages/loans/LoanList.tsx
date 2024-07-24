import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
// import './MemberList.css';
let apiUrl = 'http://localhost:4400/api/v1/';

const LoanList = () => {
    const [loans, setLoans] = useState<any[]>([]);
    const { memberid } = useParams();
    useEffect(() => {
        axios.get(`${apiUrl}members/${memberid}/loans?pageSize=0`, {
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => {
                const result = res.data;
                setLoans(result);
            })
            .catch(err => {
                console.log(err)
                toast.error('Internal server error')
            });
    }, []);


    return (
        <div className="member-container">
            <Link to={`/members/${memberid}/loans/0`} className="add-button">
                Add
            </Link>
            <div className="table-container">
                <table className="member-table">
                    <thead>
                        <tr>
                            <th>Principle Amount</th>
                            <th>Loan Taken Date</th>
                            <th>Datemodified</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(loan => (
                            <tr key={loan.LoanId}>
                                <td>{loan.Amount}</td>
                                <td>{loan.Loantakendate}</td>
                                <td>{loan.Datemodified}</td>
                                <td>
                                    <Link to={`/members/${memberid}/loans/${loan.LoanId}`}>View</Link>
                                </td>
                                <td>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LoanList