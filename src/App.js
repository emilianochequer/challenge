import React, { useEffect, useState } from 'react';
import { Service } from './Service';
import moment from 'moment';

const filters = (filterType) => {
  return (data) => {
    switch (filterType) {
      case 'ALL':
        return data;
      case 'LATE':
        return data.paymentStatus === filterType;
      case 'DATE':
        const pastTime = new Date(data.leaseEndDate);
        const now = new Date();

        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

        const timeDiffInMs = now.getTime() - pastTime.getTime();

        return timeDiffInMs <= thirtyDaysInMs;
      default:
        return data;
    }
  };
};

function App() {
  const [tenants, setTenants] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const filterFunction = filters(typeFilter);

  useEffect(() => {
    Service.getTenants().then((data) => {
      setTenants(data);
    });
  }, [tenants]);

  return (
    <>
      <div className="container">
        <h1>Tenants</h1>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              onClick={() => setTypeFilter('ALL')}
              className="nav-link active"
              href="#"
            >
              All
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => setTypeFilter('LATE')}
              className="nav-link"
              href="#"
            >
              Payment is late
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => setTypeFilter('DATE')}
              className="nav-link"
              href="#"
            >
              Lease ends in less than a month
            </a>
          </li>
        </ul>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Payment Status</th>
              <th>Lease End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants?.filter(filterFunction).map((tenant, i) => (
              <tr key={i}>
                <th>{tenant.id}</th>
                <td>{tenant.name}</td>
                <td>{tenant.paymentStatus}</td>
                <td>{moment(tenant.leaseEndDate).format('DD/MM/YYYY')}</td>
                <td>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container">
        <button className="btn btn-secondary">Add Tenant</button>
      </div>
      <div className="container">
        <form>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" />
          </div>
          <div className="form-group">
            <label>Payment Status</label>
            <select className="form-control">
              <option>CURRENT</option>
              <option>LATE</option>
            </select>
          </div>
          <div className="form-group">
            <label>Lease End Date</label>
            <input className="form-control" />
          </div>
          <button className="btn btn-primary">Save</button>
          <button className="btn">Cancel</button>
        </form>
      </div>
    </>
  );
}

export default App;
