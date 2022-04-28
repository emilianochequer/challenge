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

const sort = (sortType) => {
  console.log(sortType);
  return (a, b) => {
    switch (sortType) {
      case 'ID':
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      case 'NAME':
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      case 'PAYMENT_STATUS':
        if (a.paymentStatus < b.paymentStatus) {
          return -1;
        }
        if (a.paymentStatus > b.paymentStatus) {
          return 1;
        }
        return 0;
      case 'DATE':
        if (a.date < b.date) {
          return 1;
      }
      if (a.date > b.date) {
          return -1;
      }
      return 0;
      default:
        return a;
    }
  };
};

function App() {
  const [tenants, setTenants] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [typeSort, setTypeSort] = useState('ID');
  const filterFunction = filters(typeFilter);
  const sortFunction = sort(typeSort);

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
              className={`nav-link ${typeFilter === 'ALL' && 'active'}`}
              href="#"
            >
              All
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => setTypeFilter('LATE')}
              className={`nav-link ${typeFilter === 'LATE' && 'active'}`}
              href="#"
            >
              Payment is late
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => setTypeFilter('DATE')}
              className={`nav-link ${typeFilter === 'DATE' && 'active'}`}
              href="#"
            >
              Lease ends in less than a month
            </a>
          </li>
        </ul>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => setTypeSort('ID')}>#</th>
              <th onClick={() => setTypeSort('NAME')}>Name</th>
              <th onClick={() => setTypeSort('PAYMENT_STATUS')}>
                Payment Status
              </th>
              <th onClick={() => setTypeSort('DATE')}>Lease End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants
              ?.filter(filterFunction)
              ?.sort((a, b) => sortFunction(a, b))
              .map((tenant, i) => (
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
