import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Calender from "../../components/Calender";
import './LoanDetail.css';
import Modal from "../../components/Modal";

const apiUrl = 'http://localhost:4400/api/v1/';

const LoanDetail = () => {
    const { memberid, loanid } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState<any>({ Amount: "", LoanTakenDate: "" });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [interest, setInterest] = useState<any>({});
    const [displayname, setDisplayname] = useState<any>('');

    useEffect(() => {
        if (loanid != '0') {
            axios.get(`${apiUrl}members/${memberid}/loans/${loanid}`, {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    const transactions = res.data.Transactions;
                    const { Amount, Loantakendate } = res.data;
                    setTransactions(transactions);
                    setLoan({ Amount: Amount || "", LoanTakenDate: Loantakendate || "" });
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Internal server error');
                });
        }

        axios.get(`${apiUrl}members/${memberid}`, {
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => {
                setDisplayname(res.data.Firstname);
            })
            .catch(err => {
                console.error(err);
                toast.error('Internal server error');
            });

    }, []);

    const handleInputChange1 = (e: any) => {
        const { name, value } = e.target;
        setLoan((l: any) => ({ ...l, [name]: value }));
    };

    const handleDateChange1 = (date: any) => {
        setLoan((l: any) => ({ ...l, LoanTakenDate: date }));
    };

    const handleDateChange = (date: any, index: number) => {
        setTransactions((prevTransactions: any[]) => {
            const updatedTransactions = [...prevTransactions];
            updatedTransactions[index] = { ...updatedTransactions[index], PaidDate: date };
            return updatedTransactions;
        });
    };

    const addRows = () => {
        setTransactions((prevTransactions: any[]) => [
            ...prevTransactions,
            { PaidAmount: "", PaidDate: "" }
        ]);
    };

    const handleSave = (index: number, transactionId: string) => {
        const t = transactions[index];
        const payload = { LoanId: loanid, PaidAmount: t.PaidAmount, PaidDate: t.PaidDate };
        if (parseFloat(payload.PaidAmount) <= 0) {
            toast.error('Amount cannot be 0 or negative')
            return;
        }
        if (isNaN(payload.PaidAmount)) {
            toast.error('Please enter numeric value only.')
            return;
        }
        if (transactionId) {
            // update
            axios.put(`${apiUrl}loantransactions/${transactionId}`, JSON.stringify(payload), {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    console.log(res.data);
                    toast.success('Updated');
                })
                .catch(err => {
                    console.error(err);
                    if (err.response.status == 400) {
                        toast.error('Bad request');

                    } else {
                        toast.error('Internal server error');
                    }
                });
        } else {
            // add
            axios.post(`${apiUrl}loantransactions`, JSON.stringify(payload), {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    console.log(res.data);
                    toast.success('Record Saved');
                })
                .catch(err => {
                    console.error(err);
                    if (err.response.status == 400) {
                        toast.error('Bad request');

                    } else {
                        toast.error('Internal server error');
                    }
                });
        }
    };

    const handleDelete = (index: number, transactionId: string) => {
        if (transactionId) {
            // delete from db
            axios.delete(`${apiUrl}loantransactions/${transactionId}`, {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.error(err);
                    if (err.response.status == 400) {
                        toast.error('Bad request');

                    } else {
                        toast.error('Internal server error');
                    }
                });

        }
        setTransactions((prevTransactions: any[]) => {
            return prevTransactions.filter((_, i) => i !== index);
        });

        toast.success('Record Deleted');

    };

    const openModal = () => {
        axios.get(`${apiUrl}members/${memberid}/loans/${loanid}/calculate`, {
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => {
                setInterest(res.data)
            })
            .catch(err => {
                console.log(err)
                toast.error('Internal server error')
            });

        setShowModal(true);

    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (loanid == '0') {
            axios.post(`${apiUrl}members/${memberid}/loans`, JSON.stringify(loan), {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    toast.success('Record created.');
                    navigate(`/members/${memberid}/loans/${res.data.id}`)
                })
                .catch(err => {
                    console.log(err)
                    toast.error('Internal server error')
                });
        } else {
            axios.put(`${apiUrl}members/${memberid}/loans/${loanid}`, JSON.stringify(loan), {
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => {
                    console.log(res.data);
                    toast.success('Record saved.');
                })
                .catch(err => {
                    console.log(err)
                    toast.error('Internal server error')
                });

        }
    }

    const downloadFile = () => {
        const handleDownload = async () => {
            try {
                const response = await axios.patch(`${apiUrl}members/${memberid}/loans/${loanid}/download`, undefined, {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response)
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link: any = document.createElement('a');
                link.href = url;

                link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')); // Specify the filename
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
            }
        };
        handleDownload();
    }


    return (
        <div className="form-container">
            <h3>{displayname}{"'s Loan detail"}</h3>
            <button className="button-group-top" onClick={openModal} disabled={loanid == '0' ? true : false}>
                Calculate Interest
            </button>

            <button onClick={downloadFile} className="button-group-top" disabled={loanid == '0' ? true : false}>
                Download
            </button>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="amount">Principal Amount</label>
                    <input
                        type="text"
                        id="amount"
                        name="Amount"
                        value={loan.Amount || ""}
                        onChange={handleInputChange1}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="Loantakendate">Loan Taken Date</label>
                    <Calender
                        value={loan.LoanTakenDate || null}
                        handleDateChange={(date: any) => handleDateChange1(date)}
                    />
                </div>
                <div className="transaction-title">Transactions</div>
                <button
                    type="button"
                    className="add-more-button"
                    onClick={addRows}
                    disabled={loanid == '0' ? true : false}
                >
                    Add more
                </button>
                <ul className="transaction-list">
                    {transactions.map((t: any, index: number) => (
                        <li key={index}>
                            <div className="transaction-item">
                                <Calender
                                    value={t.PaidDate || null}
                                    handleDateChange={(date: any) => handleDateChange(date, index)}
                                />
                                <input
                                    type="text"
                                    name="PaidAmount"
                                    value={t.PaidAmount || ""}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setTransactions(prevTransactions => {
                                            const updatedTransactions = [...prevTransactions];
                                            updatedTransactions[index] = { ...updatedTransactions[index], [name]: value };
                                            return updatedTransactions;
                                        });
                                    }}
                                    className="form-input"
                                />
                                <div className="transaction-buttons">
                                    <button
                                        type="button"
                                        className="save-button"
                                        onClick={() => handleSave(index, t.LoanTransactionId)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => handleDelete(index, t.LoanTransactionId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="button-group-bottom">
                    <button type="submit" className="save-button">Save</button>
                </div>
            </form>
            <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                <div className="modal-content">
                    <h3>Interest Calculation Details</h3>
                    <div className="modal-content-row">
                        <span className="modal-content-label">Amount:</span>
                        <span className="modal-content-value">{interest.Principle || ''}</span>
                    </div>
                    <div className="modal-content-row">
                        <span className="modal-content-label">Interest:</span>
                        <span className="modal-content-value">{interest.InterestAmount}</span>
                    </div>
                    <div className="modal-content-row">
                        <span className="modal-content-label">Due Interest Amount:</span>
                        <span className="modal-content-value">{interest.DueInterestAmount}</span>
                    </div>
                    <div className="modal-content-row">
                        <span className="modal-content-label">Liable Interest:</span>
                        <span className="modal-content-value">{interest.LiableAmount}</span>
                    </div>
                    <div className="modal-content-row">
                        <span className="modal-content-label">Latest Paid Date:</span>
                        <span className="modal-content-value">{interest.LatestPaidDate}</span>
                    </div>
                    <div className="modal-content-row">
                        <span className="modal-content-label">Previously Paid Interest:</span>
                        <span className="modal-content-value">{interest.PreviouslyPaidInterest}</span>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default LoanDetail;
