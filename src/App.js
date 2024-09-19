import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card.jsx';
import './styles.css';
import { ReactComponent as MenuIcon } from './icons/3-dot-menu.svg';
import { ReactComponent as DownIcon } from './icons/down.svg';
import { ReactComponent as BacklogIcon } from './icons/Backlog.svg';
import { ReactComponent as TodoIcon } from './icons/To-do.svg';
import { ReactComponent as InProgressIcon } from './icons/In-progress.svg';
import { ReactComponent as UrgentIcon } from './icons/SVG - Urgent Priority.svg';
import { ReactComponent as HighIcon } from './icons/Img - High Priority.svg';
import { ReactComponent as MediumIcon } from './icons/Img - Medium Priority.svg';
import { ReactComponent as LowIcon } from './icons/Img - Low Priority.svg';
import { ReactComponent as NoPriorityIcon } from './icons/No-priority.svg';

const priorityNames = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No priority',
};

const userNames = {
  "usr-1": "Anoop Sharma",
  "usr-2": "Yogesh",
  "usr-3": "Shankar Kumar",
  "usr-4": "Ramesh",
  "usr-5": "Suresh"
};

const statusIcons = {
  "Backlog": BacklogIcon,
  "Todo": TodoIcon,
  "In progress": InProgressIcon
};

const priorityIcons = {
  "Urgent": UrgentIcon,
  "High": HighIcon,
  "Medium": MediumIcon,
  "Low": LowIcon,
  "No priority": NoPriorityIcon
};

const App = () => {
  const [data, setData] = useState({ tickets: [] });
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || 'priority');
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'priority');

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        setData(response.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedOption', selectedOption);
    localStorage.setItem('sortOption', sortOption);
  }, [selectedOption, sortOption]);

  const groupTickets = () => {
    const grouped = {};

    data.tickets.forEach((ticket) => {
      let groupKey = '';

      if (selectedOption === 'priority') {
        groupKey = priorityNames[ticket.priority];
      } else if (selectedOption === 'status') {
        groupKey = ticket.status;
      } else if (selectedOption === 'user') {
        groupKey = userNames[ticket.userId];
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }

      grouped[groupKey].push(ticket);
    });

    Object.keys(grouped).forEach((groupKey) => {
      grouped[groupKey].sort((a, b) => {
        if (sortOption === 'priority') {
          return b.priority - a.priority;
        } else if (sortOption === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });

    return grouped;
  };

  const groupedTickets = groupTickets();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="menu-container">
        <button className="display-button" onClick={toggleMenu}>
          <MenuIcon className="icon" /> Display <DownIcon />
        </button>
        {isOpen && (
          <div className="popup-menu">
            <div className="menu-item">
              <span>Grouping</span>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="menu-item">
              <span>Ordering</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="main-div">
        {Object.entries(groupedTickets).map(([group, tickets]) => {
          const IconComponent = selectedOption === 'status' ? statusIcons[group] : selectedOption === 'priority' ? priorityIcons[group] : null;
          return (
            <div className="column" key={group}>
              <h2 className="group-header">
                {IconComponent && <IconComponent className="group-icon" />}
                {group} {tickets.length}
              </h2>
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  cam={ticket.id}
                  tag={ticket.tag[0]}
                  title={ticket.title}
                  priorityName={priorityNames[ticket.priority]}
                  userName={userNames[ticket.userId]}
                  status={ticket.status}
                  StatusIcon={statusIcons[ticket.status]}
                  PriorityIcon={priorityIcons[priorityNames[ticket.priority]]}
                />
              ))}
            </div>
          );
        })}
      </div>

    </>
  );
};

export default App;