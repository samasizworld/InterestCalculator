import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import './MemberList.css';
let apiUrl = 'http://localhost:4400/api/v1/';

const MemberList = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [queryParams, setQueryParams] = useState({ pageSize: 10, page: 1, orderDir: '', orderBy: '', search: '' });
  const [total, setTotalCount] = useState(0);


  useEffect(() => {
    axios.get(`${apiUrl}members?search=${queryParams.search}&page=${queryParams.page}&pageSize=${queryParams.pageSize}&orderBy=${queryParams.orderBy}&orderDir=${queryParams.orderDir}`, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        const result = res.data;
        setMembers(result);
        setTotalCount(res.headers['x-count']);
      })
      .catch(err => {
        console.log(err)
        toast.error('Internal server error')
      });
  }, [queryParams]);

  const changePage = (page: any) => {
    setQueryParams({ ...queryParams, page });
  };

  const handleSearchFieldChange = (e: any) => {
    setQueryParams({ ...queryParams, search: e.target.value });
  };

  const totalPageToShow = Math.ceil(total / queryParams.pageSize);
  const arr = [];
  for (let i = queryParams.page; i <= totalPageToShow; i++) {
    arr.push(i);
  }

  return (
    <div className="member-container">
      <div className="header">
        <Link to={`/members/0`} className="add-button">
          Add
        </Link>
        <input
          className="search-input"
          type="search"
          placeholder="Search..."
          onChange={handleSearchFieldChange}
        />
      </div>
      <div className="table-container">
        <table className="member-table">
          <thead>
            <tr>
              <th>Displayname</th>
              <th>Emailaddress</th>
              <th>Datemodified</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.MemberId}>
                <td>{member.Displayname}</td>
                <td>{member.Emailaddress}</td>
                <td>{member.Datemodified}</td>
                <td>
                  <Link to={`/members/${member.MemberId}`}>View</Link>
                </td>
                <td>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {queryParams.page - 1 >= 1 && (
          <span className="pagination-arrow" onClick={() => changePage(queryParams.page - 1)}>
            {'<<'}
          </span>
        )}
        <ul className="pagination-list">
          {arr.map(num => (
            <li
              key={num}
              className={`pagination-item ${num === queryParams.page ? 'active' : ''}`}
              onClick={() => changePage(num)}
            >
              {num}
            </li>
          ))}
        </ul>
        {queryParams.page + 1 <= totalPageToShow && (
          <span className="pagination-arrow" onClick={() => changePage(queryParams.page + 1)}>
            {'>>'}
          </span>
        )}
      </div>
    </div>
  );
}

export default MemberList